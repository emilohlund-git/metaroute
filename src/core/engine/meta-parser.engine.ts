import { Node } from "./entities/node.entity";
import { Token } from "./entities/token.entity";
import { NodeType } from "./enums/node-type.enum";
import { TokenType } from "./enums/token-type.enum";
import { ParserException } from "./exceptions/parser.exception";

/**
 * Parses a sequence of tokens into an abstract syntax tree (AST) representing the structure of the template.
 * @class MetaParser
 *
 * @description
 * This class provides methods to parse a sequence of tokens into an abstract syntax tree (AST) representing the structure
 * of the template. It handles different types of tokens such as HTML, template conditionals, loops, interpolations, operators,
 * and literals. It also handles partials, which are references to other templates that are included in the current template.
 *
 * @author Emil Ölund
 */
export class MetaParser {
  private tokens: Token[];
  private pos = 0;

  /**
   * Creates an instance of MetaParser.
   * @param {Token[]} tokens - The array of tokens to be parsed.
   */
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private createNodeAndAdvance(type: NodeType, value: string): Node {
    this.pos++;
    return new Node(type, value);
  }

  /**
   * Parses an expression from the tokens.
   * @param {TokenType[]} endTokenTypes
   * @returns {Node[]}
   *
   * @description
   * Parses a sequence of tokens into an array of nodes representing the structure of the template.
   * The parsing process is recursive and continues until the endTokenTypes are encountered.
   * @private
   */
  private parseStatement(endTokenTypes: TokenType[]): Node[] {
    const nodes: Node[] = [];
    while (
      this.pos < this.tokens.length &&
      !endTokenTypes.includes(this.tokens[this.pos].type)
    ) {
      const token = this.tokens[this.pos];
      switch (token.type) {
        case TokenType.DISCARD:
          break;
        case TokenType.IDENTIFIER:
        case TokenType.OPERATOR:
        case TokenType.LITERAL:
          nodes.push(this.parseExpression());
          break;
        case TokenType.INTERPOLATION:
          const interpolationNode = this.createNodeAndAdvance(
            NodeType.INTERPOLATION,
            token.value
          );
          let identifierValue = token.value.trim();
          if (identifierValue.startsWith("{{")) {
            identifierValue = identifierValue.slice(2);
          }
          if (identifierValue.endsWith("}}")) {
            identifierValue = identifierValue.slice(0, -2);
          }
          if (
            identifierValue.includes("{{") ||
            identifierValue.includes("}}")
          ) {
            throw new ParserException(
              "Incomplete interpolation syntax: " +
                token.value +
                " at " +
                this.pos
            );
          }
          const identifierNode = new Node(NodeType.IDENTIFIER, identifierValue);
          interpolationNode.children.push(identifierNode);
          nodes.push(interpolationNode);
          break;
        case TokenType.OPEN_BRACE:
          this.pos++; // Skip the OPEN_BRACE token
          break;
        case TokenType.HTML:
          nodes.push(this.createNodeAndAdvance(NodeType.HTML, token.value));
          break;
        case TokenType.OPEN_IF:
          nodes.push(this.parseIfStatement());
          break;
        case TokenType.OPEN_EACH:
          nodes.push(this.parseEachStatement());
          break;
        case TokenType.PARTIAL:
          nodes.push(this.parsePartialStatement());
          break;
        case TokenType.ELSE:
          nodes.push(this.parseElseStatement());
          break;
        case TokenType.CLOSE_BRACE:
        case TokenType.CLOSE_EACH:
        case TokenType.CLOSE_IF:
          this.pos++;
          break;
        default:
          throw new ParserException(
            "Unexpected token: " + token.value + " at " + this.pos
          );
      }
    }
    return nodes;
  }

  /**
   * Parses the tokens into an AST.
   * @returns {Node} The root node of the AST.
   */
  parse(): Node {
    const nodes = this.parseStatement([TokenType.EOF]);
    return new Node(NodeType.ROOT, "", nodes);
  }

  parseElseStatement(): Node {
    const token = this.tokens[this.pos];
    this.pos++;
    const nodes = this.parseStatement([TokenType.CLOSE_IF]);
    return new Node(NodeType.ELSE_STATEMENT, token.value, nodes);
  }

  parseIfStatement(): Node {
    const token = this.tokens[this.pos];
    this.pos++;
    let conditionValue = token.value; // Extract the condition from the token value

    // Remove "{{#if " and "}}" and trim whitespace
    conditionValue = conditionValue.slice(6, -2).trim();

    const condition = new Node(NodeType.IDENTIFIER, conditionValue); // Create an Identifier node with the condition
    const nodes = this.parseStatement([TokenType.ELSE, TokenType.CLOSE_IF]);
    let elseNode = null;
    if (this.tokens[this.pos]?.type === TokenType.ELSE) {
      elseNode = this.parseElseStatement();
    }
    const ifNode = new Node(NodeType.IF_STATEMENT, token.value, [
      condition,
      ...nodes,
    ]);
    if (elseNode) {
      ifNode.children.push(elseNode);
    }
    return ifNode;
  }

  private parseExpression(): Node {
    const expressionTokens: Token[] = [];
    while (this.pos < this.tokens.length) {
      const token = this.tokens[this.pos];
      if (
        token.type === TokenType.IDENTIFIER ||
        token.type === TokenType.OPERATOR ||
        token.type === TokenType.LITERAL
      ) {
        expressionTokens.push(token);
        this.pos++;
      } else {
        break;
      }
    }
    if (expressionTokens.length > 0) {
      const expressionValue = expressionTokens
        .map((token) => token.value)
        .join(" ");
      return new Node(NodeType.EXPRESSION, expressionValue);
    } else {
      throw new ParserException("Unexpected token in expression: " + this.pos);
    }
  }

  parsePartialStatement(): Node {
    const token = this.tokens[this.pos];
    this.pos++;
    const partialName = token.value.slice(3, -2).trim(); // Remove "{{> " and "}}" and trim whitespace
    const nodes = this.parseStatement([TokenType.CLOSE_BRACE]);
    return new Node(NodeType.PARTIAL, partialName, nodes);
  }

  parseEachStatement(): Node {
    const token = this.tokens[this.pos];
    this.pos++;
    const iterableValue = token.value; // Extract the iterable from the token value

    // Ensure the iterableValue is correctly parsed to get the actual identifier
    const identifierValue = iterableValue.slice(8, -2).trim(); // Remove "{{#each " and "}}" and trim whitespace

    const iterable = new Node(NodeType.IDENTIFIER, identifierValue); // Create an Identifier node with the iterable
    const nodes = this.parseStatement([TokenType.CLOSE_EACH]);

    // Ensure the EACH_STATEMENT node correctly includes the iterable as a child
    return new Node(NodeType.EACH_STATEMENT, token.value, [iterable, ...nodes]);
  }
}
