# -*- encoding: utf-8 -*-
# stub: logstash-mixin-validator_support 1.0.2 java lib

Gem::Specification.new do |s|
  s.name = "logstash-mixin-validator_support".freeze
  s.version = "1.0.2"
  s.platform = "java".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Elastic".freeze]
  s.date = "2021-12-06"
  s.description = "This gem is meant to be a dependency of any Logstash plugin that wishes to use validators introduced in recent versions of Logstash while maintaining backward-compatibility with earlier Logstashes. When used on older Logstash versions, it provides back-ports of the new validators.".freeze
  s.email = "info@elastic.co".freeze
  s.homepage = "https://github.com/logstash-plugins/logstash-mixin-validator_support".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "Support for the plugin parameter validations introduced in recent releases of Logstash, for plugins wishing to use them on older Logstashes".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<logstash-core>.freeze, [">= 6.8"])
    s.add_development_dependency(%q<rspec>.freeze, ["~> 3.9"])
    s.add_development_dependency(%q<logstash-devutils>.freeze, [">= 0"])
  else
    s.add_dependency(%q<logstash-core>.freeze, [">= 6.8"])
    s.add_dependency(%q<rspec>.freeze, ["~> 3.9"])
    s.add_dependency(%q<logstash-devutils>.freeze, [">= 0"])
  end
end
