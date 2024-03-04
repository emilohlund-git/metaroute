import React from "react";
import DocsContainer from "@/components/DocsContainer";
import DocsSection from "@/components/DocsSection";
import DocsHeader from "@/components/DocsHeader";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";
import DocsCode from "@/components/DocsCode";
import ScrollToAnchor from "@/components/ScrollToAnchor";

export default function Authentication() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      {/* Introduction Section */}
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Authentication</h1>
        <p className="text-lg">
          Authentication in MetaRoute allows you to verify the identity of users
          accessing your API endpoints, ensuring that only authorized users can
          perform certain actions, thereby enhancing security and control over
          your API.
        </p>
      </DocsSection>

      {/* How it works Section */}
      <DocsSection>
        <DocsHeader text="How it Works" />
        <p className="text-lg">
          MetaRoute provides built-in authentication mechanisms such as JSON Web
          Tokens (JWT) and OAuth to authenticate users. When a request is made
          to an authenticated route, MetaRoute validates the user&apos;s credentials
          and grants access if authentication is successful.
        </p>
        <p className="text-lg mt-4">
          Before using the <DocsCodeSnippet snippet="@Auth()" /> guard, ensure
          the following prerequisites are met:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>
            Set up a <DocsCodeSnippet snippet="JWT_SECRET" /> environment
            variable.
          </li>
        </ul>
        <p className="text-lg mt-4">
          The guard will utilize this secret to verify the token against the
          incoming authorization HTTP header.
        </p>
        <p className="text-lg mt-4">
          Authentication can be customized to support various authentication
          methods and user authentication flows, allowing you to implement
          secure authentication solutions tailored to your application&apos;s
          requirements.
        </p>
      </DocsSection>

      {/* Usage Section */}
      <DocsSection>
        <DocsHeader text="Usage" />
        <p className="text-lg">
          To use the <DocsCodeSnippet snippet="@Auth()" /> guard, first create a
          token using the following method:
        </p>
        <DocsCode language="javascript">
          {`import { JwtService } from 'metaroute';

const token = await JwtService.signTokenAsync(
  userData,
  this.configService.get("JWT_SECRET"),
  "15m"
);`}
        </DocsCode>
        <p className="text-lg">
          To verify the token, use the following method:
        </p>
        <DocsCode language="javascript">
          {`import { JwtService } from 'metaroute';

const token = JwtService.extractToken(req.headers.authorization);
const user = await JwtService.verifyTokenAsync(
  token,
  this.configService.get("JWT_SECRET")
);`}
        </DocsCode>
        <p className="text-lg">
          By using the <DocsCodeSnippet snippet="@Auth()" /> guard, you can
          ensure that the user is authenticated before the method is executed.
          Here&apos;s how you can use it in a controller:
        </p>
        <DocsCode language="javascript">
          {`import { Auth } from 'metaroute';

@Get()
@Auth()
async get() {
  return "Hello World!";
}`}
        </DocsCode>
      </DocsSection>
    </DocsContainer>
  );
}
