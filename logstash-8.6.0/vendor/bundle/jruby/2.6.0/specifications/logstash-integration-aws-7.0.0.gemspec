# -*- encoding: utf-8 -*-
# stub: logstash-integration-aws 7.0.0 ruby lib

Gem::Specification.new do |s|
  s.name = "logstash-integration-aws".freeze
  s.version = "7.0.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "integration_plugins" => "logstash-codec-cloudfront,logstash-codec-cloudtrail,logstash-input-cloudwatch,logstash-input-s3,logstash-input-sqs,logstash-output-cloudwatch,logstash-output-s3,logstash-output-sns,logstash-output-sqs", "logstash_group" => "integration", "logstash_plugin" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["Elastic".freeze]
  s.date = "2022-07-25"
  s.description = "This gem is a Logstash plugin required to be installed on top of the Logstash core pipeline using $LS_HOME/bin/logstash-plugin install gemname. This gem is not a stand-alone program".freeze
  s.email = "info@elastic.co".freeze
  s.homepage = "http://www.elastic.co/guide/en/logstash/current/index.html".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.rubygems_version = "3.2.29".freeze
  s.summary = "Collection of Logstash plugins that integrate with AWS".freeze

  s.installed_by_version = "3.2.29" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<logstash-core-plugin-api>.freeze, [">= 2.1.12", "<= 2.99"])
    s.add_runtime_dependency(%q<concurrent-ruby>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<rufus-scheduler>.freeze, [">= 3.0.9"])
    s.add_runtime_dependency(%q<stud>.freeze, ["~> 0.0.22"])
    s.add_runtime_dependency(%q<aws-sdk-core>.freeze, ["~> 3"])
    s.add_runtime_dependency(%q<aws-sdk-s3>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<aws-sdk-sqs>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<aws-sdk-sns>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<aws-sdk-cloudwatch>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<aws-sdk-cloudfront>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<aws-sdk-resourcegroups>.freeze, [">= 0"])
    s.add_development_dependency(%q<logstash-codec-json_lines>.freeze, [">= 0"])
    s.add_development_dependency(%q<logstash-codec-multiline>.freeze, [">= 0"])
    s.add_development_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
    s.add_development_dependency(%q<logstash-codec-line>.freeze, [">= 0"])
    s.add_development_dependency(%q<logstash-devutils>.freeze, [">= 0"])
    s.add_development_dependency(%q<logstash-input-generator>.freeze, [">= 0"])
    s.add_development_dependency(%q<timecop>.freeze, [">= 0"])
  else
    s.add_dependency(%q<logstash-core-plugin-api>.freeze, [">= 2.1.12", "<= 2.99"])
    s.add_dependency(%q<concurrent-ruby>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-codec-plain>.freeze, [">= 0"])
    s.add_dependency(%q<rufus-scheduler>.freeze, [">= 3.0.9"])
    s.add_dependency(%q<stud>.freeze, ["~> 0.0.22"])
    s.add_dependency(%q<aws-sdk-core>.freeze, ["~> 3"])
    s.add_dependency(%q<aws-sdk-s3>.freeze, [">= 0"])
    s.add_dependency(%q<aws-sdk-sqs>.freeze, [">= 0"])
    s.add_dependency(%q<aws-sdk-sns>.freeze, [">= 0"])
    s.add_dependency(%q<aws-sdk-cloudwatch>.freeze, [">= 0"])
    s.add_dependency(%q<aws-sdk-cloudfront>.freeze, [">= 0"])
    s.add_dependency(%q<aws-sdk-resourcegroups>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-codec-json_lines>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-codec-multiline>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-codec-json>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-codec-line>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-devutils>.freeze, [">= 0"])
    s.add_dependency(%q<logstash-input-generator>.freeze, [">= 0"])
    s.add_dependency(%q<timecop>.freeze, [">= 0"])
  end
end
