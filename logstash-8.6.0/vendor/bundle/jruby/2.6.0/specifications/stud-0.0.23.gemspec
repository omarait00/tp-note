# -*- encoding: utf-8 -*-
# stub: stud 0.0.23 ruby lib lib

Gem::Specification.new do |s|
  s.name = "stud".freeze
  s.version = "0.0.23"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze, "lib".freeze]
  s.authors = ["Jordan Sissel".freeze]
  s.date = "2017-07-21"
  s.description = "small reusable bits of code I'm tired of writing over and over. A library form of my software-patterns github repo.".freeze
  s.email = "jls@semicomplete.com".freeze
  s.homepage = "https://github.com/jordansissel/ruby-stud".freeze
  s.rubygems_version = "3.2.29".freeze
  s.summary = "stud - common code techniques".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<rspec>.freeze, [">= 0"])
    s.add_development_dependency(%q<insist>.freeze, [">= 0"])
  else
    s.add_dependency(%q<rspec>.freeze, [">= 0"])
    s.add_dependency(%q<insist>.freeze, [">= 0"])
  end
end
