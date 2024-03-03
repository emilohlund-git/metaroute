export default function DocsVersionDropdown() {
  return (
    <div className="dropdown">
      <div tabIndex={1} className="badge badge-outline cursor-pointer select-none">
        v1
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-neutral select-none"
      >
        No other versions available
      </ul>
    </div>
  );
}
