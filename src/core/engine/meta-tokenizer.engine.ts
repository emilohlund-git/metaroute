import { Token } from "./entities/token.entity";
import { TokenType } from "./enums/token-type.enum";

/**
 * A lexer class responsible for tokenizing input strings into meaningful tokens.
 * @class MetaTokenizer
 * 
 * @description
 * This class provides methods to tokenize input strings containing a mix of HTML,
 * template syntax, and expressions. It parses the input string and generates an array
 * of tokens representing different elements such as HTML tags, template conditionals,
 * loops, interpolations, operators, and literals.
 * 
 * @author Emil Ölund
 */
export class MetaTokenizer {
  /**
   * Regular expressions representing different types of tokens.
   * @private
   */
  private regexParts = {
    htmlTag: /(<[^>]*?>)/,
    ifCondition: /({{#if [^}]*?}})/,
    elseCondition: /({{else}})/,
    endIfCondition: /({{\/if}})/,
    eachLoop: /({{#each [^}]*?}})/,
    endEachLoop: /({{\/each}})/,
    partials: /({{> [^}]*?}})/,
    interpolation: /({{[^}]*}})/,
    incompleteInterpolation: /({{[^}]*$)/,
    operator: /(\+|\-|\*\/)/,
    literal: /([^\s<{{]+)/,
    whitespace: /(\s+)/,
  };

  /**
   * Combined regular expression for tokenization.
   * @private
   */
  private regex = new RegExp(
    Object.values(this.regexParts)
      .map((r) => r.source)
      .join("|"),
    "g"
  );

  /**
   * Tokenizes the input string.
   * @param {string} input - The input string to be tokenized.
   * @returns {Token[]} An array of tokens representing the input string.
   */
  tokenize(input: string): Token[] {
    let match;
    const tokens = [];

    while ((match = this.regex.exec(input))) {
      if (match[1]) {
        tokens.push(...this.handleHTMLTags(match[1]));
      } else if (match[2]) {
        tokens.push(this.handleIfConditionals(match[2]));
      } else if (match[3]) {
        tokens.push(this.handleElseConditionals(match[3]));
      } else if (match[4]) {
        tokens.push(this.handleEndIfConditionals(match[4]));
      } else if (match[5]) {
        tokens.push(...this.handleEachLoops(match[5], input));
      } else if (match[6]) {
        tokens.push(this.handleEndEachLoops(match[6]));
      } else if (match[7]) {
        tokens.push(this.handlePartials(match[7]));
      } else if (match[8]) {
        tokens.push(...this.handleInterpolations(match[8]));
      } else if (match[9]) {
        tokens.push(this.handleIncompleteInterpolations(match[9]));
      } else if (match[10]) {
        tokens.push(this.handleOperators(match[10]));
      } else if (match[11]) {
        tokens.push(this.handleLiterals(match[11]));
      } else if (match[12]) {
        // Handle whitespace
        continue;
      }
    }

    return tokens;
  }

  /**
   * Handles HTML tags.
   * @param {string} match - The matched HTML tag.
   * @returns {Token[]} An array of tokens.
   * @private
   */
  private handleHTMLTags(match: string): Token[] {
    const tokens: Token[] = [];
    // Handle HTML tags
    const tagParts = match.split(/({{[^}]*?}})/);
    for (const part of tagParts) {
      if (part) {
        // Ignore empty strings
        if (part.startsWith("{{")) {
          tokens.push(new Token(TokenType.INTERPOLATION, part));
        } else {
          tokens.push(new Token(TokenType.HTML, part));
        }
      }
    }

    return tokens;
  }

  /**
   * Handles if conditionals.
   * @param {string} match - The matched if conditional.
   * @returns {Token} A token representing the if conditional.
   * @private
   */
  private handleIfConditionals(match: string): Token {
    // Handle {{#if}} conditionals
    return new Token(TokenType.OPEN_IF, match);
  }

  /**
   * Handles else conditionals.
   * @param {string} match - The matched else conditional.
   * @returns {Token} A token representing the else conditional.
   * @private
   */
  private handleElseConditionals(match: string): Token {
    // Handle {{else}} conditionals
    return new Token(TokenType.ELSE, match);
  }

  /**
   * Handles end if conditionals.
   * @param {string} match - The matched end if conditional.
   * @returns {Token} A token representing the end if conditional.
   * @private
   */
  private handleEndIfConditionals(match: string): Token {
    // Handle {{/if}} conditionals
    return new Token(TokenType.CLOSE_IF, match);
  }

  /**
   * Handles each loops.
   * @param {string} match - The matched each loop.
   * @param {string} input - The input string.
   * @returns {Token[]} An array of tokens.
   * @private
   */
  private handleEachLoops(match: string, input: string): Token[] {
    const tokens: Token[] = [];
    // Handle {{#each}} loops
    tokens.push(new Token(TokenType.OPEN_EACH, match));
    const endIndex = this.findClosingEachIndex(input, this.regex.lastIndex);
    if (endIndex !== -1) {
      const innerContent = input.slice(this.regex.lastIndex, endIndex);
      tokens.push(...this.tokenize(innerContent));
      this.regex.lastIndex = endIndex;
    }

    return tokens;
  }

  /**
   * Handles end each loops.
   * @param {string} match - The matched end each loop.
   * @returns {Token} A token representing the end each loop.
   * @private
   */
  private handleEndEachLoops(match: string): Token {
    // Handle {{/each}} loops
    return new Token(TokenType.CLOSE_EACH, match);
  }

  /**
   * Handles partials.
   * @param {string} match - The matched partial.
   * @returns {Token} A token representing the partial.
   * @private
   */
  private handlePartials(match: string): Token {
    // Handle {{> templateName}} partials
    return new Token(TokenType.PARTIAL, match);
  }

  /**
   * Handles interpolations.
   * @param {string} match - The matched interpolation.
   * @returns {Token[]} An array of tokens.
   * @private
   */
  private handleInterpolations(match: string): Token[] {
    const tokens: Token[] = [];
    // Handle interpolations
    const interpolationContent = match.slice(2, -2).trim(); // Remove {{ and }}
    const parts = interpolationContent.split(/\s+/); // Split by whitespace
    for (const part of parts) {
      if (["+", "-", "*", "/"].includes(part)) {
        tokens.push(new Token(TokenType.OPERATOR, part));
      } else {
        tokens.push(new Token(TokenType.IDENTIFIER, part));
      }
    }

    return tokens;
  }

  /**
   * Handles incomplete interpolations.
   * @param {string} match - The matched incomplete interpolation.
   * @returns {Token} A token representing the incomplete interpolation.
   * @private
   */
  private handleIncompleteInterpolations(match: string): Token {
    // Handle incomplete interpolations
    return new Token(TokenType.ERROR, match);
  }

  /**
   * Handles operators.
   * @param {string} match - The matched operator.
   * @returns {Token} A token representing the operator.
   * @private
   */
  private handleOperators(match: string): Token {
    // Handle operators
    return new Token(TokenType.OPERATOR, match);
  }

  /**
   * Handles literals.
   * @param {string} match - The matched literal.
   * @returns {Token} A token representing the literal.
   * @private
   */
  private handleLiterals(match: string): Token {
    // Handle literals
    return new Token(TokenType.LITERAL, match);
  }

  /**
   * Finds the closing index of an each loop in the input string.
   * @param {string} input - The input string containing the each loop.
   * @param {number} startIndex - The starting index of the each loop.
   * @returns {number} The index of the closing tag of the each loop.
   * If the closing tag is not found, returns -1.
   * @private
   */
  private findClosingEachIndex(input: string, startIndex: number): number {
    let balance = 1;
    let index = startIndex;
    while (balance > 0 && index < input.length) {
      if (input.substring(index, index + 9) === "{{#each ") {
        balance++;
      } else if (input.substring(index, index + 8) === "{{/each}}") {
        balance--;
      }
      index++;
    }
    return balance === 0 ? index : -1;
  }
}
