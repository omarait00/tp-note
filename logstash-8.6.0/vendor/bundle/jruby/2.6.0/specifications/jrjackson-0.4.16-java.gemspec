# -*- encoding: utf-8 -*-
# stub: jrjackson 0.4.16 java lib

Gem::Specification.new do |s|
  s.name = "jrjackson".freeze
  s.version = "0.4.16"
  s.platform = "java".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Guy Boertje".freeze]
  s.date = "2022-07-08"
  s.description = "A mostly native JRuby wrapper for the java jackson json processor jar".freeze
  s.email = ["guyboertje@gmail.com".freeze]
  s.homepage = "http://github.com/guyboertje/jrjackson".freeze
  s.licenses = ["Apache License 2.0".freeze]
  s.requirements = ["jar com.fasterxml.jackson.core:jackson-core, 2.13.3".freeze, "jar com.fasterxml.jackson.core:jackson-annotations, 2.13.3".freeze, "jar com.fasterxml.jackson.core:jackson-databind, 2.13.3".freeze, "jar com.fasterxml.jackson.module:jackson-module-afterburner, 2.13.3".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "A JRuby wrapper for the java jackson json processor jar".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<bundler>.freeze, [">= 0"])
    s.add_development_dependency(%q<jar-dependencies>.freeze, ["< 2.0", ">= 0.3.2"])
  else
    s.add_dependency(%q<bundler>.freeze, [">= 0"])
    s.add_dependency(%q<jar-dependencies>.freeze, ["< 2.0", ">= 0.3.2"])
  end
end
