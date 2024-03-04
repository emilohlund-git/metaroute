import DocsCode from "@/components/DocsCode";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Docs() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection id="introduction">
        <h1 className="text-3xl font-bold mb-4">
          👋 Welcome to MetaRoute Documentation
        </h1>
        <i className="text-lg text-neutral-400">
          * This documentation is currently a work in progress and will be
          updated frequently. If you have any questions or suggestions, feel
          free to open an issue on the Github repository.
        </i>
        <p className="text-lg">
          MetaRoute is a passion project made for personal experience and
          exploration. It&apos;s a fully fleged API framework with tons of built
          in features. It operates through the use of decorators. The biggest
          reason for building this project was to try to make an API framework
          with next to no dependencies. The only dependencies used currently is
          Socket.IO & reflect-metadata.
        </p>
        <p className="text-lg">
          This documentation provides guidance on how to use MetaRoute. Whether
          you&apos;re a beginner getting started with API development or an
          experienced developer looking to streamline your workflow.
        </p>
      </DocsSection>

      <DocsSection id="installation">
        <DocsHeader text="Installation" />
        <i className="text-md text-red-400">
          * Since the package is currently deployed to Github Packages,
          you&apos;re going to need to specify using the github packages
          registry when installing the package.
        </i>
        <p className="text-lg">
          To install MetaRoute in your project, follow these simple steps:
        </p>
        <DocsCode language="bash">
          npm install @emilohlund-git/metaroute@latest --registry
          https://npm.pkg.github.com
        </DocsCode>
        <p className="text-lg mt-4">
          Alternatively, if you&apos;re using Yarn:
        </p>
        <DocsCode language="bash">
          yarn add metaroute --registry https://npm.pkg.github.com
        </DocsCode>
        <p className="text-lg mt-4">
          Once MetaRoute is installed, you&apos;re ready to start building your
          API&apos;s.
        </p>
      </DocsSection>

      <DocsSection id="usage">
        <DocsHeader text="Usage" />
        <p className="text-lg">
          To start using MetaRoute you first have to decorate a class with the{" "}
          <DocsCodeSnippet snippet="@App" /> decorator and extend the abstract
          class <DocsCodeSnippet snippet="Application" />. This will expose the
          class to the MetaRoute dependency container and setup all the
          framework configurators, as well as start the http / https server.
        </p>

        <DocsCode>
          {`@App({} // Configuration object)
export class MetaApp extends Application {}`}
        </DocsCode>

        <p className="text-lg">
          The <DocsCodeSnippet snippet="@App" /> decorator takes an{" "}
          <DocsCodeSnippet snippet="AppConfiguration" /> parameter which is an
          object with the following properties:
        </p>

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
