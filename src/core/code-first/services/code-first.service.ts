import { Crud } from "../../common/interfaces/crud.interface";
import { DatabaseResponse } from "../../database/interfaces/database-response.interface";
import { CodeFirstRepository } from "./code-first.repository";

export abstract class CodeFirstService<T> implements Crud<T> {
  protected codeFirstRepository: CodeFirstRepository<T>;

  constructor(codeFirstRepository: CodeFirstRepository<T>) {
    this.codeFirstRepository = codeFirstRepository;
  }

  async save(entity: T): Promise<DatabaseResponse<T>> {
    return await this.codeFirstRepository.save(entity);
  }
  async find(criteria: Partial<T>): Promise<DatabaseResponse<T>> {
    return await this.codeFirstRepository.find(criteria);
  }
  async findAll(): Promise<DatabaseResponse<T[]>> {
    return await this.codeFirstRepository.findAll();
  }
  async update(entity: T, id: number): Promise<DatabaseResponse<T>> {
    return await this.codeFirstRepository.update(entity, id);
  }
  async remove(id: number): Promise<DatabaseResponse<boolean>> {
    return await this.codeFirstRepository.remove(id);
  }
}
