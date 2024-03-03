import DocsCode from "@/components/DocsCode";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Caching() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Route Caching</h1>
        <p className="text-lg">
          Route caching in MetaRoute allows you to improve the performance of
          your API by caching the responses of specific routes. This can
          significantly reduce the response time and server load, resulting in a
          better user experience and lower operating costs.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="How it works" />
        <p className="text-lg">
          MetaRoute uses a built-in caching mechanism to store the responses of
          routes that are marked for caching. When a request is made to a cached
          route, MetaRoute checks if a cached response exists and returns it if
          available. If no cached response is found or if the cache has expired,
          MetaRoute generates a new response and caches it for future use.
        </p>
        <p className="text-lg mt-4">
          The caching behavior can be customized using options such as
          time-to-live (TTL) and maximum cache size. This allows you to
          fine-tune the caching behavior to suit your application&apos;s specific
          requirements.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Usage" />
        <p className="text-lg">
          To enable caching for a route in MetaRoute, simply use the{" "}
          <code className="bg-gray-100 p-1 rounded-md">{"@Cache()"}</code>{" "}
          decorator on the route handler function. You can specify options such
          as TTL and maximum cache size to customize the caching behavior.
        </p>

        <DocsCode>
          {`import { Cache } from 'metaroute'; 

@Cache({ ttl: 60, maxSize: 100 }) 
async function getPosts(req, res) { 
    // ... 
}`}
        </DocsCode>

        <p className="text-lg mt-4">
          With caching enabled, MetaRoute will automatically cache the response
          of the route and serve it from the cache for subsequent requests
          within the specified TTL.
        </p>
      </DocsSection>
    </DocsContainer>
  );
}
