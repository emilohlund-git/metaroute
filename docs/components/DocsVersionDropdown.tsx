type Props = {
  versions: {
    name: string;
    url: string;
  }[];
};

export default function DocsVersionDropdown({ versions }: Props) {
  return (
    <div className="dropdown">
      <div
        tabIndex={1}
        className="badge badge-outline cursor-pointer select-none"
      >
        {versions[0]?.name || (
          <span className="loading loading-spinner w-3"></span>
        )}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-neutral select-none"
      >
        {versions.length > 1
          ? versions.slice(1).map((version) => (
              <li key={version.name}>
                <a href={version.url} target="_blank" rel="noopener noreferrer">
                  {version.name}
                </a>
              </li>
            ))
          : "No other versions available"}
      </ul>
    </div>
  );
}
