import DocsCode from "@/components/DocsCode";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Validation() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Data Validation</h1>
        <p className="text-lg">
          The Data Validation feature in MetaRoute allows you to validate
          incoming data against predefined rules and constraints. It ensures
          that the data meets the required criteria before processing it further
          in your application.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="How it works" />
        <p className="text-lg">
          MetaRoute&apos;s Data Validation feature provides a set of validation
          decorators that you can use to annotate your data models with
          validation rules. When a request is made to a route that expects input
          data, MetaRoute automatically validates the incoming data against the
          specified rules.
        </p>
        <p className="text-lg mt-4">
          If the validation fails, MetaRoute returns an error response with
          detailed information about the validation errors, allowing you to
          handle the invalid data gracefully.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Usage" />
        <p className="text-lg">
          To validate incoming data using the Data Validation feature in
          MetaRoute, you need to define your data models with validation
          decorators and specify the validation rules for each property.
        </p>

        <DocsCode>
          {`import { IsString, IsEmail, Validate } from 'metaroute'; 

class UserEntity {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsEmail({ message: 'Email must be a valid email address' })
  email: string;
}`}
        </DocsCode>

        <p className="text-lg mt-4">
          You can then use the{" "}
          <code className="bg-gray-100 p-1 rounded-md">{"@Validate()"}</code>{" "}
          decorator to apply the validation rules to your route handler
          functions, ensuring that the incoming data is valid before processing
          it further.
        </p>
      </DocsSection>
    </DocsContainer>
  );
}
