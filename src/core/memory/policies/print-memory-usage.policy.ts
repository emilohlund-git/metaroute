import { MetaRouteMemoryPolicy } from "./memory-policy.abstract";
import { MemoryUsage } from "../dtos/memory.usage.dto";
import { ConsoleLogger } from "../../common/services/console-logger.service";
import { MemoryManager } from "../memory-manager.core";
import { Injectable } from "../../common/decorators/injectable.decorator";
import { Scope } from "../../common/enums/scope.enum";

@Injectable({ scope: Scope.SINGLETON })
export class PrintMemoryUsageRule extends MetaRouteMemoryPolicy {
  private readonly logger = new ConsoleLogger(MemoryManager.name);

  setup(): void {}

  check(memoryUsage: MemoryUsage): boolean {
    const formattedMemoryUsage = `Memory usage: [rssInMb]: ${memoryUsage.rssInMB.toFixed(
      2
    )}, [heapTotalInMb]: ${memoryUsage.heapTotalInMB.toFixed(
      2
    )}, [heapUsedInMb]: ${memoryUsage.heapUsedInMB.toFixed(
      2
    )}, [externalInMb]: ${memoryUsage.externalInMB.toFixed(2)}`;
    this.logger.info(formattedMemoryUsage);
    return false; // This rule never reports a violation
  }
}
