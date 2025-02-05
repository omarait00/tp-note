# -*- encoding: utf-8 -*-
# stub: logstash-input-azure_event_hubs 1.4.4 ruby lib vendor/jar-dependencies

Gem::Specification.new do |s|
  s.name = "logstash-input-azure_event_hubs".freeze
  s.version = "1.4.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "logstash_group" => "input", "logstash_plugin" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze, "vendor/jar-dependencies".freeze]
  s.authors = ["Elastic".freeze]
  s.date = "2022-06-13"
  s.description = "This gem is a Logstash plugin required to be installed on top of the Logstash core pipeline using $LS_HOME/bin/logstash-plugin install gemname. This gem is not a stand-alone program".freeze
  s.email = "info@elastic.co".freeze
  s.homepage = "http://www.elastic.co/guide/en/logstash/current/index.html".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "Consumes events from Azure Event Hubs for use with Logstash".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<logstash-core-plugin-api>.freeze, ["~> 2.0"])
    s.add_runtime_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<stud>.freeze, [">= 0.0.22"])
    s.add_development_dependency(%q<logstash-devutils>.freeze, [">= 1.0.0"])
  else
    s.add_dependency(%q<logstash-core-plugin-api>.freeze, ["~> 2.0"])
    s.add_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
    s.add_dependency(%q<stud>.freeze, [">= 0.0.22"])
    s.add_dependency(%q<logstash-devutils>.freeze, [">= 1.0.0"])
  end
end
