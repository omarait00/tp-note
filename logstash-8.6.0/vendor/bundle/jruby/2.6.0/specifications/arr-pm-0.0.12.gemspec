# -*- encoding: utf-8 -*-
# stub: arr-pm 0.0.12 ruby lib lib

Gem::Specification.new do |s|
  s.name = "arr-pm".freeze
  s.version = "0.0.12"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze, "lib".freeze]
  s.authors = ["Jordan Sissel".freeze]
  s.date = "2022-09-19"
  s.description = "This library allows to you to read and write rpm packages. Written in pure ruby because librpm is not available on all systems".freeze
  s.email = ["jls@semicomplete.com".freeze]
  s.licenses = ["Apache 2".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "RPM reader and writer library".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<flores>.freeze, ["> 0"])
    s.add_development_dependency(%q<rspec>.freeze, ["> 3.0.0"])
    s.add_development_dependency(%q<stud>.freeze, [">= 0.0.23"])
    s.add_development_dependency(%q<insist>.freeze, [">= 1.0.0"])
  else
    s.add_dependency(%q<flores>.freeze, ["> 0"])
    s.add_dependency(%q<rspec>.freeze, ["> 3.0.0"])
    s.add_dependency(%q<stud>.freeze, [">= 0.0.23"])
    s.add_dependency(%q<insist>.freeze, [">= 1.0.0"])
  end
end
