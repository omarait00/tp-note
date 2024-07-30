# -*- encoding: utf-8 -*-
# stub: logstash-mixin-scheduler 1.0.1 java lib

Gem::Specification.new do |s|
  s.name = "logstash-mixin-scheduler".freeze
  s.version = "1.0.1"
  s.platform = "java".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Elastic".freeze]
  s.date = "2022-06-14"
  s.email = "info@elastic.co".freeze
  s.homepage = "https://github.com/logstash-plugins/logstash-mixin-scheduler".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "Scheduler for Logstash plugins".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<logstash-core>.freeze, [">= 7.16"])
    s.add_runtime_dependency(%q<rufus-scheduler>.freeze, [">= 3.0.9"])
    s.add_development_dependency(%q<logstash-devutils>.freeze, [">= 0"])
    s.add_development_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_development_dependency(%q<rspec>.freeze, ["~> 3.9"])
  else
    s.add_dependency(%q<logstash-core>.freeze, [">= 7.16"])
    s.add_dependency(%q<rufus-scheduler>.freeze, [">= 3.0.9"])
    s.add_dependency(%q<logstash-devutils>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_dependency(%q<rspec>.freeze, ["~> 3.9"])
  end
end
