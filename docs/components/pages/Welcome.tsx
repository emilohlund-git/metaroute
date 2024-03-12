'use client'

import DocsCode from '@/components/DocsCode'
import DocsCodeSnippet from '@/components/DocsCodeSnippet'
import DocsContainer from '@/components/DocsContainer'
import DocsHeader from '@/components/DocsHeader'
import DocsList from '@/components/DocsList'
import { DocsPageParagraph } from '@/components/DocsPageParagraph'
import { DocsPageTitle } from '@/components/DocsPageTitle'
import DocsSection from '@/components/DocsSection'
import ScrollToAnchor from '@/components/ScrollToAnchor'
import React from 'react'

export default function Docs() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection id="welcome">
        <DocsPageTitle emoji={'👋'} title="Welcome" />
        <DocsPageParagraph color="text-neutral-400" italic>
          This documentation is designed to be comprehensive and user-friendly,
          guiding you through every step of using MetaRoute. Whether you&apos;re
          starting your journey in API development or you&apos;re an experienced
          developer looking to enhance your projects, you&apos;ll find valuable
          insights and tips here.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="about-metaroute">
        <DocsHeader text="About MetaRoute" />
        <DocsPageParagraph>
          MetaRoute is a passion project aimed at simplifying API development.
          It&apos;s a lightweight, fully-featured API framework that leverages
          decorators for a clean and intuitive coding experience. Built with
          minimalism in mind, MetaRoute requires only one dependency{' '}
          <DocsCodeSnippet snippet="reflect-metadata" /> for TypeScript metadata
          reflection.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="why-metaroute">
        <DocsHeader text="Why use MetaRoute?" level={2} />
        <DocsPageParagraph>
          Who is this Framework for? MetaRoute is designed for developers who
          are looking for a simple, yet powerful API framework that is easy to
          use. The framework is ideal for fast prototyping and MVP development,
          as well as for building production-ready applications. The whole idea
          behind MetaRoute is to provide a minimalistic, yet fully-featured API
          framework that allows developers to focus on building their
          applications, rather than spending time on boilerplate code and
          complex configurations.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="key-features">
        <DocsHeader text="Key Features" />
        <DocsList
          items={[
            '⭐ Minimalistic design with nearly zero dependencies',
            '⭐ Support for real-time applications with a custom WebSocket implementation',
            '⭐ Easy-to-use decorator-based configuration',
            '⭐ Built-in support for both HTTP and HTTPS servers',
            '⭐ Flexible middleware integration',
            '⭐ Customizable error handling',
            '⭐ Simple, yet powerful routing'
          ]}
        />
      </DocsSection>

      <DocsSection id="quick-start">
        <DocsHeader text="Quick Start" />
        <DocsPageParagraph>
          Get up and running with MetaRoute in just a few steps:
        </DocsPageParagraph>
        <DocsCode language="bash">npm install metaroute-ts</DocsCode>
        <DocsPageParagraph>Or, if you&apos;re using Yarn:</DocsPageParagraph>
        <DocsCode language="bash">yarn add metaroute-ts</DocsCode>
        <DocsPageParagraph>
          Start building your API by decorating a class with the{' '}
          <DocsCodeSnippet snippet="@App" /> decorator and extending the{' '}
          <DocsCodeSnippet snippet="Application" /> class.
        </DocsPageParagraph>
        <DocsCode>
          {`@App({})
export class MetaApp extends Application {}`}
        </DocsCode>
      </DocsSection>

      <DocsSection id="app-configuration">
        <DocsHeader text="App Configuration" />
        <DocsPageParagraph>
          Configure your MetaRoute application by providing an object that
          implements the <DocsCodeSnippet snippet="AppConfiguration" />{' '}
          interface. This object can contain the following properties:
        </DocsPageParagraph>

        <DocsCode>
          {`interface AppConfiguration {
    middleware?: Middleware[];
    errorMiddleware?: ErrorMiddleware[];
    port?: number;
    ssl?: {
        key: string;
        cert: string;
    };
    engine?: ServiceIdentifier<Engine>;
    initializers?: ServiceIdentifier<Initializable>[];
    imports?: ServiceIdentifier<any>[];
    logging?: Omit<LoggerOptions, "context">;
}`}
        </DocsCode>
      </DocsSection>

      <DocsSection id="contributing">
        <DocsHeader text="Contributing" />
        <DocsPageParagraph color="text-neutral-400" italic>
          MetaRoute is an open-source project, and built with collaboration in
          mind. We welcome contributions from the community, and encourage you
          to get involved. If you&apos;d like to contribute to the project,
          check out our CONTRIBUTING.md file for more information. Or just open
          a pull request on GitHub!
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  )
}
