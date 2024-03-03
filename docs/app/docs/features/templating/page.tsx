import DocsCode from "@/components/DocsCode";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Templating() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Templating Engine</h1>
        <p className="text-lg">
          The Templating Engine in MetaRoute allows you to render dynamic HTML
          content in your application. It provides a flexible and customizable
          way to generate HTML pages using templates and data.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="How it works" />
        <p className="text-lg">
          MetaRoute&apos;s Templating Engine parses HTML templates with embedded
          template syntax and replaces the placeholders with actual data. It
          supports conditional statements, loops, and variable interpolation to
          generate dynamic content.
        </p>
        <p className="text-lg mt-4">
          By using the Templating Engine, you can separate the presentation
          logic from your application&apos;s business logic and create reusable
          templates for generating HTML content.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Usage" />
        <p className="text-lg">
          To render dynamic HTML content using the Templating Engine in
          MetaRoute, you need to define your HTML templates with embedded
          template syntax and provide the data to be rendered.
        </p>

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

        <p className="text-lg mt-4">
          You can then use the provided methods to render the template with the
          data and generate dynamic HTML content to be served to the client.
        </p>
      </DocsSection>
    </DocsContainer>
  );
}
