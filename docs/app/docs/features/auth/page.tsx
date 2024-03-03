import DocsCode from "@/components/DocsCode";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Authentication() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Authentication</h1>
        <p className="text-lg">
          Authentication in MetaRoute allows you to verify the identity of users
          accessing your API endpoints. It ensures that only authorized users
          can perform certain actions, providing security and control over your
          API.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="How it works" />
        <p className="text-lg">
          MetaRoute provides built-in authentication mechanisms such as JSON Web
          Tokens (JWT) and OAuth to authenticate users. When a request is made
          to an authenticated route, MetaRoute validates the user&apos;s credentials
          and grants access if authentication is successful.
        </p>
        <p className="text-lg mt-4">
          Authentication can be customized to support various authentication
          methods and user authentication flows, allowing you to implement
          secure authentication solutions tailored to your application&apos;s
          requirements.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Usage" />
        <p className="text-lg">
          To enable authentication for a route in MetaRoute, you can use the{" "}
          <code className="bg-gray-100 p-1 rounded-md">{"@Auth()"}</code>{" "}
          decorator. This decorator restricts access to the route based on user
          authentication status.
        </p>

        <DocsCode>
          {`import { Auth } from 'metaroute'; 

@Auth()
async function getUserProfile(req, res) {
    // Access user profile data
}`}
        </DocsCode>

        <p className="text-lg mt-4">
          With authentication enabled, MetaRoute ensures that only authenticated
          users can access the protected route, enhancing the security of your
          API.
        </p>
      </DocsSection>
    </DocsContainer>
  );
}
