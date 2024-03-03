import DocsCode from "@/components/DocsCode";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Email() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Email Server</h1>
        <p className="text-lg">
          The built-in Email Server in MetaRoute allows you to handle email
          communication within your application. It provides a quick-start
          approach to sending emails using SMTP.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="How it works" />
        <p className="text-lg">
          MetaRoute&apos;s Email Server utilizes the SMTP protocol to send emails. It
          allows you to configure the SMTP server details such as host,
          username, and password, and then use the provided methods to send
          emails from your application.
        </p>
        <p className="text-lg mt-4">
          By using the built-in Email Server, you can streamline the process of
          sending emails from your application without the need for additional
          dependencies or setup.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Usage" />
        <p className="text-lg">
          To send emails using the Email Server in MetaRoute, you can use the
          provided methods along with the SMTP configuration options.
        </p>

        <DocsCode>
          {`import { SmtpClient } from 'metaroute'; 

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

        <p className="text-lg mt-4">
          With the Email Server set up, you can easily send emails from your
          application by calling the{" "}
          <code className="bg-gray-100 p-1 rounded-md">sendEmail</code> function
          with the appropriate email content and SMTP configuration.
        </p>
      </DocsSection>
    </DocsContainer>
  );
}
