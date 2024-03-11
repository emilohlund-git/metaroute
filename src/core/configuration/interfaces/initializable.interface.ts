import { AppConfiguration } from "./app-configuration.interface";

export interface Initializable {
  setup(configuration?: AppConfiguration): Promise<void> | void;
}
