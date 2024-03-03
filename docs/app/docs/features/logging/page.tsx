import DocsCode from "@/components/DocsCode";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Logging() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Logging Service</h1>
        <p className="text-lg">
          The Logging Service in MetaRoute provides a built-in logging mechanism
          to log messages and events within your application. It allows you to
          record important information, errors, and warnings for debugging and
          monitoring purposes.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="How it works" />
        <p className="text-lg">
          MetaRoute&apos;s Logging Service allows you to create loggers with
          customizable contexts and log levels. You can use these loggers to log
          messages with different severity levels such as INFO, DEBUG, ERROR,
          and WARNING.
        </p>
        <p className="text-lg mt-4">
          The Logging Service also supports formatting options and allows you to
          configure the log output format to suit your requirements.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Usage" />
        <p className="text-lg">
          To use the Logging Service in MetaRoute, you can create logger
          instances with specific contexts and log messages using the provided
          methods.
        </p>

        <DocsCode>
          {`import { ConsoleLogger } from 'metaroute'; 

const logger = new ConsoleLogger('App');

logger.info('Application started');
logger.error('An error occurred: %s', error.message);`}
        </DocsCode>

        <p className="text-lg mt-4">
          You can then configure the logging output format and level from the
          environment variables or the logging configuration file to control the
          verbosity and format of the log messages.
        </p>
      </DocsSection>
    </DocsContainer>
  );
}
