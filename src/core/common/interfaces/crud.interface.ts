import { DatabaseResponse } from "../../database/interfaces/database-response.interface";

export interface Crud<T> {
  save(entity: T): Promise<DatabaseResponse<T>>;
  find(criteria: Partial<T>): Promise<DatabaseResponse<T>>;
  findAll(): Promise<DatabaseResponse<T[]>>;
  update(entity: T, id: number): Promise<DatabaseResponse<T>>;
  remove(id: number): Promise<DatabaseResponse<boolean>>;
}
