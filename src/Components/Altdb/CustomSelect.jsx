import { useState, useRef, useEffect } from "react";

export const CustomSelect = ({ label, value, onChange, options = [], loading = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selected = options.find((o) => `${o.id}` === `${value}`);

  return (
    <div ref={ref} className="relative w-full max-w-full">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full border-2 border-[#2A57C4] rounded-lg px-6 py-3 flex items-center justify-between bg-white text-sm focus:outline-none"
      >
        <span className="text-left whitespace-nowrap overflow-hidden">
          {loading ? "Loading..." : selected ? selected.name : label}
        </span>

        <img
          src="/arbutus-web/assets/down-arrow.png"
          alt=""
          className="w-4 h-4 ml-2 pointer-events-none flex-shrink-0"
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-100 ${!value ? "bg-blue-50 font-medium" : ""}`}
          >
            {label}
          </div>

          {options.length === 0 && !loading ? (
            <div className="px-4 py-2 text-sm text-gray-500">No options</div>
          ) : (
            options.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-100 truncate ${`${item.id}` === `${value}` ? "bg-blue-50 font-medium" : ""}`}
              >
                {item.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};