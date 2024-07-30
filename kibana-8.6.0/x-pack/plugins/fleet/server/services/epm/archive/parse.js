"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._generatePackageInfoFromPaths = _generatePackageInfoFromPaths;
exports.expandDottedObject = exports.expandDottedEntries = void 0;
exports.generatePackageInfoFromArchiveBuffer = generatePackageInfoFromArchiveBuffer;
exports.parseAndVerifyDataStreams = parseAndVerifyDataStreams;
exports.parseAndVerifyInputs = parseAndVerifyInputs;
exports.parseAndVerifyPolicyTemplates = parseAndVerifyPolicyTemplates;
exports.parseAndVerifyStreams = parseAndVerifyStreams;
exports.parseAndVerifyVars = parseAndVerifyVars;
exports.parseDataStreamElasticsearchEntry = parseDataStreamElasticsearchEntry;
exports.parseDefaultIngestPipeline = parseDefaultIngestPipeline;
var _fs = require("fs");
var _util = require("util");
var _path = _interopRequireDefault(require("path"));
var _std = require("@kbn/std");
var _jsYaml = _interopRequireDefault(require("js-yaml"));
var _lodash = require("lodash");
var _major = _interopRequireDefault(require("semver/functions/major"));
var _prerelease = _interopRequireDefault(require("semver/functions/prerelease"));
var _types = require("../../../../common/types");
var _errors = require("../../../errors");
var _registry = require("../registry");
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const readFileAsync = (0, _util.promisify)(_fs.readFile);
const MANIFESTS = {};
const MANIFEST_NAME = 'manifest.yml';
const DEFAULT_RELEASE_VALUE = 'ga';

// Ingest pipelines are specified in a `data_stream/<name>/elasticsearch/ingest_pipeline/` directory where a `default`
// ingest pipeline should be specified by one of these filenames.
const DEFAULT_INGEST_PIPELINE_VALUE = 'default';
const DEFAULT_INGEST_PIPELINE_FILE_NAME_YML = 'default.yml';
const DEFAULT_INGEST_PIPELINE_FILE_NAME_JSON = 'default.json';

// Borrowed from https://github.com/elastic/kibana/blob/main/x-pack/plugins/security_solution/common/utils/expand_dotted.ts
// with some alterations around non-object values. The package registry service expands some dotted fields from manifest files,
// so we need to do the same here.
const expandDottedField = (dottedFieldName, val) => {
  const parts = dottedFieldName.split('.');
  if (parts.length === 1) {
    return {
      [parts[0]]: val
    };
  } else {
    return {
      [parts[0]]: expandDottedField(parts.slice(1).join('.'), val)
    };
  }
};
const expandDottedObject = (dottedObj = {}) => {
  if (typeof dottedObj !== 'object' || Array.isArray(dottedObj)) {
    return dottedObj;
  }
  return Object.entries(dottedObj).reduce((acc, [key, val]) => (0, _std.merge)(acc, expandDottedField(key, val)), {});
};
exports.expandDottedObject = expandDottedObject;
const expandDottedEntries = obj => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = expandDottedObject(value);
    return acc;
  }, {});
};

// not sure these are 100% correct but they do the job here
// keeping them local until others need them
exports.expandDottedEntries = expandDottedEntries;
// pro: guarantee only supplying known values. these keys must be in ArchivePackage. no typos or new values
// pro: any values added to these lists will be passed through by default
// pro & con: values do need to be shadowed / repeated from ArchivePackage, but perhaps we want to limit values
const requiredArchivePackageProps = ['name', 'version', 'description', 'title', 'format_version', 'owner'];
const optionalArchivePackageProps = ['readme', 'assets', 'data_streams', 'license', 'type', 'categories', 'conditions', 'screenshots', 'icons', 'policy_templates', 'release'];
const registryInputProps = Object.values(_types.RegistryInputKeys);
const registryVarsProps = Object.values(_types.RegistryVarsEntryKeys);
const registryPolicyTemplateProps = Object.values(_types.RegistryPolicyTemplateKeys);
const registryStreamProps = Object.values(_types.RegistryStreamKeys);
const registryDataStreamProps = Object.values(_types.RegistryDataStreamKeys);

/*
  This function generates a package info object (see type `ArchivePackage`) by parsing and verifying the `manifest.yml` file as well
  as the directory structure for the given package archive and other files adhering to the package spec: https://github.com/elastic/package-spec.

  Currently, this process is duplicative of logic that's already implemented in the Package Registry codebase,
  e.g. https://github.com/elastic/package-registry/blob/main/packages/package.go. Because of this duplication, it's likely for our parsing/verification
  logic to fall out of sync with the registry codebase's implementation.

  This should be addressed in https://github.com/elastic/kibana/issues/115032
  where we'll no longer use the package registry endpoint as a source of truth for package info objects, and instead Fleet will _always_ generate
  them in the manner implemented below.
*/
async function generatePackageInfoFromArchiveBuffer(archiveBuffer, contentType) {
  const entries = await (0, _.unpackBufferEntries)(archiveBuffer, contentType);
  const paths = [];
  entries.forEach(({
    path: bufferPath,
    buffer
  }) => {
    paths.push(bufferPath);
    if (bufferPath.endsWith(MANIFEST_NAME) && buffer) MANIFESTS[bufferPath] = buffer;
  });
  return {
    packageInfo: parseAndVerifyArchive(paths),
    paths
  };
}

/*
This is a util function for verifying packages from a directory not an archive.
It is only to be called from test scripts.
*/
async function _generatePackageInfoFromPaths(paths, topLevelDir) {
  await Promise.all(paths.map(async filePath => {
    if (filePath.endsWith(MANIFEST_NAME)) MANIFESTS[filePath] = await readFileAsync(filePath);
  }));
  return parseAndVerifyArchive(paths, topLevelDir);
}
function parseAndVerifyArchive(paths, topLevelDirOverride) {
  // The top-level directory must match pkgName-pkgVersion, and no other top-level files or directories may be present
  const toplevelDir = topLevelDirOverride || paths[0].split('/')[0];
  paths.forEach(filePath => {
    if (!filePath.startsWith(toplevelDir)) {
      throw new _errors.PackageInvalidArchiveError('Package contains more than one top-level directory.');
    }
  });

  // The package must contain a manifest file ...
  const manifestFile = _path.default.posix.join(toplevelDir, MANIFEST_NAME);
  const manifestBuffer = MANIFESTS[manifestFile];
  if (!paths.includes(manifestFile) || !manifestBuffer) {
    throw new _errors.PackageInvalidArchiveError(`Package must contain a top-level ${MANIFEST_NAME} file.`);
  }

  // ... which must be valid YAML
  let manifest;
  try {
    manifest = _jsYaml.default.safeLoad(manifestBuffer.toString());
  } catch (error) {
    throw new _errors.PackageInvalidArchiveError(`Could not parse top-level package manifest: ${error}.`);
  }

  // must have mandatory fields
  const reqGiven = (0, _lodash.pick)(manifest, requiredArchivePackageProps);
  const requiredKeysMatch = Object.keys(reqGiven).toString() === requiredArchivePackageProps.toString();
  if (!requiredKeysMatch) {
    const list = requiredArchivePackageProps.join(', ');
    throw new _errors.PackageInvalidArchiveError(`Invalid top-level package manifest: one or more fields missing of ${list}`);
  }

  // at least have all required properties
  // get optional values and combine into one object for the remaining operations
  const optGiven = (0, _lodash.pick)(manifest, optionalArchivePackageProps);
  const parsed = {
    ...reqGiven,
    ...optGiven
  };

  // Package name and version from the manifest must match those from the toplevel directory
  const pkgKey = (0, _registry.pkgToPkgKey)({
    name: parsed.name,
    version: parsed.version
  });
  if (!topLevelDirOverride && toplevelDir !== pkgKey) {
    throw new _errors.PackageInvalidArchiveError(`Name ${parsed.name} and version ${parsed.version} do not match top-level directory ${toplevelDir}`);
  }
  const parsedDataStreams = parseAndVerifyDataStreams(paths, parsed.name, parsed.version, topLevelDirOverride);
  if (parsedDataStreams.length) {
    parsed.data_streams = parsedDataStreams;
  }
  parsed.policy_templates = parseAndVerifyPolicyTemplates(manifest);

  // add readme if exists
  const readme = parseAndVerifyReadme(paths, parsed.name, parsed.version);
  if (readme) {
    parsed.readme = readme;
  }

  // If no `release` is specified, fall back to a value based on the `version` of the integration
  // to maintain backwards comptability. This is a temporary measure until the `release` field is
  // completely deprecated elsewhere in Fleet/Agent. See https://github.com/elastic/package-spec/issues/225
  if (!parsed.release) {
    parsed.release = (0, _prerelease.default)(parsed.version) || (0, _major.default)(parsed.version) < 1 ? 'beta' : 'ga';
  }

  // Ensure top-level variables are parsed as well
  if (manifest.vars) {
    parsed.vars = parseAndVerifyVars(manifest.vars, 'manifest.yml');
  }
  return parsed;
}
function parseAndVerifyReadme(paths, pkgName, pkgVersion) {
  const readmeRelPath = `/docs/README.md`;
  const readmePath = `${pkgName}-${pkgVersion}${readmeRelPath}`;
  return paths.includes(readmePath) ? `/package/${pkgName}/${pkgVersion}${readmeRelPath}` : null;
}
function parseAndVerifyDataStreams(paths, pkgName, pkgVersion, pkgBasePathOverride) {
  // A data stream is made up of a subdirectory of name-version/data_stream/, containing a manifest.yml
  const dataStreamPaths = new Set();
  const dataStreams = [];
  const pkgBasePath = pkgBasePathOverride || (0, _registry.pkgToPkgKey)({
    name: pkgName,
    version: pkgVersion
  });
  const dataStreamsBasePath = _path.default.posix.join(pkgBasePath, 'data_stream');
  // pick all paths matching name-version/data_stream/DATASTREAM_NAME/...
  // from those, pick all unique data stream names
  paths.forEach(filePath => {
    if (!filePath.startsWith(dataStreamsBasePath)) return;
    const streamWithoutPrefix = filePath.slice(dataStreamsBasePath.length);
    const [dataStreamPath] = streamWithoutPrefix.split('/').filter(v => v); // remove undefined incase of leading /
    if (dataStreamPath) dataStreamPaths.add(dataStreamPath);
  });
  dataStreamPaths.forEach(dataStreamPath => {
    const fullDataStreamPath = _path.default.posix.join(dataStreamsBasePath, dataStreamPath);
    const manifestFile = _path.default.posix.join(fullDataStreamPath, MANIFEST_NAME);
    const manifestBuffer = MANIFESTS[manifestFile];
    if (!paths.includes(manifestFile) || !manifestBuffer) {
      throw new _errors.PackageInvalidArchiveError(`No manifest.yml file found for data stream '${dataStreamPath}'`);
    }
    let manifest;
    try {
      manifest = _jsYaml.default.safeLoad(manifestBuffer.toString());
    } catch (error) {
      throw new _errors.PackageInvalidArchiveError(`Could not parse package manifest for data stream '${dataStreamPath}': ${error}.`);
    }
    const {
      title: dataStreamTitle,
      release = DEFAULT_RELEASE_VALUE,
      type,
      dataset,
      streams: manifestStreams,
      elasticsearch,
      ...restOfProps
    } = manifest;
    if (!(dataStreamTitle && type)) {
      throw new _errors.PackageInvalidArchiveError(`Invalid manifest for data stream '${dataStreamPath}': one or more fields missing of 'title', 'type'`);
    }
    const ingestPipeline = parseDefaultIngestPipeline(fullDataStreamPath, paths);
    const streams = parseAndVerifyStreams(manifestStreams, dataStreamPath);
    const parsedElasticsearchEntry = parseDataStreamElasticsearchEntry(elasticsearch, ingestPipeline);

    // Build up the stream object here so we can conditionally insert nullable fields. The package registry omits undefined
    // fields, so we're mimicking that behavior here.
    const dataStreamObject = {
      title: dataStreamTitle,
      release,
      type,
      package: pkgName,
      dataset: dataset || `${pkgName}.${dataStreamPath}`,
      path: dataStreamPath,
      elasticsearch: parsedElasticsearchEntry
    };
    if (ingestPipeline) {
      dataStreamObject.ingest_pipeline = ingestPipeline;
    }
    if (streams.length) {
      dataStreamObject.streams = streams;
    }
    dataStreams.push(Object.entries(restOfProps).reduce((validatedDataStream, [key, value]) => {
      if (registryDataStreamProps.includes(key)) {
        validatedDataStream[key] = value;
      }
      return validatedDataStream;
    }, dataStreamObject));
  });
  return dataStreams;
}
function parseAndVerifyStreams(manifestStreams, dataStreamPath) {
  const streams = [];
  if (manifestStreams && manifestStreams.length > 0) {
    manifestStreams.forEach(manifestStream => {
      const {
        input,
        title: streamTitle,
        vars: manifestVars,
        template_path: templatePath,
        ...restOfProps
      } = manifestStream;
      if (!(input && streamTitle)) {
        throw new _errors.PackageInvalidArchiveError(`Invalid manifest for data stream ${dataStreamPath}: stream is missing one or more fields of: input, title`);
      }
      const vars = parseAndVerifyVars(manifestVars, `data stream ${dataStreamPath}`);
      const streamObject = {
        input,
        title: streamTitle,
        template_path: templatePath || 'stream.yml.hbs'
      };
      if (vars.length) {
        streamObject.vars = vars;
      }
      streams.push(Object.entries(restOfProps).reduce((validatedStream, [key, value]) => {
        if (registryStreamProps.includes(key)) {
          // @ts-expect-error
          validatedStream[key] = value;
        }
        return validatedStream;
      }, streamObject));
    });
  }
  return streams;
}
function parseAndVerifyVars(manifestVars, location) {
  const vars = [];
  if (manifestVars && manifestVars.length > 0) {
    manifestVars.forEach(manifestVar => {
      const {
        name,
        type,
        ...restOfProps
      } = manifestVar;
      if (!(name && type)) {
        throw new _errors.PackageInvalidArchiveError(`Invalid var definition for ${location}: one of mandatory fields 'name' and 'type' missing in var: ${manifestVar}`);
      }
      vars.push(Object.entries(restOfProps).reduce((validatedVarEntry, [key, value]) => {
        if (registryVarsProps.includes(key)) {
          // @ts-expect-error
          validatedVarEntry[key] = value;
        }
        return validatedVarEntry;
      }, {
        name,
        type
      }));
    });
  }
  return vars;
}
function parseAndVerifyPolicyTemplates(manifest) {
  const policyTemplates = [];
  const manifestPolicyTemplates = manifest.policy_templates;
  if (manifestPolicyTemplates && manifestPolicyTemplates.length > 0) {
    manifestPolicyTemplates.forEach(policyTemplate => {
      const {
        name,
        title: policyTemplateTitle,
        description,
        inputs,
        input,
        multiple,
        ...restOfProps
      } = policyTemplate;
      if (!(name && policyTemplateTitle && description)) {
        throw new _errors.PackageInvalidArchiveError(`Invalid top-level manifest: one of mandatory fields 'name', 'title', 'description' is missing in policy template: ${policyTemplate}`);
      }
      let parsedInputs = [];
      if (inputs) {
        parsedInputs = parseAndVerifyInputs(inputs, `config template ${name}`);
      }

      // defaults to true if undefined, but may be explicitly set to false.
      let parsedMultiple = true;
      if (typeof multiple === 'boolean' && multiple === false) parsedMultiple = false;
      policyTemplates.push(Object.entries(restOfProps).reduce((validatedPolicyTemplate, [key, value]) => {
        if (registryPolicyTemplateProps.includes(key)) {
          // @ts-expect-error
          validatedPolicyTemplate[key] = value;
        }
        return validatedPolicyTemplate;
      }, {
        name,
        title: policyTemplateTitle,
        description,
        multiple: parsedMultiple,
        // template can only have one of input or inputs
        ...(!input ? {
          inputs: parsedInputs
        } : {
          input
        })
      }));
    });
  }
  return policyTemplates;
}
function parseAndVerifyInputs(manifestInputs, location) {
  const inputs = [];
  if (manifestInputs && manifestInputs.length > 0) {
    manifestInputs.forEach(input => {
      const {
        title: inputTitle,
        vars,
        ...restOfProps
      } = input;
      if (!(input.type && inputTitle)) {
        throw new _errors.PackageInvalidArchiveError(`Invalid top-level manifest: one of mandatory fields 'type', 'title' missing in input: ${input}`);
      }
      const parsedVars = parseAndVerifyVars(vars, location);
      inputs.push(Object.entries(restOfProps).reduce((validatedInput, [key, value]) => {
        if (registryInputProps.includes(key)) {
          // @ts-expect-error
          validatedInput[key] = value;
        }
        return validatedInput;
      }, {
        title: inputTitle,
        vars: parsedVars
      }));
    });
  }
  return inputs;
}
function parseDataStreamElasticsearchEntry(elasticsearch, ingestPipeline) {
  var _expandedElasticsearc, _expandedElasticsearc2;
  const parsedElasticsearchEntry = {};
  const expandedElasticsearch = expandDottedObject(elasticsearch);
  if (ingestPipeline) {
    parsedElasticsearchEntry['ingest_pipeline.name'] = ingestPipeline;
  }
  if (expandedElasticsearch !== null && expandedElasticsearch !== void 0 && expandedElasticsearch.privileges) {
    parsedElasticsearchEntry.privileges = expandedElasticsearch.privileges;
  }
  if (expandedElasticsearch !== null && expandedElasticsearch !== void 0 && expandedElasticsearch.source_mode) {
    parsedElasticsearchEntry.source_mode = expandedElasticsearch.source_mode;
  }
  if (expandedElasticsearch !== null && expandedElasticsearch !== void 0 && (_expandedElasticsearc = expandedElasticsearch.index_template) !== null && _expandedElasticsearc !== void 0 && _expandedElasticsearc.mappings) {
    parsedElasticsearchEntry['index_template.mappings'] = expandDottedEntries(expandedElasticsearch.index_template.mappings);
  }
  if (expandedElasticsearch !== null && expandedElasticsearch !== void 0 && (_expandedElasticsearc2 = expandedElasticsearch.index_template) !== null && _expandedElasticsearc2 !== void 0 && _expandedElasticsearc2.settings) {
    parsedElasticsearchEntry['index_template.settings'] = expandDottedEntries(expandedElasticsearch.index_template.settings);
  }
  if (expandedElasticsearch !== null && expandedElasticsearch !== void 0 && expandedElasticsearch.index_mode) {
    parsedElasticsearchEntry.index_mode = expandedElasticsearch.index_mode;
  }
  return parsedElasticsearchEntry;
}
const isDefaultPipelineFile = pipelinePath => pipelinePath.endsWith(DEFAULT_INGEST_PIPELINE_FILE_NAME_YML) || pipelinePath.endsWith(DEFAULT_INGEST_PIPELINE_FILE_NAME_JSON);
function parseDefaultIngestPipeline(fullDataStreamPath, paths) {
  const ingestPipelineDirPath = _path.default.posix.join(fullDataStreamPath, '/elasticsearch/ingest_pipeline');
  const defaultIngestPipelinePaths = paths.filter(pipelinePath => pipelinePath.startsWith(ingestPipelineDirPath) && isDefaultPipelineFile(pipelinePath));
  if (!defaultIngestPipelinePaths.length) return undefined;
  return DEFAULT_INGEST_PIPELINE_VALUE;
}