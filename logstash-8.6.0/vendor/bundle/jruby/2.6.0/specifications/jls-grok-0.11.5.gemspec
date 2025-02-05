# -*- encoding: utf-8 -*-
# stub: jls-grok 0.11.5 ruby lib lib

Gem::Specification.new do |s|
  s.name = "jls-grok".freeze
  s.version = "0.11.5"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze, "lib".freeze]
  s.authors = ["Jordan Sissel".freeze, "Pete Fritchman".freeze]
  s.date = "2018-04-30"
  s.description = "Grok ruby bindings - pattern match/extraction tool".freeze
  s.email = ["jls@semicomplete.com".freeze, "petef@databits.net".freeze]
  s.homepage = "http://code.google.com/p/semicomplete/wiki/Grok".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "grok bindings for ruby".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<cabin>.freeze, [">= 0.6.0"])
  else
    s.add_dependency(%q<cabin>.freeze, [">= 0.6.0"])
  end
end
