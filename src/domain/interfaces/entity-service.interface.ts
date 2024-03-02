export interface IEntityService<T> {
  save(entity: T): Promise<T | null>;
  findById(id: number): Promise<T | null>;
  find(criteria: Partial<T>): Promise<T | null>;
  update(where: Partial<T>, data: Partial<T>): Promise<T | null>;
  remove(id: number): Promise<boolean>;
}
