export class EvaluatorException extends Error {
  constructor(message: string) {
    super(`[Evaluator] - ${message}`);
    this.name = "EvaluatorException";
  }
}
