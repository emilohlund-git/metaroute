import { MetaRouteMemoryPolicy } from "./memory-policy.abstract";
import { MemoryUsage } from "../dtos/memory.usage.dto";
import { ConsoleLogger } from "../../common/services/console-logger.service";
import { ConfigService } from "../../common/services/config.service";
import { Injectable } from "../../common";
import { Scope } from "../../common/enums/scope.enum";

@Injectable({ scope: Scope.MEMORY_POLICY })
export class RapidIncreaseRule extends MetaRouteMemoryPolicy {
  private readonly logger = new ConsoleLogger(RapidIncreaseRule.name);

  constructor(private readonly configService: ConfigService) {
    super();
  }

  private memoryUsageHistory: MemoryUsage[] = [];
  private thresholdIncreaseInMB: number; // Define your threshold

  setup() {
    this.thresholdIncreaseInMB = parseInt(
      this.configService.get("MEMORY_INCREASE_THRESHOLD")
    );
  }

  check(memoryUsage: MemoryUsage): boolean {
    this.memoryUsageHistory.push(memoryUsage);
    if (this.memoryUsageHistory.length > 10) {
      this.memoryUsageHistory.shift(); // Remove the oldest memory usage
    }

    if (this.memoryUsageHistory.length === 10) {
      const averageMemoryUsage =
        this.memoryUsageHistory.reduce(
          (sum, usage) => sum + usage.heapUsedInMB,
          0
        ) / 10;
      const increase =
        averageMemoryUsage - this.memoryUsageHistory[0].heapUsedInMB;
      if (increase > this.thresholdIncreaseInMB) {
        this.logger.error(
          `Rapid average memory increase detected: ${increase.toFixed(2)} MB`
        );
        return true;
      }
    }

    return false;
  }
}