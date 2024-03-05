import React from "react";
import DocsContainer from "@/components/DocsContainer";
import DocsSection from "@/components/DocsSection";
import DocsHeader from "@/components/DocsHeader";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";
import DocsCode from "@/components/DocsCode";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";

export default function Authentication() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      <DocsSection id="introduction">
        <DocsPageTitle title="Authentication" />
        <DocsPageParagraph>
          Authentication in MetaRoute allows you to verify the identity of users
          accessing your API endpoints, ensuring that only authorized users can
          perform certain actions, thereby enhancing security and control over
          your API.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="how-it-works">
        <DocsHeader text="How it Works" />
        <DocsPageParagraph>
          MetaRoute provides built-in authentication mechanisms such as JSON Web
          Tokens (JWT) and OAuth to authenticate users. When a request is made
          to an authenticated route, MetaRoute validates the user&apos;s
          credentials and grants access if authentication is successful.
        </DocsPageParagraph>
        <DocsPageParagraph>
          Before using the <DocsCodeSnippet snippet="@Auth()" /> guard, ensure
          the following prerequisites are met:
        </DocsPageParagraph>
        <ul className="list-disc pl-6 mt-2">
          <li>
            Set up a <DocsCodeSnippet snippet="JWT_SECRET" /> environment
            variable.
          </li>
        </ul>
        <DocsPageParagraph>
          The guard will utilize this secret to verify the token against the
          incoming authorization HTTP header.
        </DocsPageParagraph>
        <DocsPageParagraph>
          Authentication can be customized to support various authentication
          methods and user authentication flows, allowing you to implement
          secure authentication solutions tailored to your application&apos;s
          requirements.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="usage">
        <DocsHeader text="Usage" />
        <DocsPageParagraph>
          To use the <DocsCodeSnippet snippet="@Auth()" /> guard, first create a
          token using the following method:
        </DocsPageParagraph>
        <DocsCode language="javascript">
          {`import { JwtService } from 'metaroute-ts';

const token = await JwtService.signTokenAsync(
  userData,
  this.configService.get("JWT_SECRET"),
  "15m"
);`}
        </DocsCode>
        <DocsPageParagraph>
          To verify the token, use the following method:
        </DocsPageParagraph>
        <DocsCode language="javascript">
          {`import { JwtService } from 'metaroute-ts';

const token = JwtService.extractToken(req.headers.authorization);
const user = await JwtService.verifyTokenAsync(
  token,
  this.configService.get("JWT_SECRET")
);`}
        </DocsCode>
        <DocsPageParagraph>
          By using the <DocsCodeSnippet snippet="@Auth()" /> guard, you can
          ensure that the user is authenticated before the method is executed.
          Here&apos;s how you can use it in a controller:
        </DocsPageParagraph>
        <DocsCode language="javascript">
          {`import { Auth } from 'metaroute-ts';

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
