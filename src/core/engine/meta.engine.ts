import { Engine } from "./engine.abstract";
import fs from "fs";
import { MetaTokenizer } from "./meta-tokenizer.engine";
import { MetaParser } from "./meta-parser.engine";
import { MetaEvaluator } from "./meta-evaluator.engine";
import { TemplateEngineException } from "./exceptions/template.exception";
import { TokenType } from "./enums/token-type.enum";

/**
 * A template rendering engine specialized for the MetaRoute framework.
 * @class MetaEngine
 * @extends Engine
 *
 * @description
 * This class provides methods to render templates containing a mix of HTML,
 * template syntax, and expressions. It tokenizes the input string, parses the
 * tokens into an abstract syntax tree, and evaluates the tree to produce the
 * final output.
 *
 * @author Emil Ölund
 */
export class MetaEngine extends Engine {
  /**
   * Renders a template with the provided data.
   * @param {string} template - The path to the template file.
   * @param {object} data - The data to be injected into the template.
   * @returns {string} The rendered HTML content.
   * @throws {TemplateEngineException} If there are errors in the template or data is missing.
   */
  render(template: string, data: object): string {
    // Validate input parameters
    if (!template) {
      throw new TemplateEngineException("Template path is required");
    }

    if (!data) {
      throw new TemplateEngineException("Data is required");
    }

    // Read template file content
    const html = fs.readFileSync(template, "utf8");

     // Tokenize the template HTML
    const lexer = new MetaTokenizer();
    const tokens = lexer.tokenize(html);

    // Check for syntax errors in tokens
    if (tokens.some((token) => token.type === TokenType.ERROR)) {
      throw new TemplateEngineException("Syntax error in template");
    }

    // Parse the tokens into an Abstract Syntax Tree (AST)
    const parser = new MetaParser(tokens);
    const ast = parser.parse();

    // Evaluate the AST with provided data
    const evaluator = new MetaEvaluator(ast, data);
    const node = evaluator.evaluate();

    // Return the rendered HTML content
    return node;
  }
}
