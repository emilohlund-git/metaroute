import React from "react";
import DocsContainer from "@/components/DocsContainer";
import DocsSection from "@/components/DocsSection";
import DocsHeader from "@/components/DocsHeader";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";
import DocsCode from "@/components/DocsCode";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";
import DocsList from "@/components/DocsList"; // Assuming you've created this based on previous advice

export default function Authentication() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      <DocsSection id="introduction">
        <DocsPageTitle title="Authentication" />
        <DocsPageParagraph>
          In the digital world, securing your application&apos;s endpoints is
          paramount. MetaRoute&apos;s authentication system is designed to
          ensure that only authorized users can access your API, providing a
          robust layer of security. This section covers everything from setting
          up basic authentication to implementing advanced user verification
          mechanisms.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="how-it-works">
        <DocsHeader text="Understanding Authentication with MetaRoute" />
        <DocsPageParagraph>
          MetaRoute leverages modern authentication protocols, including JSON
          Web Tokens (JWT), to provide a secure and flexible authentication
          framework. This framework checks a user&apos;s credentials against the
          provided authentication details before granting access to protected
          routes.
        </DocsPageParagraph>
        <DocsPageParagraph>
          To ensure a smooth authentication process, consider the following
          prerequisites:
        </DocsPageParagraph>
        <DocsList
          items={[
            "A secure JWT_SECRET environment variable for token verification.",
            "Correct configuration of the authentication guards in your application.",
          ]}
        />
        <DocsPageParagraph>
          MetaRoute&apos;s customization options allow you to adapt the
          authentication process to fit your specific needs, enabling secure and
          efficient user verification.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="usage">
        <DocsHeader text="Implementing Authentication" />
        <DocsPageParagraph>
          Begin by generating and verifying authentication tokens using
          MetaRoute&apos;s built-in services. Here&apos;s a quick guide:
        </DocsPageParagraph>
        <DocsHeader text="Token Generation" />
        <DocsCode language="javascript">
          {`// Generate an authentication token
import { JwtService } from 'metaroute-ts';

async function generateToken(userData) {
  const token = await JwtService.signTokenAsync(
    userData,
    process.env.JWT_SECRET, // Use your secure environment variable
    { expiresIn: "15m" }    // Token expiration time
  );
  return token;
}`}
        </DocsCode>
        <DocsHeader text="Token Verification" />
        <DocsCode language="javascript">
          {`// Verify the authentication token
import { JwtService } from 'metaroute-ts';

async function verifyToken(req) {
  const token = JwtService.extractToken(req.headers.authorization);
  try {
    const user = await JwtService.verifyTokenAsync(token, process.env.JWT_SECRET);
    return user;
  } catch (error) {
    throw new AuthenticationError("Token verification failed.");
  }
}`}
        </DocsCode>
        <DocsPageParagraph>
          To protect your routes, utilize the{" "}
          <DocsCodeSnippet snippet="@Auth()" /> decorator. This ensures that
          only authenticated requests can access your endpoint:
        </DocsPageParagraph>
        <DocsCode language="javascript">
          {`// Protect your route with the @Auth() decorator
import { Auth } from 'metaroute-ts';

@Get('/protected')
@Auth()
async protectedRoute() {
  return "This route is protected.";
}`}
        </DocsCode>
        <DocsPageParagraph>
          By following these steps, you can effectively secure your API with
          MetaRoute&apos;s authentication system, ensuring that your data and
          resources remain accessible only to authorized users.
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  );
}
