import { removeCircularReferences } from "@core/common/functions/remove-circular-references.function";

describe("removeCircularReferences", () => {
  it("should handle non-object inputs", () => {
    expect(removeCircularReferences(123)).toBe(123);
    expect(removeCircularReferences("abc")).toBe("abc");
    expect(removeCircularReferences(null)).toBe(null);
  });

  it("should handle non-circular objects", () => {
    const obj = { a: 1, b: 2, c: { d: 3 } };
    expect(removeCircularReferences(obj)).toEqual(obj);
  });

  it("should remove circular references", () => {
    const obj: any = { a: 1 };
    obj.self = obj;
    const result = removeCircularReferences(obj);
    expect(result).toEqual({ a: 1, self: undefined });
  });
});
