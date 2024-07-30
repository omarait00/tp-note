# -*- encoding: utf-8 -*-
# stub: logstash-mixin-deprecation_logger_support 1.0.0 java lib

Gem::Specification.new do |s|
  s.name = "logstash-mixin-deprecation_logger_support".freeze
  s.version = "1.0.0"
  s.platform = "java".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Elastic".freeze]
  s.date = "2020-01-14"
  s.description = "This gem is meant to be a dependency of any Logstash plugin that wishes to use the Deprecation Logger introduced in 7.6 while maintaining backward-compatibility with earlier Logstashes. When used on older Logstash versions, it provides an implementation of the deprecation logger that forwards deprecation messages to the normal logger at WARN-level with a `DEPRECATED` prefix.".freeze
  s.email = "info@elastic.co".freeze
  s.homepage = "https://github.com/logstash-plugins/logstash-mixin-deprecation_logger_support".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "Support for the Deprecation Logger introduced in Logstash 7.6, for plugins wishing to use this API on older Logstashes".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<logstash-core>.freeze, [">= 5.0.0"])
    s.add_development_dependency(%q<rspec>.freeze, ["~> 3.9"])
  else
    s.add_dependency(%q<logstash-core>.freeze, [">= 5.0.0"])
    s.add_dependency(%q<rspec>.freeze, ["~> 3.9"])
  end
end
