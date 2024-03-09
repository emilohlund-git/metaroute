import React from "react";
import DocsCode from "@/components/DocsCode";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsList from "@/components/DocsList";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";

export default function DependencyInjectionDocs() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      <DocsSection id="dependency-injection">
        <DocsPageTitle title="Dependency Injection in MetaRoute" />

        <DocsPageParagraph>
          Dependency Injection (DI) in MetaRoute streamlines the way
          dependencies are managed and injected, enhancing modularity,
          testability, and maintainability of your applications. This guide
          dives deep into utilizing DI with MetaRoute.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="understanding-scopes">
        <DocsHeader text="Understanding Scopes" level={2} />
        <DocsPageParagraph>
          MetaRoute supports four distinct scopes for dependency management.
          Each scope determines the lifecycle and usage pattern of the
          instantiated classes, enabling fine-grained control over your
          application&apos;s architecture and resource management.
        </DocsPageParagraph>

        <DocsList
          items={[
            `SINGLETON: Ensures a class has only one instance throughout the application's lifecycle. Use this scope for services that maintain global state, provide shared resources, or coordinate activities across the application. Singletons are ideal for cases where consistent state or behavior is crucial.`,
            `TRANSIENT: Creates a new instance of a class each time a dependency is resolved. This scope is suitable for stateless services where each consumer requires a fresh instance. It ensures that there's no shared state or side effects between uses, making it a good choice for services that perform isolated tasks.`,
            `MEMORY_POLICY: Designated for classes that implement strategies or policies for memory management within the application. Instances under this scope are typically used to monitor, optimize, or free up memory resources. This specialized scope helps segregate and manage memory-related functionalities systematically.`,
            `CONFIGURATOR: Used for classes that contribute to the application's initial configuration or setup. Classes marked with this scope are involved in setting up routes, middleware, or any other foundational aspects of the application. Utilizing the CONFIGURATOR scope helps in organizing and prioritizing initialization tasks during the startup phase.`,
          ]}
        />
      </DocsSection>

      <DocsSection id="using-injectable-decorator">
        <DocsHeader text="Using the @Injectable Decorator" level={2} />
        <DocsPageParagraph>
          To make a class part of the MetaRoute DI container, use the{" "}
          <DocsCodeSnippet snippet="@Injectable()" /> decorator with the desired
          scope:
        </DocsPageParagraph>
        <DocsCode language="javascript">
          {`@Injectable({ scope: Scope.SINGLETON })
class MyService {}`}
        </DocsCode>
        <DocsPageParagraph>
          This class is now available for resolution and use across your
          application. The <DocsCodeSnippet snippet="@Injectable()" /> decorator
          automatically registers the class with the MetaRoute container.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="registering-resolving-dependencies">
        <DocsHeader text="Registering and Resolving Dependencies" level={2} />
        <DocsPageParagraph>
          Register and resolve your dependencies with the MetaRoute container as
          follows:
        </DocsPageParagraph>
        <DocsHeader text="Registering a Class" level={3} />
        <DocsCode language="javascript">
          {`MetaRoute.register(MyService);`}
        </DocsCode>
        <DocsPageParagraph>
          Or by decorating the class with the{" "}
          <DocsCodeSnippet snippet="@Injectable()" />
          decorator, as shown in the previous section.
        </DocsPageParagraph>
        <DocsHeader text="Resolving a Class" level={3} />
        <DocsCode language="javascript">
          {`const myServiceInstance = MetaRoute.resolve(MyService);`}
        </DocsCode>
        <DocsPageParagraph>
          Resolving a class adheres to the specified scope, ensuring consistent
          behavior across your application.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="advanced-usage">
        <DocsHeader text="Advanced Usage" level={2} />
        <DocsPageParagraph>
          Explore advanced scenarios such as custom initializers, handling
          circular dependencies, and more.
        </DocsPageParagraph>
        <DocsHeader text="Custom Initializers" level={3} />
        <DocsCode language="javascript">
          {`@Injectable({ scope: Scope.CONFIGURATOR })
class ServerConfigurator implements Initializable {
  //Implementation details...`}
        </DocsCode>{" "}
        <DocsPageParagraph>
          {" "}
          Use custom initializers like ServerConfigurator` for specifying
          startup behaviors and configurations.
        </DocsPageParagraph>
        <DocsHeader text="Handling Circular Dependencies" level={3} />
        <DocsPageParagraph>
          MetaRoute detects circular dependencies and prevents them by throwing
          an exception, ensuring the integrity of your application&apos;s dependency
          graph.
        </DocsPageParagraph>
        <DocsHeader text="Clearing the Container" level={3} />
        <DocsCode language="javascript">MetaRoute.clear();</DocsCode>
        <DocsPageParagraph>
          Clearing the DI container can be particularly useful in testing
          scenarios where a fresh state is required.
        </DocsPageParagraph>
      </DocsSection>
      <DocsSection id="conclusion">
        <DocsHeader text="Conclusion" level={2} />
        <DocsPageParagraph>
          MetaRoute&apos;s dependency injection system provides a powerful and
          flexible way to manage your application&apos;s dependencies. By leveraging
          scopes, the `@Injectable()` decorator, and MetaRoute&apos;s container
          methods, you can build highly modular and maintainable applications.
          Dive into DI with MetaRoute to unlock the full potential of your
          application&apos;s architecture.
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  );
}
