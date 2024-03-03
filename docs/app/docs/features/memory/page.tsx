import DocsCode from "@/components/DocsCode";
import DocsContainer from "@/components/DocsContainer";
import DocsHeader from "@/components/DocsHeader";
import DocsSection from "@/components/DocsSection";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import React from "react";

export default function Memory() {
  return (
    <DocsContainer>
      <ScrollToAnchor />
      <DocsSection>
        <h1 className="text-3xl font-bold mb-4">Memory Management</h1>
        <p className="text-lg">
          Memory management in MetaRoute allows you to monitor and control
          memory usage within your application. It provides features for setting
          up memory policies, checking memory usage, and enforcing memory limits
          to ensure optimal performance and prevent memory leaks.
        </p>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Memory Policies" />
        <p className="text-lg">
          Memory policies in MetaRoute define rules and behaviors for managing
          memory usage. You can set up custom memory policies to enforce
          specific constraints and actions based on memory usage metrics.
        </p>
        <DocsCode>
          {`import { MetaRouteMemoryPolicy, MemoryUsage } from "@emilohlund-git/metaroute";

@MemoryPolicy
export class PrintMemoryUsagePolicy extends MetaRouteMemoryPolicy {
  setup(): void {
    // Setup memory policy
  }

  check(memoryUsage: MemoryUsage): boolean {
    // Check memory usage and apply policy
    return false; // This rule never reports a violation
  }
}`}
        </DocsCode>
      </DocsSection>

      <DocsSection>
        <DocsHeader text="Memory Manager" />
        <p className="text-lg">
          The memory manager in MetaRoute coordinates memory policies and
          monitors memory usage in real-time. It provides utilities for
          registering and managing memory policies, checking memory usage
          metrics, and enforcing memory limits across your application.
        </p>
        <DocsCode>
          {`import { MemoryManager } from "@emilohlund-git/metaroute";

const memoryManager = new MemoryManager();
memoryManager.registerPolicy(PrintMemoryUsagePolicy);`}
        </DocsCode>
      </DocsSection>
    </DocsContainer>
  );
}
