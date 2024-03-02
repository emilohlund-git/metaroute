import { NodeType } from "../enums/node-type.enum";

export class Node {
  constructor(
    public type: NodeType,
    public value: string,
    public children: Node[] = []
  ) {}
}
