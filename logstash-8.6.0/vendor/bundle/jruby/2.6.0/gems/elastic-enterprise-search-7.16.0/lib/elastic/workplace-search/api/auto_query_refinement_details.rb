# frozen_string_literal: true

# Licensed to Elasticsearch B.V. under one or more contributor
# license agreements. See the NOTICE file distributed with
# this work for additional information regarding copyright
# ownership. Elasticsearch B.V. licenses this file to you under
# the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

module Elastic
  module EnterpriseSearch
    module WorkplaceSearch
      module Actions
        # ContentSources - Retrieves a content source's automatic query refinement details
        # Retrieves a content source's automatic query refinement details
        #
        # @param content_source_id [String] Unique ID for a Custom API source, provided upon creation of a Custom API Source (*Required*)
        # @param arguments [Hash] endpoint arguments
        # @option arguments [Hash] :headers optional HTTP headers to send with the request
        #
        # @see https://www.elastic.co/guide/en/workplace-search/current/workplace-search-content-sources-api.html#get-automatic-query-refinement-details-api
        #
        def auto_query_refinement_details(content_source_id, arguments = {})
          raise ArgumentError, "Required parameter 'content_source_id' missing" unless content_source_id

          headers = arguments.delete(:headers) || {}

          request(
            :get,
            "api/ws/v1/sources/#{content_source_id}/automatic_query_refinement/",
            arguments,
            {},
            headers
          )
        end
      end
    end
  end
end
