import { TemplateEngineException } from "@core/engine/exceptions/template.exception";
import { MetaEngine } from "@core/engine/meta.engine";
import fs from "fs";
import path from "path";

jest.mock("fs");

describe("TemplateEngine", () => {
  let engine: MetaEngine;
  let data: object;

  beforeEach(() => {
    engine = new MetaEngine();
    data = { title: "Test Title", message: "Test Message" };
  });

  test("should create an instance", () => {
    expect(engine).toBeInstanceOf(MetaEngine);
  });

  test("render should process template and return expected output", () => {
    const templatePath = path.resolve(__dirname, "test.template");
    const templateContent = `
    <!DOCTYPE html>
<html>
<head>
    <title>{{title}}</title>
</head>
<body>
    <h1>{{title}}</h1>
    <p>{{message}}</p>
</body>
</html>
    `;
    const expectedOutput = `<!DOCTYPE html><html><head><title>Test Title</title></head><body><h1>Test Title</h1><p>Test Message</p></body></html>`;
    (fs.readFileSync as jest.Mock).mockReturnValue(templateContent);

    const result = engine.render(templatePath, data);

    expect(result).toBe(expectedOutput);
  });

  test("render should process advanced template with conditionals and loops", () => {
    const templatePath = path.resolve(__dirname, "advanced.template");
    const templateContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>{{title}}</title>
      </head>
      <body>
          <h1>{{title}}</h1>
          <p>{{message}}</p>
          {{#if showList}}
          <ul>
              {{#each items}}
              <li>{{this}}</li>
              {{/each}}
          </ul>
          {{/if}}
      </body>
      </html>
      `;
    const data = {
      title: "Test Title",
      message: "Test Message",
      showList: true,
      items: ["Item 1", "Item 2", "Item 3"],
    };
    const expectedOutput = `<!DOCTYPE html><html><head><title>Test Title</title></head><body><h1>Test Title</h1><p>Test Message</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></body></html>`;
    (fs.readFileSync as jest.Mock).mockReturnValue(templateContent);

    const result = engine.render(templatePath, data);

    expect(result).toBe(expectedOutput);
  });

  test("render should throw an error if template is null", () => {
    const templatePath = null;
    expect(() => engine.render(templatePath!, data)).toThrow(
      TemplateEngineException
    );
  });

  test("render should throw an error if data is null", () => {
    const templatePath = path.resolve(__dirname, "test.template");
    const data = null;
    expect(() => engine.render(templatePath, data!)).toThrow(
      TemplateEngineException
    );
  });

  test("render should return template as is if data is empty", () => {
    const templatePath = path.resolve(__dirname, "test.template");
    const templateContent = `<h1>{{title}}</h1>`;
    const expectedOutput = `<h1>{{title}}</h1>`;
    (fs.readFileSync as jest.Mock).mockReturnValue(templateContent);

    const result = engine.render(templatePath, {});

    expect(result).toBe(expectedOutput);
  });

  test("render should throw an error if template contains syntax errors", () => {
    const templatePath = path.resolve(__dirname, "test.template");
    const templateContent = `<h1>{{title</h1>`;
    (fs.readFileSync as jest.Mock).mockReturnValue(templateContent);

    expect(() => engine.render(templatePath, data)).toThrow(
      TemplateEngineException
    );
  });
});
