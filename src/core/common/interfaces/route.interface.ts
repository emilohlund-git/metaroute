export interface Route {
  method: string;
  path: string;
  middleware: any[];
  params: Record<string, new () => {}>;
}
