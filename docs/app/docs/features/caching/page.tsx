import React from "react";
import DocsContainer from "@/components/DocsContainer";
import DocsSection from "@/components/DocsSection";
import DocsHeader from "@/components/DocsHeader";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";
import DocsCode from "@/components/DocsCode";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";

export default function Caching() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      <DocsSection id="introduction">
        <DocsPageTitle title="Route Caching" />
        <DocsPageParagraph>
          Route caching in MetaRoute allows you to improve the performance of
          your API by caching the responses of specific routes. This can
          significantly reduce the response time and server load, resulting in a
          better user experience and lower operating costs.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="how-it-works">
        <DocsHeader text="How it Works" />
        <DocsPageParagraph>
          MetaRoute uses a built-in caching mechanism to store the responses of
          routes that are marked for caching. When a request is made to a cached
          route, MetaRoute checks if a cached response exists and returns it if
          available. If no cached response is found or if the cache has expired,
          MetaRoute generates a new response and caches it for future use.
        </DocsPageParagraph>
        <DocsPageParagraph>
          The caching behavior can be customized using options such as
          time-to-live (TTL) and maximum cache size. This allows you to
          fine-tune the caching behavior to suit your application&apos;s
          specific requirements.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="usage">
        <DocsHeader text="Usage" />
        <DocsPageParagraph>
          To enable caching for a route in MetaRoute, simply use the{" "}
          <DocsCodeSnippet snippet="@Cache()" /> decorator on the route handler
          function. You can specify options such as TTL and maximum cache size
          to customize the caching behavior.
        </DocsPageParagraph>
        <DocsCode language="javascript">
          {`import { Cache } from 'metaroute'; 

@Cache({ ttl: 60, maxSize: 100 }) 
async function getPosts(req, res) { 
    // ... 
}`}
        </DocsCode>
        <DocsPageParagraph>
          With caching enabled, MetaRoute will automatically cache the response
          of the route and serve it from the cache for subsequent requests
          within the specified TTL.
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  );
}
