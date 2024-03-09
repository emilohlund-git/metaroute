import React from "react";
import DocsContainer from "@/components/DocsContainer";
import DocsSection from "@/components/DocsSection";
import DocsHeader from "@/components/DocsHeader";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";
import DocsCode from "@/components/DocsCode";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";

export default function Email() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      <DocsSection id="introduction">
        <DocsPageTitle title="Email Server" />
        <DocsPageParagraph>
          The built-in Email Server in MetaRoute allows you to handle email
          communication within your application. It provides a quick-start
          approach to sending emails using SMTP.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="how-it-works">
        <DocsHeader text="How it Works" />
        <DocsPageParagraph>
          MetaRoute&apos;s Email Server utilizes the SMTP protocol to send
          emails. It allows you to configure the SMTP server details such as
          host, username, and password, and then use the provided methods to
          send emails from your application.
        </DocsPageParagraph>
        <DocsPageParagraph>
          By using the built-in Email Server, you can streamline the process of
          sending emails from your application without the need for additional
          dependencies or setup.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="usage">
        <DocsHeader text="Usage" />
        <DocsPageParagraph>
          To send emails using the Email Server in MetaRoute, you can use the
          provided methods along with the SMTP configuration options.
        </DocsPageParagraph>
        <DocsCode language="javascript">
          {`import { SmtpClient } from 'metaroute-ts'; 

async function sendEmail(email, options) {
    const smtpClient = new SmtpClient(options);
    try {
        const result = await smtpClient.send(email);
        return result;
    } catch (error) {
        // Handle error
    }
}`}
        </DocsCode>
        <DocsPageParagraph>
          With the Email Server set up, you can easily send emails from your
          application by calling the <DocsCodeSnippet snippet="sendEmail" />{" "}
          function with the appropriate email content and SMTP configuration.
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  );
}
