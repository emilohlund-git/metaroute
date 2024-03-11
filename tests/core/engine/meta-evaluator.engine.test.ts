import { Node } from "@core/engine/entities/node.entity";
import { NodeType } from "@core/engine/enums/node-type.enum";
import { MetaEvaluator } from "@core/engine/meta-evaluator.engine";
import { Engine, MetaEngine } from "@core/engine";
import { mock } from "ts-mockito";

describe("MetaEvaluator", () => {
  let evaluator: MetaEvaluator;
  let ast: Node;
  let data: object;
  let engine: Engine;

  beforeEach(() => {
    ast = new Node(NodeType.ROOT, "", [
      new Node(NodeType.HTML, "<div>Test</div>"),
    ]);

    engine = mock(MetaEngine);

    data = {};
    evaluator = new MetaEvaluator(ast, data, engine);
  });

  test("should create an instance", () => {
    expect(evaluator).toBeInstanceOf(MetaEvaluator);
  });

  test("evaluateNode should return correct value for NodeType.HTML", () => {
    const result = evaluator.evaluate();
    expect(result).toBe("<div>Test</div>");
  });

  test("evaluateIfStatement should return correct value when condition is true", () => {
    const ifNode = new Node(NodeType.IF_STATEMENT, "", [
      new Node(NodeType.IDENTIFIER, "condition"),
      new Node(NodeType.HTML, "<div>Condition is true</div>"),
    ]);
    const ast = new Node(NodeType.ROOT, "", [ifNode]);
    const data = { condition: true };
    const evaluator = new MetaEvaluator(ast, data, engine);

    const result = evaluator.evaluate();
    expect(result).toBe("<div>Condition is true</div>");
  });

  test("evaluateEachStatement should return correct value for array in context", () => {
    const eachNode = new Node(NodeType.EACH_STATEMENT, "", [
      new Node(NodeType.IDENTIFIER, "items"),
      new Node(NodeType.HTML, "<div>This is an item</div>"),
    ]);
    const ast = new Node(NodeType.ROOT, "", [eachNode]);
    const data = { items: [1, 2, 3] };
    const evaluator = new MetaEvaluator(ast, data, engine);

    const result = evaluator.evaluate();
    expect(result).toBe(
      "<div>This is an item</div><div>This is an item</div><div>This is an item</div>"
    );
  });

  test("evaluateNode should return correct value for NodeType.INTERPOLATION", () => {
    const interpolationNode = new Node(NodeType.INTERPOLATION, "{{name}}");
    const ast = new Node(NodeType.ROOT, "", [interpolationNode]);
    const data = { name: "John Doe" };
    const evaluator = new MetaEvaluator(ast, data, engine);

    const result = evaluator.evaluate();
    expect(result).toBe("John Doe");
  });

  test("evaluateNode should return correct value for NodeType.EXPRESSION", () => {
    const expressionNode = new Node(NodeType.EXPRESSION, "this.name");
    const ast = new Node(NodeType.ROOT, "", [expressionNode]);
    const data = { name: "John Doe" };
    const evaluator = new MetaEvaluator(ast, data, engine);

    const result = evaluator.evaluate();
    expect(result).toBe("John Doe");
  });

  test("evaluateNode should throw error for unsupported NodeType", () => {
    const unsupportedNode = new Node("UNSUPPORTED" as NodeType, "unsupported");
    const ast = new Node(NodeType.ROOT, "", [unsupportedNode]);
    const data = {};
    const evaluator = new MetaEvaluator(ast, data, engine);

    expect(() => evaluator.evaluate()).toThrow(
      "Node type UNSUPPORTED is not supported for evaluation"
    );
  });

  test("evaluateEachStatement should return correct value for nested array in context", () => {
    const innerEachNode = new Node(NodeType.EACH_STATEMENT, "", [
      new Node(NodeType.IDENTIFIER, "innerItems"),
      new Node(NodeType.HTML, "<div>This is an inner item</div>"),
    ]);
    const outerEachNode = new Node(NodeType.EACH_STATEMENT, "", [
      new Node(NodeType.IDENTIFIER, "outerItems"),
      innerEachNode,
    ]);
    const ast = new Node(NodeType.ROOT, "", [outerEachNode]);
    const data = {
      outerItems: [{ innerItems: [1, 2] }, { innerItems: [3, 4] }],
    };
    const evaluator = new MetaEvaluator(ast, data, engine);

    const result = evaluator.evaluate();
    expect(result).toBe(
      "<div>This is an inner item</div><div>This is an inner item</div><div>This is an inner item</div><div>This is an inner item</div>"
    );
  });

  test("evaluateNode should return correct value for NodeType.ELSE_STATEMENT", () => {
    const elseNode = new Node(NodeType.ELSE_STATEMENT, "", [
      new Node(NodeType.HTML, "<div>Condition is false</div>"),
    ]);
    const ast = new Node(NodeType.ROOT, "", [elseNode]);
    const data = { condition: false };
    const evaluator = new MetaEvaluator(ast, data, engine);

    const result = evaluator.evaluate();
    expect(result).toBe("<div>Condition is false</div>");
  });

  test("evaluateNode should return correct value for NodeType.PARTIAL", () => {
    engine.render = jest.fn().mockReturnValue("<div>Partial content</div>");

    const partialNode = new Node(NodeType.PARTIAL, "partial");
    const ast = new Node(NodeType.ROOT, "", [partialNode]);
    const data = { partial: "<div>Partial content</div>" };
    const evaluator = new MetaEvaluator(ast, data, engine);

    const result = evaluator.evaluate();
    expect(result).toBe("<div>Partial content</div>");
  });
});
