import React from 'react'
import DocsContainer from '@/components/DocsContainer'
import DocsSection from '@/components/DocsSection'
import ScrollToAnchor from '@/components/ScrollToAnchor'
import { DocsPageTitle } from '@/components/DocsPageTitle'
import { DocsPageParagraph } from '@/components/DocsPageParagraph'
import DocsHeader from '@/components/DocsHeader'
import DocsCode from '@/components/DocsCode'

export default function Logging() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      <DocsSection id="examples">
        <DocsPageTitle title="Examples" />
        <DocsPageParagraph>
          This section is for inspiration and can be used to show a real-world
          and can be used to show a real-world example of how to use the
          MetaRoute API framework.
        </DocsPageParagraph>
      </DocsSection>
      <DocsSection id="minimum-setup">
        <DocsHeader text="Minimum Setup" />
        <DocsPageParagraph>
          The following example shows a minimal setup for a MetaRoute
          application. The example demonstrates how to create a simple
          application with a single controller and a single route.
        </DocsPageParagraph>
        <DocsCode language="typescript">
          {`import { App, Application, JsonMiddleware, Controller, Get } from 'metaroute-ts';

@App({ middleware: [JsonMiddleware] })
@Controller("/")
class TestController extends Application {
    @Get("/")
    index() {
        return ResponseEntity.ok();
    }
}
            `}
        </DocsCode>
        <DocsPageParagraph>
          In this example, we define an application with a single controller and
          a single route. The route is a simple GET request that returns a 200
          OK response with no content.
        </DocsPageParagraph>

        <DocsPageParagraph>
          Every file you create can be dynamically loaded by the framework. This
          means that you can create as many controllers and routes as you like,
          and they will all be automatically discovered and registered by the
          framework. As long as you enable the ImportHandler in your
          application, the framework will automatically load every file you
          create.
        </DocsPageParagraph>

        <DocsCode language="typescript">
          {`import { App, Application, JsonMiddleware, ImportHandler } from 'metaroute-ts';

@App({ middleware: [JsonMiddleware], initializers: [ImportHandler] })
export class MetaApp extends Application {}`}
        </DocsCode>
      </DocsSection>

      <DocsSection id="webhooks">
        <DocsHeader text="WebHooks" />
        <DocsPageParagraph>
          WebHooks are a powerful feature that allows you to integrate your
          application with other services and receive real-time notifications
          when certain events occur. MetaRoute provides a simple and flexible
          way to create and manage WebHooks.
        </DocsPageParagraph>
        <DocsCode language="typescript">
          {`import { App, Application, JsonMiddleware, Controller, Post, WebHook, GithubWebHookProvider } from 'metaroute-ts';

@App({ middleware: [JsonMiddleware] })
class ExampleApp extends Application {}

@Controller("/webhooks")
class ExampleController {
    @WebHook(GithubWebHookProvider, {
        secret: "my-secret"
    })
    @Post("/github")
    index(@Req() request: Request) {
        const { options, provider, payload } = request.webhookMetadata;

        // Handle the incoming webhook

        return ResponseEntity.ok();
    }
}
            `}
        </DocsCode>
        <DocsPageParagraph>
          In this example, we define a WebHook route that listens for incoming
          GitHub WebHooks. The route is a simple POST request that returns a 200
          OK response with no content. The WebHook is configured to use the
          GitHub WebHook provider and is protected with a secret.
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  )
}
