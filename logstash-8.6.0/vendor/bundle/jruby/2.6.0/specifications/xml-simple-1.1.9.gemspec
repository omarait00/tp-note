# -*- encoding: utf-8 -*-
# stub: xml-simple 1.1.9 ruby lib

Gem::Specification.new do |s|
  s.name = "xml-simple".freeze
  s.version = "1.1.9"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Maik Schmidt".freeze]
  s.date = "2021-01-18"
  s.email = "contact@maik-schmidt.de".freeze
  s.homepage = "https://github.com/maik/xml-simple".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "A simple API for XML processing.".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<rexml>.freeze, [">= 0"])
  else
    s.add_dependency(%q<rexml>.freeze, [">= 0"])
  end
end
