import { Token } from "@core/engine/entities/token.entity";
import { TokenType } from "@core/engine/enums/token-type.enum";
import { MetaTokenizer } from "@core/engine/meta-tokenizer.engine";

describe("MetaTokenizer", () => {
  let lexer: MetaTokenizer;

  beforeEach(() => {
    lexer = new MetaTokenizer();
  });

  it("should tokenize HTML tags", () => {
    const tokens = lexer.tokenize("<div>");
    expect(tokens.length).toBe(1);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.HTML);
    expect(tokens[0].value).toBe("<div>");
  });

  it("should tokenize {{1 + 3}} as three separate tokens", () => {
    const tokens = lexer.tokenize("{{1 + 3}}");
    expect(tokens).toEqual([
      new Token(TokenType.IDENTIFIER, "1"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.IDENTIFIER, "3"),
    ]);
  });

  it("should tokenize HTML starting tag", () => {
    const tokens = lexer.tokenize('<html lang="en">');
    expect(tokens.length).toBe(1);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.HTML);
    expect(tokens[0].value).toBe('<html lang="en">');
  });

  it("should tokenize HTML tags with attributes", () => {
    const tokens = lexer.tokenize('<div id="test" class="my-class">');
    expect(tokens.length).toBe(1);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.HTML);
    expect(tokens[0].value).toBe('<div id="test" class="my-class">');
  });

  it("should tokenize HTML tags and stop at template variables", () => {
    const tokens = lexer.tokenize(
      '<a href="{{ctaLink}}" class="cta-button">{{ctaText}}</a>'
    );

    expect(tokens.length).toBe(5);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.HTML);
    expect(tokens[0].value).toBe('<a href="');
  });

  it("should correctly tokenize multiple HTML tags and template variables", () => {
    const tokens = lexer.tokenize(
      '<div class="{{className}}"><a href="{{ctaLink}}">{{ctaText}}</a></div>'
    );
    expect(tokens.length).toBe(9);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.HTML);
    expect(tokens[0].value).toBe('<div class="');
  });

  it("should correctly tokenize self-closing HTML tags", () => {
    const tokens = lexer.tokenize('<img src="{{imageUrl}}" />');
    expect(tokens.length).toBe(3);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.HTML);
    expect(tokens[0].value).toBe('<img src="');
  });

  it("should tokenize different types of HTML tags", () => {
    const tokens = lexer.tokenize("<span><p><ul><li><img><br><hr>");
    expect(tokens.length).toBe(7);
  });

  it("should tokenize different types of template variables", () => {
    const tokens = lexer.tokenize("{{var1}}{{var2}}{{var3}}{{var4}}");
    expect(tokens.length).toBe(4);
  });

  it("should tokenize nested HTML tags", () => {
    const tokens = lexer.tokenize("<div><span><p>Hello</p></span></div>");
    expect(tokens.length).toBe(7);
  });

  it("should not tokenize whitespace", () => {
    const tokens = lexer.tokenize("<div>\n  <p>\tHello</p>  </div>");
    expect(tokens.length).toBe(5);
  });

  it("should handle empty input", () => {
    const tokens = lexer.tokenize("");
    expect(tokens.length).toBe(0);
  });

  it("should handle non-HTML input", () => {
    const tokens = lexer.tokenize("Hello, world!");
    expect(tokens.length).toBe(2);
  });

  it("should tokenize if conditionals", () => {
    const tokens = lexer.tokenize("{{#if condition}}Hello{{/if}}");
    expect(tokens.length).toBe(3);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.OPEN_IF);
    expect(tokens[0].value).toBe("{{#if condition}}");
    expect(tokens[1]).toBeInstanceOf(Token);
    expect(tokens[1].type).toBe(TokenType.LITERAL);
    expect(tokens[1].value).toBe("Hello");
    expect(tokens[2]).toBeInstanceOf(Token);
    expect(tokens[2].type).toBe(TokenType.CLOSE_IF);
    expect(tokens[2].value).toBe("{{/if}}");
  });

  it("should tokenize else conditionals", () => {
    const tokens = lexer.tokenize("{{#if condition}}Hello{{else}}World{{/if}}");
    expect(tokens.length).toBe(5);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.OPEN_IF);
    expect(tokens[0].value).toBe("{{#if condition}}");
    expect(tokens[1]).toBeInstanceOf(Token);
    expect(tokens[1].type).toBe(TokenType.LITERAL);
    expect(tokens[1].value).toBe("Hello");
    expect(tokens[2]).toBeInstanceOf(Token);
    expect(tokens[2].type).toBe(TokenType.ELSE);
    expect(tokens[2].value).toBe("{{else}}");
    expect(tokens[3]).toBeInstanceOf(Token);
    expect(tokens[3].type).toBe(TokenType.LITERAL);
    expect(tokens[3].value).toBe("World");
    expect(tokens[4]).toBeInstanceOf(Token);
    expect(tokens[4].type).toBe(TokenType.CLOSE_IF);
    expect(tokens[4].value).toBe("{{/if}}");
  });

  it("should tokenize literals", () => {
    const tokens = lexer.tokenize("Hello, world!");
    expect(tokens.length).toBe(2);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.LITERAL);
    expect(tokens[0].value).toBe("Hello,");
    expect(tokens[1]).toBeInstanceOf(Token);
    expect(tokens[1].type).toBe(TokenType.LITERAL);
    expect(tokens[1].value).toBe("world!");
  });

  it("should tokenize each loops", () => {
    const tokens = lexer.tokenize("{{#each items}}Hello{{/each}}");
    expect(tokens.length).toBe(3);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.OPEN_EACH);
    expect(tokens[0].value).toBe("{{#each items}}");
    expect(tokens[1]).toBeInstanceOf(Token);
    expect(tokens[1].type).toBe(TokenType.LITERAL);
    expect(tokens[1].value).toBe("Hello");
    expect(tokens[2]).toBeInstanceOf(Token);
    expect(tokens[2].type).toBe(TokenType.CLOSE_EACH);
    expect(tokens[2].value).toBe("{{/each}}");
  });

  it("should tokenize nested each loops", () => {
    const tokens = lexer.tokenize(
      "{{#each outer}}Hello{{#each inner}}World{{/each}}{{/each}}"
    );
    expect(tokens.length).toBe(6);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.OPEN_EACH);
    expect(tokens[0].value).toBe("{{#each outer}}");
    expect(tokens[1]).toBeInstanceOf(Token);
    expect(tokens[1].type).toBe(TokenType.LITERAL);
    expect(tokens[1].value).toBe("Hello");
    expect(tokens[2]).toBeInstanceOf(Token);
    expect(tokens[2].type).toBe(TokenType.OPEN_EACH);
    expect(tokens[2].value).toBe("{{#each inner}}");
    expect(tokens[3]).toBeInstanceOf(Token);
    expect(tokens[3].type).toBe(TokenType.LITERAL);
    expect(tokens[3].value).toBe("World");
    expect(tokens[4]).toBeInstanceOf(Token);
    expect(tokens[4].type).toBe(TokenType.CLOSE_EACH);
    expect(tokens[4].value).toBe("{{/each}}");
    expect(tokens[5]).toBeInstanceOf(Token);
    expect(tokens[5].type).toBe(TokenType.CLOSE_EACH);
    expect(tokens[5].value).toBe("{{/each}}");
  });

  it("should tokenize partials", () => {
    const tokens = lexer.tokenize("{{> partialName}}");
    expect(tokens.length).toBe(1);
    expect(tokens[0].type).toBe(TokenType.PARTIAL);
    expect(tokens[0].value).toBe("{{> partialName}}");
  });

  it("should tokenize operators", () => {
    const tokens = lexer.tokenize("{{var1 + var2}}");
    expect(tokens.length).toBe(3);
    expect(tokens[0]).toBeInstanceOf(Token);
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe("var1");
    expect(tokens[1]).toBeInstanceOf(Token);
    expect(tokens[1].type).toBe(TokenType.OPERATOR);
    expect(tokens[1].value).toBe("+");
    expect(tokens[2]).toBeInstanceOf(Token);
    expect(tokens[2].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[2].value).toBe("var2");
  });
});
