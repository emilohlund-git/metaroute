import React from "react";
import DocsContainer from "@/components/DocsContainer";
import DocsSection from "@/components/DocsSection";
import DocsHeader from "@/components/DocsHeader";
import DocsCode from "@/components/DocsCode";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";

export default function Logging() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      <DocsSection id="introduction">
        <DocsPageTitle title="Logging Service" />
        <DocsPageParagraph>
          The Logging Service in MetaRoute provides a built-in logging mechanism
          to log messages and events within your application. It allows you to
          record important information, errors, and warnings for debugging and
          monitoring purposes.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="how-it-works">
        <DocsHeader text="How it Works" />
        <DocsPageParagraph>
          MetaRoute&apos;s Logging Service allows you to create loggers with
          customizable contexts and log levels. You can use these loggers to log
          messages with different severity levels such as INFO, DEBUG, ERROR,
          and WARN.
        </DocsPageParagraph>
        <DocsPageParagraph>
          The Logging Service also supports formatting options and allows you to
          configure the log output format to suit your requirements.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="usage">
        <DocsHeader text="Usage" />
        <DocsPageParagraph>
          To use the Logging Service in MetaRoute, you can create logger
          instances with specific contexts and log messages using the provided
          methods.
        </DocsPageParagraph>
        <DocsCode language="javascript">
          {`import { ConsoleLogger } from 'metaroute-ts'; 

const logger = new ConsoleLogger('App');

logger.info('Application started');
logger.error('An error occurred: %s', error.message);`}
        </DocsCode>
        <DocsPageParagraph>
          You can then configure the logging output format and level from the
          environment variables or the logging configuration file to control the
          verbosity and format of the log messages.
        </DocsPageParagraph>

        <DocsPageParagraph>
          To change the log level and format, you can set the LOG_LEVEL and
          LOG_FORMAT environment variables.
        </DocsPageParagraph>

        <DocsCode language="bash">
          {`LOG_LEVEL="DEBUG"
LOG_FORMAT="[⚡ MetaRoute] - {timestamp} - {level} - {context} - {message}{data}"`}
        </DocsCode>

        <DocsPageParagraph>
          The LogLevel enum provides the following log levels:
        </DocsPageParagraph>

        <DocsCode language="typescript">
          {`export enum LogLevel {
  SILENT = "SILENT",
  INFO = "INFO",
  DEBUG = "DEBUG",
  WARN = "WARN",
  ERROR = "ERROR"
}`}
        </DocsCode>
      </DocsSection>
    </DocsContainer>
  );
}
