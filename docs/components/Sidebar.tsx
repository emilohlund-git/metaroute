import Link from "next/link";
import SmoothScrollLink from "./SmoothScrollLink";

export default function Sidebar() {
  return (
    <ul className="menu text-lg rounded-box mt-16">
      <li>
        <details open>
          <summary className="font-bold">Getting Started</summary>
          <ul>
            <li>
              <SmoothScrollLink href="/docs#introduction">
                Introduction
              </SmoothScrollLink>
            </li>
            <li>
              <SmoothScrollLink href="/docs#installation">
                Installation
              </SmoothScrollLink>
            </li>
            <li>
              <SmoothScrollLink href="/docs#usage">Usage</SmoothScrollLink>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <details open>
          <summary className="font-bold">Features</summary>
          <ul>
            <li>
              <SmoothScrollLink href="/docs/features/caching">
                Caching
              </SmoothScrollLink>
            </li>
            <li>
              <SmoothScrollLink href="/docs/features/auth">
                Authentication
              </SmoothScrollLink>
            </li>
            <li>
              <SmoothScrollLink href="/docs/features/email">
                Email
              </SmoothScrollLink>
            </li>
            <li>
              <SmoothScrollLink href="/docs/features/templating">
                Templating
              </SmoothScrollLink>
            </li>
            <li>
              <SmoothScrollLink href="/docs/features/memory">
                Memory
              </SmoothScrollLink>
            </li>
            <li>
              <SmoothScrollLink href="/docs/features/validation">
                Validation
              </SmoothScrollLink>
            </li>
            <li>
              <SmoothScrollLink href="/docs/features/logging">
                Logging
              </SmoothScrollLink>
            </li>
            <li>
              <SmoothScrollLink href="/docs/features/configuration">
                Configuration
              </SmoothScrollLink>
            </li>
            <li>
              <details>
                <summary>Routing</summary>
                <ul>
                  <li>
                    <SmoothScrollLink href="/docs/features/routing#http">
                      HTTP
                    </SmoothScrollLink>
                  </li>
                  <li>
                    <SmoothScrollLink href="/docs/features/routing#event">
                      Event
                    </SmoothScrollLink>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  );
}
