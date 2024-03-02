import { Crud } from "../../common/interfaces/crud.interface";
import { CodeFirstDatabase } from "../../database/code-first-database.abstract";
import { DatabaseResponse } from "../../database/interfaces/database-response.interface";

export abstract class CodeFirstRepository<T> implements Crud<T> {
  protected codeFirstDatabase: CodeFirstDatabase<T>;

  constructor(codeFirstDatabase: CodeFirstDatabase<T>) {
    this.codeFirstDatabase = codeFirstDatabase;
  }

  async save(entity: T): Promise<DatabaseResponse<T>> {
    return await this.codeFirstDatabase.save(entity);
  }
  async find(criteria: Partial<T>): Promise<DatabaseResponse<T>> {
    return await this.codeFirstDatabase.find(criteria);
  }
  async findAll(): Promise<DatabaseResponse<T[]>> {
    return await this.codeFirstDatabase.findAll();
  }
  async update(entity: T, id: number): Promise<DatabaseResponse<T>> {
    return await this.codeFirstDatabase.update(entity, id);
  }
  async remove(id: number): Promise<DatabaseResponse<boolean>> {
    return await this.codeFirstDatabase.remove(id);
  }
}
