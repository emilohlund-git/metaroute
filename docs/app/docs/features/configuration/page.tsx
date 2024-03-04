import DocsCode from "@/components/DocsCode";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Configuration() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Configuration Service</h1>
        <p className="text-lg">
          The Configuration Service in MetaRoute provides a centralized way to
          manage and access configuration settings for your application. It
          allows you to define environment variables and configuration files to
          store application settings and retrieve them from anywhere in your
          code.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="How it works" />
        <p className="text-lg">
          MetaRoute&apos;s Configuration Service loads configuration settings
          from environment variables and configuration files during application
          startup. It provides methods to access these settings and ensures that
          the required configuration values are available for your application
          to function properly.
        </p>
        <p className="text-lg mt-4">
          The Configuration Service also supports validation and type checking
          to ensure that the configuration values meet the expected criteria and
          prevent runtime errors caused by missing or invalid configuration
          settings.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Usage" />
        <p className="text-lg">
          To use the Configuration Service in MetaRoute, you can define
          configuration settings in environment variables or configuration files
          and access them using the provided methods. You can also specify the
          expected type for each configuration setting to ensure that the
          retrieved value matches the expected data type.
        </p>

        <DocsCode>
          {`import { ConfigService } from 'metaroute'; 
import { EnvironmentStore } from 'metaroute';

const environmentStore = new EnvironmentStore();
const configService = new ConfigService(environmentStore);

const apiUrl = configService.get('API_URL');
const port = configService.get<number>('PORT');
const isProduction = configService.get<boolean>('IS_PRODUCTION');
const allowedOrigins = configService.get<string[]>('ALLOWED_ORIGINS');
const startDate = configService.get<Date>('START_DATE');`}
        </DocsCode>

        <p className="text-lg mt-4">
          You can then use the retrieved configuration settings throughout your
          application to customize its behavior and ensure consistent
          configuration across different environments.
        </p>

        <p className="text-lg mt-4">
          Commonly the configuration service would be retrieved from the
          dependency injection container, but for the purposes of this example
          we are instantiating it directly.
        </p>
      </DocsSection>
    </DocsContainer>
  );
}
