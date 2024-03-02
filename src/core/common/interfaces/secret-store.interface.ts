export interface SecretStore {
  getEnvironmentVariables(): any;
  get(key: string): string | undefined;
}
