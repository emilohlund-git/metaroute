import React from "react";
import DocsContainer from "@/components/DocsContainer";
import DocsSection from "@/components/DocsSection";
import DocsHeader from "@/components/DocsHeader";
import DocsCode from "@/components/DocsCode";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";

export default function RateLimiting() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      <DocsSection id="introduction">
        <DocsPageTitle title="Rate Limiting" />
        <DocsPageParagraph>
          Rate Limiting in MetaRoute allows you to control the number of
          requests a client can make to your API within a certain timeframe.
          This is crucial for protecting your API from abuse and ensuring fair
          usage.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="how-it-works">
        <DocsHeader text="How it Works" />
        <DocsPageParagraph>
          MetaRoute uses the Token Bucket algorithm for rate limiting. Each
          client is assigned a bucket of tokens, with each token representing a
          single request. Tokens are refilled at a specified rate up to the
          bucket&apos;s capacity. When a request is made, a token is consumed. If the
          bucket is empty, the request is denied.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="usage">
        <DocsHeader text="Usage" />
        <DocsPageParagraph>
          To use rate limiting in MetaRoute, you need to decorate a controller
          handler with the `@RateLimit` decorator. This decorator takes in rate
          limiter options and a key as arguments.
        </DocsPageParagraph>
        <DocsCode language="javascript">
          {`import { RateLimit } from 'metaroute';

@RateLimit({ tokensPerSecond: 2, bucketSize: 5 }, 'rate-limit')
@Get('/')
async getPosts() {
    // Retrieve and return list of posts
}`}
        </DocsCode>
        <DocsPageParagraph>
          The middleware will limit the number of requests based on the IP
          address of the client. It also sets the following headers in the
          response:
        </DocsPageParagraph>
        <ul className="list-disc pl-6 mt-2">
          <li>
            <code>X-Ratelimit-Remaining</code>: The number of remaining requests
            that the client can make.
          </li>
          <li>
            <code>X-Ratelimit-Limit</code>: The maximum number of requests that
            the client can make.
          </li>
          <li>
            <code>X-Ratelimit-Retry-After</code>: The number of seconds the
            client should wait before making another request.
          </li>
        </ul>
      </DocsSection>
    </DocsContainer>
  );
}
