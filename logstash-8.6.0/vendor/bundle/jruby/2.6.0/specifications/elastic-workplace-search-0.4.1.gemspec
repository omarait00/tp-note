# -*- encoding: utf-8 -*-
# stub: elastic-workplace-search 0.4.1 ruby lib

Gem::Specification.new do |s|
  s.name = "elastic-workplace-search".freeze
  s.version = "0.4.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Quin Hoxie".freeze]
  s.date = "2020-02-20"
  s.description = "API client for accessing the Elastic Workplace Search API with no dependencies.".freeze
  s.email = ["support@elastic.co".freeze]
  s.homepage = "https://github.com/elastic/workplace-search-ruby".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "Official gem for accessing the Elastic Workplace Search API".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<rspec>.freeze, ["~> 3.0.0"])
    s.add_development_dependency(%q<awesome_print>.freeze, [">= 0"])
    s.add_development_dependency(%q<vcr>.freeze, ["~> 3.0.3"])
    s.add_development_dependency(%q<webmock>.freeze, [">= 0"])
  else
    s.add_dependency(%q<rspec>.freeze, ["~> 3.0.0"])
    s.add_dependency(%q<awesome_print>.freeze, [">= 0"])
    s.add_dependency(%q<vcr>.freeze, ["~> 3.0.3"])
    s.add_dependency(%q<webmock>.freeze, [">= 0"])
  end
end
