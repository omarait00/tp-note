# -*- encoding: utf-8 -*-
# stub: logstash-integration-jdbc 5.4.1 ruby lib vendor/jar-dependencies

Gem::Specification.new do |s|
  s.name = "logstash-integration-jdbc".freeze
  s.version = "5.4.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "integration_plugins" => "logstash-input-jdbc,logstash-filter-jdbc_streaming,logstash-filter-jdbc_static", "logstash_group" => "integration", "logstash_plugin" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze, "vendor/jar-dependencies".freeze]
  s.authors = ["Elastic".freeze]
  s.date = "2022-11-04"
  s.description = "This gem is a Logstash plugin required to be installed on top of the Logstash core pipeline using $LS_HOME/bin/logstash-plugin install gemname. This gem is not a stand-alone program".freeze
  s.email = "info@elastic.co".freeze
  s.homepage = "http://www.elastic.co/guide/en/logstash/current/index.html".freeze
  s.licenses = ["Apache License (2.0)".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "Integration with JDBC - input and filter plugins".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<jar-dependencies>.freeze, ["~> 0.3"])
    s.add_runtime_dependency(%q<logstash-core-plugin-api>.freeze, [">= 1.60", "<= 2.99"])
    s.add_runtime_dependency(%q<logstash-core>.freeze, [">= 6.5.0"])
    s.add_runtime_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<sequel>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<lru_redux>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<tzinfo>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<tzinfo-data>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<logstash-mixin-ecs_compatibility_support>.freeze, ["~> 1.3"])
    s.add_runtime_dependency(%q<logstash-mixin-validator_support>.freeze, ["~> 1.0"])
    s.add_runtime_dependency(%q<logstash-mixin-event_support>.freeze, ["~> 1.0"])
    s.add_runtime_dependency(%q<logstash-mixin-scheduler>.freeze, ["~> 1.0"])
    s.add_development_dependency(%q<childprocess>.freeze, [">= 0"])
    s.add_development_dependency(%q<logstash-devutils>.freeze, [">= 2.3"])
    s.add_development_dependency(%q<timecop>.freeze, [">= 0"])
    s.add_development_dependency(%q<jdbc-derby>.freeze, [">= 0"])
  else
    s.add_dependency(%q<jar-dependencies>.freeze, ["~> 0.3"])
    s.add_dependency(%q<logstash-core-plugin-api>.freeze, [">= 1.60", "<= 2.99"])
    s.add_dependency(%q<logstash-core>.freeze, [">= 6.5.0"])
    s.add_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_dependency(%q<sequel>.freeze, [">= 0"])
    s.add_dependency(%q<lru_redux>.freeze, [">= 0"])
    s.add_dependency(%q<tzinfo>.freeze, [">= 0"])
    s.add_dependency(%q<tzinfo-data>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-mixin-ecs_compatibility_support>.freeze, ["~> 1.3"])
    s.add_dependency(%q<logstash-mixin-validator_support>.freeze, ["~> 1.0"])
    s.add_dependency(%q<logstash-mixin-event_support>.freeze, ["~> 1.0"])
    s.add_dependency(%q<logstash-mixin-scheduler>.freeze, ["~> 1.0"])
    s.add_dependency(%q<childprocess>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-devutils>.freeze, [">= 2.3"])
    s.add_dependency(%q<timecop>.freeze, [">= 0"])
    s.add_dependency(%q<jdbc-derby>.freeze, [">= 0"])
  end
end
