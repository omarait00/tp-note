# -*- encoding: utf-8 -*-
# stub: cabin 0.9.0 ruby lib lib

Gem::Specification.new do |s|
  s.name = "cabin".freeze
  s.version = "0.9.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze, "lib".freeze]
  s.authors = ["Jordan Sissel".freeze]
  s.date = "2016-08-30"
  s.description = "This is an experiment to try and make logging more flexible and more consumable. Plain text logs are bullshit, let's emit structured and contextual logs. Metrics, too!".freeze
  s.email = ["jls@semicomplete.com".freeze]
  s.executables = ["rubygems-cabin-test".freeze]
  s.files = ["bin/rubygems-cabin-test".freeze]
  s.homepage = "https://github.com/jordansissel/ruby-cabin".freeze
  s.licenses = ["Apache License (2.0)".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "Experiments in structured and contextual logging".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<rake>.freeze, ["~> 10.4.2"])
  else
    s.add_dependency(%q<rake>.freeze, ["~> 10.4.2"])
  end
end
