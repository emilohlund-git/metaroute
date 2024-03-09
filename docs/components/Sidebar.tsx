import SmoothScrollLink from "./SmoothScrollLink";

export default function Sidebar() {
  return (
    <ul role="tablist" className="menu text-lg rounded-box mt-16">
      <li>
        <h2 className="menu-title text-lg text-black font-bold">
          Getting started
        </h2>
        <ul>
          <li role="tab">
            <SmoothScrollLink href="/docs#welcome">Welcome</SmoothScrollLink>
          </li>
        </ul>
      </li>
      <li>
        <h2 className="menu-title text-lg text-black font-bold">Features</h2>
        <ul>
          <li>
            <SmoothScrollLink href="/docs/features/injections">
              <summary>Injections</summary>
            </SmoothScrollLink>
          </li>
          <li>
            <SmoothScrollLink href="/docs/features/caching">
              Caching
            </SmoothScrollLink>
          </li>
          <li>
            <SmoothScrollLink href="/docs/features/rate-limiting">
              Rate Limiting
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
            <SmoothScrollLink href="/docs/features/routing#introduction">
              <summary>Routing</summary>
            </SmoothScrollLink>
          </li>
        </ul>
      </li>
    </ul>
  );
}
