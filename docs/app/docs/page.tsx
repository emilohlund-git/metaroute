import DocsCode from "@/components/DocsCode";
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
          Welcome to MetaRoute Documentation
        </h1>
        <p className="text-lg">
          MetaRoute is a powerful API framework designed to simplify the process
          of building robust and scalable APIs. With its extensive features and
          intuitive design, MetaRoute empowers developers to create
          high-performance APIs with ease.
        </p>
        <p className="text-lg">
          This documentation provides comprehensive guidance on how to use
          MetaRoute to its full potential. Whether you&apos;re a beginner getting
          started with API development or an experienced developer looking to
          streamline your workflow, MetaRoute has you covered.
        </p>
      </DocsSection>

      <DocsSection id="installation">
        <DocsHeader text="Installation" />
        <p className="text-lg">
          To install MetaRoute in your project, follow these simple steps:
        </p>
        <DocsCode language="bash">
            npm i metaroute
        </DocsCode>
        <p className="text-lg mt-4">Alternatively, if you&apos;re using Yarn:</p>
        <DocsCode language="bash">
            yarn add metaroute
        </DocsCode>
        <p className="text-lg mt-4">
          Once MetaRoute is installed, you&apos;re ready to start building powerful
          APIs with ease.
        </p>
      </DocsSection>

      <DocsSection id="usage">
        <DocsHeader text="Usage" />
      
      </DocsSection>
    </DocsContainer>
  );
}
