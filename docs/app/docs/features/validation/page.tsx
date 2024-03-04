import DocsCode from "@/components/DocsCode";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Validation() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <DocsPageTitle title="Data Validation" />
        <DocsPageParagraph>
          The Data Validation feature in MetaRoute allows you to validate
          incoming data against predefined rules and constraints. It ensures
          that the data meets the required criteria before processing it further
          in your application.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="How it Works" />
        <DocsPageParagraph>
          MetaRoute&apos;s Data Validation feature provides a set of validation
          decorators that you can use to annotate your data models with
          validation rules. When a request is made to a route that expects input
          data, MetaRoute automatically validates the incoming data against the
          specified rules.
        </DocsPageParagraph>
        <DocsPageParagraph>
          If the validation fails, MetaRoute returns an error response with
          detailed information about the validation errors, allowing you to
          handle the invalid data gracefully.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Usage" />
        <DocsPageParagraph>
          To validate incoming data using the Data Validation feature in
          MetaRoute, you need to define your data models with validation
          decorators and specify the validation rules for each property.
        </DocsPageParagraph>

        <DocsCode>
          {`import { IsString, IsEmail, Validate } from 'metaroute'; 

class UserEntity {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsEmail({ message: 'Email must be a valid email address' })
  email: string;
}`}
        </DocsCode>

        <DocsPageParagraph>
          You can then use the <DocsCodeSnippet snippet="@Validate()" />{" "}
          decorator to apply the validation rules to your route handler
          functions by passing the <DocsCodeSnippet snippet="UserEntity" /> as
          an argument. Ensuring that the incoming data is valid before
          processing it further.
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  );
}
