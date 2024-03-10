import DocsCode from '@/components/DocsCode'
import DocsCodeSnippet from '@/components/DocsCodeSnippet'
import DocsContainer from '@/components/DocsContainer'
import DocsHeader from '@/components/DocsHeader'
import { DocsPageParagraph } from '@/components/DocsPageParagraph'
import { DocsPageTitle } from '@/components/DocsPageTitle'
import DocsSection from '@/components/DocsSection'
import ScrollToAnchor from '@/components/ScrollToAnchor'
import React from 'react'

export default function Validation() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <DocsPageTitle title="Data Validation" />
        <DocsPageParagraph>
          Data Validation within MetaRoute ensures that incoming data adheres to
          predefined rules and constraints, safeguarding your application from
          incorrect or harmful data. This feature facilitates the verification
          of data integrity before it&apos;s processed further, enhancing
          security and data quality.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="How it Works" />
        <DocsPageParagraph>
          Utilizing validation decorators, MetaRoute&apos;s Data Validation
          allows for seamless annotation of your data models. These decorators
          automate the validation process against your rules when receiving
          input data, ensuring compliance and consistency.
        </DocsPageParagraph>
        <DocsPageParagraph>
          In the event of validation failure, MetaRoute responds with a
          customizable error report, enabling precise identification and
          handling of input discrepancies.
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
          {`import { IsString, IsEnum } from 'metaroute-ts'; 

enum UserRole {
  Admin = 'admin'
  User = 'user'
}

class UserEntity {
  @IsString('Name must be a string')
  name: string;

  @IsEnum(UserRole, 'Role must be either "admin" or "user"')
  role: UserRole;
}`}
        </DocsCode>

        <DocsPageParagraph>
          You can then use the <DocsCodeSnippet snippet="@Validate()" />{' '}
          decorator to apply the validation rules to your route handler
          functions by passing the <DocsCodeSnippet snippet="UserEntity" /> as
          an argument. Ensuring that the incoming data is valid before
          processing it further.
        </DocsPageParagraph>

        <DocsCode>
          {`import { Validate } from 'metaroute-ts';

@Post('/')
@Validate(UserEntity)
async createUser(user: UserEntity) {
  // Create a new user
}`}
        </DocsCode>

        <DocsPageParagraph>
          In the event of validation failure, MetaRoute automatically responds
          with a 400 Bad Request status code and the previously assigned error
          messages indicating the validation issues.
        </DocsPageParagraph>

        <DocsPageParagraph>
          MetaRoute provides a set of built-in validation decorators to cover
          common use cases. However, you can also create custom validation
          decorators to suit your specific requirements:
        </DocsPageParagraph>

        <DocsPageParagraph>
          For more information on creating custom validation decorators, see the
          next section.
        </DocsPageParagraph>

        <DocsHeader text="Creating Custom Validation Decorators" />
        <DocsPageParagraph>
          MetaRoute also provides a way to easily create your own validation
          decorators. You can use the{' '}
          <DocsCodeSnippet snippet="createValidationDecorator" /> function to
          create a custom validation decorator. This function takes a validation
          function and a default error message as arguments.
        </DocsPageParagraph>

        <DocsCode>
          {`import { createValidationDecorator } from 'metaroute-ts';

const IsEvenNumber = createValidationDecorator(
  value => typeof value === 'number' && value % 2 === 0,
  'Value must be an even number.'
);

class TestClass {
  @IsEvenNumber()
  public prop!: number;
}`}
        </DocsCode>

        <DocsPageParagraph>
          In this example, the <DocsCodeSnippet snippet="IsEvenNumber" />{' '}
          decorator validates that the property is an even number.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Validation Error Messages" />
        <DocsPageParagraph>
          MetaRoute allows you to customize the error messages returned when
          validation fails. You can pass a custom error message to the
          validation decorators to provide more context-specific feedback.
        </DocsPageParagraph>

        <DocsCode>
          {`import { IsString } from 'metaroute-ts';

class TestClass {
  @IsString('Custom error message')
  public prop!: string;
}`}
        </DocsCode>

        <DocsPageParagraph>
          In this example, the <DocsCodeSnippet snippet="IsString" /> decorator
          will return the custom error message when the validation fails.
        </DocsPageParagraph>

        <DocsPageParagraph>
          The returned error message will be included in the response when
          validation fails, providing more context-specific feedback, for
          example sending a POST request with the following body:
        </DocsPageParagraph>

        <DocsCode language="json">
          {`{
  "name": 123
}`}
        </DocsCode>

        <DocsPageParagraph>
          Using the following validation rules:
        </DocsPageParagraph>

        <DocsCode>
          {`class TestClass {
  @IsString()
  public name!: string;

  @IsNumber()
  public age!: number;
}`}
        </DocsCode>

        <DocsPageParagraph>
          The response will include the following error message:
        </DocsPageParagraph>

        <DocsCode language="json">
          {`{
  "name": [
    "Value must be a string."
  ],
  "age": [
    "Property is missing"
  ]
}`}
        </DocsCode>
      </DocsSection>
    </DocsContainer>
  )
}
