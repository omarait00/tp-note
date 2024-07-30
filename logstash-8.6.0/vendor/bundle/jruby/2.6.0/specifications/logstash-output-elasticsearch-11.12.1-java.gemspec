# -*- encoding: utf-8 -*-
# stub: logstash-output-elasticsearch 11.12.1 java lib

Gem::Specification.new do |s|
  s.name = "logstash-output-elasticsearch".freeze
  s.version = "11.12.1"
  s.platform = "java".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "logstash_group" => "output", "logstash_plugin" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["Elastic".freeze]
  s.date = "2022-11-15"
  s.description = "This gem is a Logstash plugin required to be installed on top of the Logstash core pipeline using $LS_HOME/bin/logstash-plugin install gemname. This gem is not a stand-alone program".freeze
  s.email = "info@elastic.co".freeze
  s.homepage = "http://logstash.net/".freeze
  s.licenses = ["apache-2.0".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "Stores logs in Elasticsearch".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<manticore>.freeze, [">= 0.8.0", "< 1.0.0"])
    s.add_runtime_dependency(%q<stud>.freeze, [">= 0.0.17", "~> 0.0"])
    s.add_runtime_dependency(%q<logstash-core-plugin-api>.freeze, [">= 1.60", "<= 2.99"])
    s.add_runtime_dependency(%q<logstash-mixin-ecs_compatibility_support>.freeze, ["~> 1.0"])
    s.add_runtime_dependency(%q<logstash-mixin-deprecation_logger_support>.freeze, ["~> 1.0"])
    s.add_runtime_dependency(%q<logstash-mixin-ca_trusted_fingerprint_support>.freeze, ["~> 1.0"])
    s.add_development_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_development_dependency(%q<logstash-devutils>.freeze, [">= 0"])
    s.add_development_dependency(%q<flores>.freeze, [">= 0"])
    s.add_development_dependency(%q<cabin>.freeze, ["~> 0.6"])
    s.add_development_dependency(%q<webrick>.freeze, [">= 0"])
    s.add_development_dependency(%q<webmock>.freeze, [">= 0"])
    s.add_development_dependency(%q<rspec-collection_matchers>.freeze, [">= 0"])
    s.add_development_dependency(%q<elasticsearch>.freeze, [">= 0"])
  else
    s.add_dependency(%q<manticore>.freeze, [">= 0.8.0", "< 1.0.0"])
    s.add_dependency(%q<stud>.freeze, [">= 0.0.17", "~> 0.0"])
    s.add_dependency(%q<logstash-core-plugin-api>.freeze, [">= 1.60", "<= 2.99"])
    s.add_dependency(%q<logstash-mixin-ecs_compatibility_support>.freeze, ["~> 1.0"])
    s.add_dependency(%q<logstash-mixin-deprecation_logger_support>.freeze, ["~> 1.0"])
    s.add_dependency(%q<logstash-mixin-ca_trusted_fingerprint_support>.freeze, ["~> 1.0"])
    s.add_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-devutils>.freeze, [">= 0"])
    s.add_dependency(%q<flores>.freeze, [">= 0"])
    s.add_dependency(%q<cabin>.freeze, ["~> 0.6"])
    s.add_dependency(%q<webrick>.freeze, [">= 0"])
    s.add_dependency(%q<webmock>.freeze, [">= 0"])
    s.add_dependency(%q<rspec-collection_matchers>.freeze, [">= 0"])
    s.add_dependency(%q<elasticsearch>.freeze, [">= 0"])
  end
end
