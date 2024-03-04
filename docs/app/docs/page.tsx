import DocsCode from "@/components/DocsCode";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Docs() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection id="introduction">
        <DocsPageTitle title="👋 Welcome to MetaRoute Documentation" />
        <DocsPageParagraph color="text-neutral-400" italic>
          * This documentation is currently a work in progress and will be
          updated frequently. If you have any questions or suggestions, feel
          free to open an issue on the Github repository.
        </DocsPageParagraph>
        <DocsPageParagraph>
          MetaRoute is a passion project made for personal experience and
          exploration. It&apos;s a fully fleged API framework with tons of built
          in features. It operates through the use of decorators. The biggest
          reason for building this project was to try to make an API framework
          with next to no dependencies. The only dependencies used currently is
          Socket.IO & reflect-metadata.
        </DocsPageParagraph>
        <DocsPageParagraph>
          This documentation provides guidance on how to use MetaRoute. Whether
          you&apos;re a beginner getting started with API development or an
          experienced developer looking to streamline your workflow.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="installation">
        <DocsHeader text="Installation" />
        <DocsPageParagraph color="text-red-400" italic size="sm">
          * Since the package is currently deployed to Github Packages,
          you&apos;re going to need to specify using the github packages
          registry when installing the package.
        </DocsPageParagraph>
        <DocsPageParagraph>
          To install MetaRoute in your project, follow these simple steps:
        </DocsPageParagraph>
        <DocsCode language="bash">
          npm install metaroute-ts
        </DocsCode>
        <DocsPageParagraph>
          Alternatively, if you&apos;re using Yarn:
        </DocsPageParagraph>
        <DocsCode language="bash">
          yarn add metaroute-ts
        </DocsCode>
        <DocsPageParagraph>
          Once MetaRoute is installed, you&apos;re ready to start building your
          API&apos;s.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="usage">
        <DocsHeader text="Usage" />
        <DocsPageParagraph>
          To start using MetaRoute you first have to decorate a class with the{" "}
          <DocsCodeSnippet snippet="@App" /> decorator and extend the abstract
          class <DocsCodeSnippet snippet="Application" />. This will expose the
          class to the MetaRoute dependency container and setup all the
          framework configurators, as well as start the http / https server.
        </DocsPageParagraph>

        <DocsCode>
          {`@App({} // Configuration object)
export class MetaApp extends Application {}`}
        </DocsCode>

        <DocsPageParagraph>
          The <DocsCodeSnippet snippet="@App" /> decorator takes an{" "}
          <DocsCodeSnippet snippet="AppConfiguration" /> parameter which is an
          object with the following properties:
        </DocsPageParagraph>

        <DocsCode>
          {`interface AppConfiguration {
  middleware?: Middleware[];
  errorMiddleware?: ErrorMiddleware[];
  // Defaults to 3000.
  port?: number; 
  // If you pass a cert.pem and key.pem the application will create a https server instead, defaults to http.
  ssl?: {
    key: string;
    cert: string;
  }; 
  // The rendering engine for dynamic HTML content, defaults to the built-in MetaEngine.
  engine?: Engine; 
}`}
        </DocsCode>
      </DocsSection>
    </DocsContainer>
  );
}
