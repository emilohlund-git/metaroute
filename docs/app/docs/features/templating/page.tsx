import DocsCode from "@/components/DocsCode";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Templating() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <DocsPageTitle title="Templating Engine" />
        <DocsPageParagraph>
          The Templating Engine in MetaRoute allows you to render dynamic HTML
          content in your application. It provides a flexible and customizable
          way to generate HTML pages using templates and data.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="How it Works" />
        <DocsPageParagraph>
          MetaRoute&apos;s Templating Engine parses HTML templates with embedded
          template syntax and replaces the placeholders with actual data. It
          supports conditional statements, loops, and variable interpolation to
          generate dynamic content.
        </DocsPageParagraph>
        <DocsPageParagraph>
          By using the Templating Engine, you can separate the presentation
          logic from your application&apos;s business logic and create reusable
          templates for generating HTML content.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Usage" />
        <DocsPageParagraph>
          To render dynamic HTML content using the Templating Engine in
          MetaRoute, you need to define your HTML templates with embedded
          template syntax and provide the data to be rendered.
        </DocsPageParagraph>

        <DocsCode language="html">
          {`<template.html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
</head>
<body>
    <h1>{{heading}}</h1>
    <ul>
        {{#each items}}
            <li>{{this}}</li>
        {{/each}}
    </ul>
</body>
</html>

</template.html>`}
        </DocsCode>

        <DocsPageParagraph>
          You can then use the provided methods to render the template with the
          data and generate dynamic HTML content to be served to the client.
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  );
}
