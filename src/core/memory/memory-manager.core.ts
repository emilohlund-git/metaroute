import { ConsoleLogger } from "../common/services/console-logger.service";
import { Initializable } from "../configuration/interfaces/initializable.interface";
import { MetaRoute } from "../common/meta-route.container";
import { MetaRouteMemoryPolicy } from "./policies/memory-policy.abstract";
import { Scope } from "../common/enums/scope.enum";
import { Injectable } from "../common/decorators/injectable.decorator";
import { INJECTABLE_METADATA_KEY } from "../common";

@Injectable({ scope: Scope.SINGLETON })
export class MemoryManager implements Initializable {
  private readonly logger = new ConsoleLogger(MemoryManager.name);
  private intervalId?: NodeJS.Timeout;
  private policies: MetaRouteMemoryPolicy[] = [];

  async setup() {
    const objects = MetaRoute.getAllInstances();

    for (const object of objects) {
      const metadata = Reflect.getMetadata(
        INJECTABLE_METADATA_KEY,
        object.constructor
      );
      if (
        metadata &&
        metadata.scope === Scope.SINGLETON &&
        object instanceof MetaRouteMemoryPolicy
      ) {
        object.setup();
        this.policies.push(object);
      }
    }

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
            `[${policy.constructor.name}]: Memory usage exceeded for rule with policy ${policy.constructor.name}`
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
