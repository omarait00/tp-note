# -*- encoding: utf-8 -*-
# stub: jruby-stdin-channel 0.2.0 java lib

Gem::Specification.new do |s|
  s.name = "jruby-stdin-channel".freeze
  s.version = "0.2.0"
  s.platform = "java".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Colin Surprenant".freeze]
  s.date = "2015-05-15"
  s.description = "JRuby extension to expose an interruptible NIO FileChannel for STDIN".freeze
  s.email = ["colin.surprenant@gmail.com".freeze]
  s.homepage = "http://github.com/colinsurprenant/jruby-stdin-channel".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "JRuby extension to expose an interruptible NIO FileChannel for STDIN".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<rspec>.freeze, [">= 2.0.0"])
    s.add_development_dependency(%q<rake>.freeze, [">= 10.0.0"])
  else
    s.add_dependency(%q<rspec>.freeze, [">= 2.0.0"])
    s.add_dependency(%q<rake>.freeze, [">= 10.0.0"])
  end
end
