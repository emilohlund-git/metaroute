import { ConsoleLogger } from "@core/common/services/console-logger.service";
import { Node } from "./entities/node.entity";
import { NodeType } from "./enums/node-type.enum";
import * as path from "path";
import { EvaluatorException } from "./exceptions/evaluator.exception";
import { MetaEngine } from "./meta.engine";

/**
 * Evaluates an abstract syntax tree (AST) to produce the final output.
 * @class MetaEvaluator
 * 
 * @description
 * This class provides methods to evaluate an abstract syntax tree (AST) representing the structure
 * of the template. It handles different types of nodes such as HTML, template conditionals, loops,
 * interpolations, identifiers, and partials. It also handles expressions, which are references to
 * data properties or values that are injected into the template.
 * 
 * @author Emil Ölund
 */
export class MetaEvaluator {
  private readonly logger = new ConsoleLogger(MetaEvaluator.name);
  constructor(private ast: Node, private data: object) {}

  /**
   * Evaluates the abstract syntax tree (AST) with the provided data.
   * 
   * @returns {string} The rendered HTML content.
   * @throws {EvaluatorException} If there are errors in the AST or data is missing.
   * 
   * @description
   * This method evaluates the abstract syntax tree (AST) with the provided data to produce the final
   * output. It handles different types of nodes such as HTML, template conditionals, loops, interpolations,
   * identifiers, and partials. It also handles expressions, which are references to data properties or values
   * that are injected into the template.
   */
  evaluate(): string {
    return this.evaluateNode(this.ast);
  }

  private evaluateNode(node: Node, context: any = this.data): string {
    switch (node.type) {
      case NodeType.ROOT:
        return node.children.map((child) => this.evaluateNode(child)).join("");
      case NodeType.HTML:
        return node.value;
      case NodeType.INTERPOLATION:
      case NodeType.IDENTIFIER:
      case NodeType.BOOLEAN_IDENTIFIER:
      case NodeType.EXPRESSION:
        return this.evaluateExpressionNode(node, context);
      case NodeType.IF_STATEMENT:
        return this.evaluateIfStatementNode(node, context);
      case NodeType.EACH_STATEMENT:
        return this.evaluateEachStatementNode(node, context);
      case NodeType.ELSE_STATEMENT:
        return this.evaluateElseStatementNode(node, context);
      case NodeType.PARTIAL:
        return this.evaluatePartialNode(node);
      default:
        throw new EvaluatorException(`Node type ${node.type} is not supported for evaluation`);
    }
  }

  private evaluateExpressionNode(node: Node, context: any): string {
    const removeBrackets = (value: string) => value.replace("{{", "").replace("}}", "");

    if (node.type === NodeType.INTERPOLATION) {
      return context[removeBrackets(node.value) as keyof object];
    } else if (node.type === NodeType.EXPRESSION) {
      if (node.value === "this") {
        return context;
      } else if (node.value.startsWith("this.")) {
        const key = node.value.replace("this.", "");
        return context[key];
      } else {
        return this.data[node.value as keyof object] || `${node.value}`;
      }
    } else {
      return this.data[node.value as keyof object];
    }
  }

  private evaluateIfStatementNode(node: Node, context: any): string {
    const condition = node.children[0].value;
    if (this.data[condition as keyof object]) {
      return node.children.slice(1).map((child) => this.evaluateNode(child)).join("");
    } else {
      return "";
    }
  }

  private evaluateEachStatementNode(node: Node, context: any): string {
    const identifierNode = node.children.find((child) => child.type === NodeType.IDENTIFIER);
    if (!identifierNode) {
      throw new EvaluatorException(`EachStatement node does not have an Identifier child node`);
    }
    const key = identifierNode.value;
    const items = context[key as keyof object] as any[];
    if (!items) {
      throw new EvaluatorException(`Key ${key} not found in data`);
    }
    return items.map((item) =>
      node.children
        .filter((child) => child.type !== NodeType.IDENTIFIER)
        .map((child) => this.evaluateNode(child, item))
        .join("")
    ).join("");
  }

  private evaluateElseStatementNode(node: Node, context: any): string {
    if (!this.data[node.value as keyof object]) {
      return node.children.map((child) => this.evaluateNode(child)).join("");
    } else {
      return "";
    }
  }

  private evaluatePartialNode(node: Node): string {
    const templateEngine = new MetaEngine();
    return templateEngine.render(
      path.join(process.cwd(), "public", node.value + ".html"),
      this.data
    );
  }
}
