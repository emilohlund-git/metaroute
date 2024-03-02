export class TemplateEngineException extends Error {
    constructor(message: string) {
      super(`[TemplateEngine] - ${message}`);
      this.name = "TemplateEngineException";
    }
  }
  