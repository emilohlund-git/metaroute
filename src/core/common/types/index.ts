import { Scope } from "../enums/scope.enum";
import { Application } from "../interfaces/application.interface";

export type Entity = new () => any;
export type ServiceIdentifier<T> = new (...args: any[]) => T;
export type Brand<K, T> = K & { __brand: T };
export type NameBrand = Brand<string, "Name">;
export type ScopeBrand = Brand<Scope, "Scope">;
export type MetaRouteKey = `${NameBrand}_${ScopeBrand}` | NameBrand;
export type ApplicationConstructor = new (...args: any[]) => Application;
