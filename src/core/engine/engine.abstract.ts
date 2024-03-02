/**
 * Engine abstract class
 * @class Engine
 * 
 * @description
 * This class provides an abstract interface for template rendering engines.
 * It defines a method to render a template with the provided data.
 * 
 * @abstract
 * @author Emil Ölund
 */
export abstract class Engine {
  /**
   * Renders a template with the provided data.
   * 
   * @param {string} template 
   * @param {object} data 
   * 
   * @returns {string} The rendered HTML content.
   * 
   * @description
   * This method should be implemented by concrete subclasses to render a template
   * with the provided data. It should return the rendered HTML content as a string.
   */
  abstract render(template: string, data: object): string;
}
