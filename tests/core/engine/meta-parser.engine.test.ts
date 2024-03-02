import { Token } from "@core/engine/entities/token.entity";
import { NodeType } from "@core/engine/enums/node-type.enum";
import { TokenType } from "@core/engine/enums/token-type.enum";
import { MetaParser } from "@core/engine/meta-parser.engine";

describe("MetaParser", () => {
  it("should correctly parse identifier tokens", () => {
    const tokens = [new Token(TokenType.IDENTIFIER, "test")];
    const parser = new MetaParser(tokens);
    const result = parser.parse();
    expect(result.type).toBe(NodeType.ROOT);
    expect(result.children[0].type).toBe(NodeType.EXPRESSION);
    expect(result.children[0].value).toBe("test");
  });

  it("should correctly parse HTML open tag", () => {
    const tokens = [new Token(TokenType.HTML, '<html lang="en">')];
    const parser = new MetaParser(tokens);
    const result = parser.parse();
    expect(result.type).toBe(NodeType.ROOT);
    expect(result.children[0].type).toBe(NodeType.HTML);
    expect(result.children[0].value).toBe('<html lang="en">');
  });

  it("should correctly parse literal tokens", () => {
    const tokens = [new Token(TokenType.LITERAL, "123")];
    const parser = new MetaParser(tokens);
    const result = parser.parse();
    expect(result.type).toBe(NodeType.ROOT);
    expect(result.children[0].type).toBe(NodeType.EXPRESSION);
    expect(result.children[0].value).toBe("123");
  });

  it("should correctly parse multiple tokens", () => {
    const tokens = [
      new Token(TokenType.IDENTIFIER, "test"),
      new Token(TokenType.OPERATOR, "+"),
      new Token(TokenType.LITERAL, "123"),
    ];
    const parser = new MetaParser(tokens);
    const result = parser.parse();
    expect(result.type).toBe(NodeType.ROOT);
    expect(result.children[0].type).toBe(NodeType.EXPRESSION);
    expect(result.children[0].value).toBe("test + 123");
  });

  it("should correctly parse nested structures", () => {
    const tokens = [
      new Token(TokenType.OPEN_IF, "if"),
      new Token(TokenType.IDENTIFIER, "condition"),
      new Token(TokenType.OPEN_BRACE, "{{"),
      new Token(TokenType.IDENTIFIER, "insideIf"),
      new Token(TokenType.CLOSE_BRACE, "}}"),
      new Token(TokenType.CLOSE_IF, "endif"),
    ];
    const parser = new MetaParser(tokens);
    const result = parser.parse();
    expect(result.type).toBe(NodeType.ROOT);
    const ifNode = result.children[0];
    expect(ifNode.type).toBe(NodeType.IF_STATEMENT);
    expect(ifNode.children[0].type).toBe(NodeType.IDENTIFIER);
    expect(ifNode.children[0].value).toBe("");
    expect(ifNode.children[1].type).toBe(NodeType.EXPRESSION);
    expect(ifNode.children[1].value).toBe("condition");
  });

  it("should correctly parse complex nested structures", () => {
    const tokens = [
      new Token(TokenType.OPEN_IF, "if"),
      new Token(TokenType.IDENTIFIER, "condition1"),
      new Token(TokenType.OPEN_BRACE, "{{"),
      new Token(TokenType.IDENTIFIER, "insideIf1"),
      new Token(TokenType.OPEN_IF, "if"),
      new Token(TokenType.IDENTIFIER, "condition2"),
      new Token(TokenType.OPEN_BRACE, "{{"),
      new Token(TokenType.IDENTIFIER, "insideIf2"),
      new Token(TokenType.CLOSE_BRACE, "}}"),
      new Token(TokenType.CLOSE_IF, "endif"),
      new Token(TokenType.CLOSE_BRACE, "}}"),
      new Token(TokenType.CLOSE_IF, "endif"),
    ];
    const parser = new MetaParser(tokens);
    const result = parser.parse();
    expect(result.type).toBe(NodeType.ROOT);
    const ifNode1 = result.children[0];
    expect(ifNode1.type).toBe(NodeType.IF_STATEMENT);
    expect(ifNode1.children[0].type).toBe(NodeType.IDENTIFIER);
    expect(ifNode1.children[0].value).toBe("");
    expect(ifNode1.children[1].type).toBe(NodeType.EXPRESSION);
    expect(ifNode1.children[1].value).toBe("condition1");
    const ifNode2 = ifNode1.children[2];
    expect(ifNode2.type).toBe(NodeType.EXPRESSION);
  });

  it("should correctly parse interpolation tokens", () => {
    const tokens = [new Token(TokenType.INTERPOLATION, "{{title}}")];
    const parser = new MetaParser(tokens);
    const result = parser.parse();
    expect(result.type).toBe(NodeType.ROOT);
    expect(result.children[0].type).toBe(NodeType.INTERPOLATION);
    expect(result.children[0].children[0].type).toBe(NodeType.IDENTIFIER);
    expect(result.children[0].children[0].value).toBe("title");
  });
});
