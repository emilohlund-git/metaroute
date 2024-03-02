import { MemoryUsage } from "../dtos/memory.usage.dto";

export abstract class MetaRouteMemoryPolicy {
  abstract setup(): void;
  abstract check(memoryUsage: MemoryUsage): boolean;
}
