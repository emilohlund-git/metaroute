import { ConsoleLogger } from "../../common/services/console-logger.service";
import { MetaRouteMemoryPolicy } from "./memory-policy.abstract";
import { MemoryUsage } from "../dtos/memory.usage.dto";
import { ConfigService } from "../../common/services/config.service";
import { MemoryPolicy } from "../decorators/memory-policy.decorator";

@MemoryPolicy
export class ThresholdExceededRule extends MetaRouteMemoryPolicy {
  private readonly logger = new ConsoleLogger(ThresholdExceededRule.name);
  private thresholdInMb: number;

  constructor(private readonly configService: ConfigService) {
    super();
  }

  setup() {
    this.thresholdInMb =
      parseInt(this.configService.get("MEMORY_THRESHOLD_MB")) || 200;
  }

  check(memoryUsage: MemoryUsage): boolean {
    if (memoryUsage.heapUsedInMB > this.thresholdInMb) {
      this.logger.error(
        `Heap memory threshold exceeded: ${memoryUsage.heapUsedInMB.toFixed(
          2
        )} MB`
      );
      return true;
    }
    return false;
  }
}
