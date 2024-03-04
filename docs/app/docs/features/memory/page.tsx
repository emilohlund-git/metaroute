import React from "react";
import DocsContainer from "@/components/DocsContainer";
import DocsSection from "@/components/DocsSection";
import DocsHeader from "@/components/DocsHeader";
import DocsCodeSnippet from "@/components/DocsCodeSnippet";
import DocsCode from "@/components/DocsCode";
import ScrollToAnchor from "@/components/ScrollToAnchor";
import { DocsPageTitle } from "@/components/DocsPageTitle";
import { DocsPageParagraph } from "@/components/DocsPageParagraph";

export default function Memory() {
  return (
    <DocsContainer>
      <ScrollToAnchor />

      <DocsSection id="introduction">
        <DocsPageTitle title="Memory Management" />
        <DocsPageParagraph>
          Memory management in MetaRoute allows you to monitor and control
          memory usage within your application. It provides features for setting
          up memory policies, checking memory usage, and enforcing memory limits
          to ensure optimal performance and prevent memory leaks.
        </DocsPageParagraph>
      </DocsSection>

      <DocsSection id="memory-policies">
        <DocsHeader text="Memory Policies" />
        <DocsPageParagraph>
          Memory policies in MetaRoute define rules and behaviors for managing
          memory usage. You can set up custom memory policies to enforce
          specific constraints and actions based on memory usage metrics.
        </DocsPageParagraph>
        <DocsCode language="javascript">
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

      <DocsSection id="memory-manager">
        <DocsHeader text="Memory Manager" />
        <DocsPageParagraph>
          The memory manager in MetaRoute coordinates memory policies and
          monitors memory usage in real-time. It provides utilities for
          registering and managing memory policies, checking memory usage
          metrics, and enforcing memory limits across your application. The
          framework will look for classes annotated with{" "}
          <DocsCodeSnippet snippet="@MemoryPolicy" /> and register them
          automatically.
        </DocsPageParagraph>
      </DocsSection>
    </DocsContainer>
  );
}
