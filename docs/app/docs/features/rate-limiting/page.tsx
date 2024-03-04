import React from "react";
import DocsContainer from "@/components/DocsContainer";
import DocsSection from "@/components/DocsSection";
import DocsHeader from "@/components/DocsHeader";
import DocsCode from "@/components/DocsCode";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";

export default function RateLimiting() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      {/* Introduction Section */}
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Rate Limiting</h1>
        <p className="text-lg">
          Rate Limiting in MetaRoute allows you to control the number of
          requests a client can make to your API within a certain timeframe.
          This is crucial for protecting your API from abuse and ensuring fair
          usage.
        </p>
      </DocsSection>

      {/* How it works Section */}
      <DocsSection>
        <DocsHeader text="How it Works" />
        <p className="text-lg">
          MetaRoute uses the Token Bucket algorithm for rate limiting. Each
          client is assigned a bucket of tokens, with each token representing a
          single request. Tokens are refilled at a specified rate up to the
          bucket's capacity. When a request is made, a token is consumed. If the
          bucket is empty, the request is denied.
        </p>
      </DocsSection>

      {/* Usage Section */}
      <DocsSection>
        <DocsHeader text="Usage" />
        <p className="text-lg">
          To use rate limiting in MetaRoute, you need to decorate a controller handler with the <DocsCodeSnippet snippet="@RateLimit" />{" "}
          decorator. This decorator takes in rate limiter options and a key as
          arguments.
        </p>
        <DocsCode language="javascript">
          {`import { RateLimit } from 'metaroute';

@RateLimit({ tokensPerSecond: 2, bucketSize: 5 }, 'rate-limit')
@Get('/')
async getPosts() {
    // Retrieve and return list of posts
}
`}
        </DocsCode>
        <p className="text-lg mt-4">
          The middleware will limit the number of requests based on the IP
          address of the client. It also sets the following headers in the
          response:
        </p>
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

        <p className="text-lg mt-4"></p>
      </DocsSection>
    </DocsContainer>
  );
}
