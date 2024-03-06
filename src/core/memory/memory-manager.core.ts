import { ConsoleLogger } from "../common/services/console-logger.service";
import { Initializable } from "../common/interfaces/initializable.interface";
import { MetaRoute } from "../common/meta-route.container";
import { MetaRouteMemoryPolicy } from "./policies/memory-policy.abstract";
import { Scope } from "../common/enums/scope.enum";
import { Injectable } from "../common/decorators/injectable.decorator";

@Injectable({ scope: Scope.CONFIGURATOR })
export class MemoryManager implements Initializable {
  private readonly logger = new ConsoleLogger(MemoryManager.name);
  private intervalId?: NodeJS.Timeout;
  private policies: MetaRouteMemoryPolicy[] = [];

  async setup() {
    this.policies = MetaRoute.getAllByScope(Scope.MEMORY_POLICY);

    this.intervalId = setInterval(() => {
      const { rss, heapTotal, heapUsed, external } = process.memoryUsage();
      const memoryUsage = {
        rssInMB: rss / 1024 / 1024,
        heapTotalInMB: heapTotal / 1024 / 1024,
        heapUsedInMB: heapUsed / 1024 / 1024,
        externalInMB: external / 1024 / 1024,
      };

      for (const policy of this.policies) {
        if (policy.check(memoryUsage)) {
          this.logger.warn(
            `${memoryUsage}: Memory usage exceeded for rule with policy ${policy.constructor.name}`
          );
          // TODO: Implement violation handling
        }
      }
    }, 10000);
  }

  cleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
