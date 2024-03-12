import React from 'react'
import DocsContainer from '@/components/DocsContainer'
import DocsSection from '@/components/DocsSection'
import DocsHeader from '@/components/DocsHeader'
import DocsCode from '@/components/DocsCode'
import ScrollToAnchor from '@/components/ScrollToAnchor'
import { DocsPageTitle } from '@/components/DocsPageTitle'
import { DocsPageParagraph } from '@/components/DocsPageParagraph'

export default function Configuration() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      <DocsSection id="introduction">
        <DocsPageTitle title="Configuration" />
        <DocsPageParagraph>
          The Configuration Service in MetaRoute provides a centralized way to
          manage and access configuration settings for your application. It
          allows you to define environment variables and configuration files to
          store application settings and retrieve them from anywhere in your
          code.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="how-it-works">
        <DocsHeader text="How it Works" />
        <DocsPageParagraph>
          MetaRoute&apos;s Configuration Service loads configuration settings
          from environment variables and configuration files during application
          startup. It provides methods to access these settings and ensures that
          the required configuration values are available for your application
          to function properly.
        </DocsPageParagraph>
        <DocsPageParagraph>
          The Configuration Service also supports validation and type checking
          to ensure that the configuration values meet the expected criteria and
          prevent runtime errors caused by missing or invalid configuration
          settings.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="usage">
        <DocsHeader text="Usage" />
        <DocsPageParagraph>
          To use the Configuration Service in MetaRoute, you can define
          configuration settings in environment variables or configuration files
          and access them using the provided methods. You can also specify the
          expected type for each configuration setting to ensure that the
          retrieved value matches the expected data type.
        </DocsPageParagraph>
        <DocsCode language="javascript">
          {`import { ConfigService, EnvironmentStore } from 'metaroute-ts'; 

const environmentStore = new EnvironmentStore();
const configService = new ConfigService(environmentStore);

const apiUrl = configService.get('API_URL');
const port = configService.getNumber('PORT', 3000); // Default value 3000
const isProduction = configService.getBoolean('IS_PRODUCTION');
const allowedOrigins = configService.getArray('ALLOWED_ORIGINS');
const startDate = configService.getDate('START_DATE');`}
        </DocsCode>
        <DocsPageParagraph>
          You can then use the retrieved configuration settings throughout your
          application to customize its behavior and ensure consistent
          configuration across different environments.
        </DocsPageParagraph>
        <DocsPageParagraph>
          Commonly the configuration service would be retrieved from the
          dependency injection container, but for the purposes of this example
          we are instantiating it directly.
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  )
}
