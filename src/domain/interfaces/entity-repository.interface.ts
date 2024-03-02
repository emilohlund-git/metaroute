export interface EntityRepository<T> {
  save(entity: T): Promise<T | null>;
  findById(id: number): Promise<T | null>;
  find(criteria: Partial<T>): Promise<T | null>;
  update(id: number, data: T): Promise<T | null>;
  remove(id: number): Promise<boolean>;
}
