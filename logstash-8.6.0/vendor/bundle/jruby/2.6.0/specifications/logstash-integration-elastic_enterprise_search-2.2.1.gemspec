# -*- encoding: utf-8 -*-
# stub: logstash-integration-elastic_enterprise_search 2.2.1 ruby lib vendor/jar-dependencies

Gem::Specification.new do |s|
  s.name = "logstash-integration-elastic_enterprise_search".freeze
  s.version = "2.2.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "integration_plugins" => "logstash-output-elastic_app_search, logstash-output-elastic_workplace_search", "logstash_group" => "integration", "logstash_plugin" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze, "vendor/jar-dependencies".freeze]
  s.authors = ["Elastic".freeze]
  s.date = "2022-01-28"
  s.description = "This gem is a Logstash plugin required to be installed on top of the Logstash core pipeline using $LS_HOME/bin/logstash-plugin install gemname. This gem is not a stand-alone program.".freeze
  s.email = "info@elastic.co".freeze
  s.homepage = "http://www.elastic.co/guide/en/logstash/current/index.html".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "Integration with Elastic Enterprise Search - output plugins".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<logstash-core-plugin-api>.freeze, ["~> 2.0"])
    s.add_runtime_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<elastic-app-search>.freeze, ["~> 7.8.0"])
    s.add_runtime_dependency(%q<elastic-enterprise-search>.freeze, ["~> 7.16.0"])
    s.add_runtime_dependency(%q<elastic-workplace-search>.freeze, ["~> 0.4.1"])
    s.add_runtime_dependency(%q<logstash-mixin-deprecation_logger_support>.freeze, ["~> 1.0"])
    s.add_development_dependency(%q<logstash-devutils>.freeze, [">= 0"])
  else
    s.add_dependency(%q<logstash-core-plugin-api>.freeze, ["~> 2.0"])
    s.add_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_dependency(%q<elastic-app-search>.freeze, ["~> 7.8.0"])
    s.add_dependency(%q<elastic-enterprise-search>.freeze, ["~> 7.16.0"])
    s.add_dependency(%q<elastic-workplace-search>.freeze, ["~> 0.4.1"])
    s.add_dependency(%q<logstash-mixin-deprecation_logger_support>.freeze, ["~> 1.0"])
    s.add_dependency(%q<logstash-devutils>.freeze, [">= 0"])
  end
end
