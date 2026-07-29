"use client";

import { useEffect, useMemo, useState } from "react";
import { menu } from "@/data/site";

const filters = [
  { label: "All", value: "all" },
  { label: "Veg", value: "veg" },
  { label: "Non-Veg", value: "nonveg" }
];

export default function MenuExplorer({ menuItems = menu }) {
  const [activeCategory, setActiveCategory] = useState(menuItems[3]?.category || menuItems[0]?.category || "");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!menuItems.some((group) => group.category === activeCategory)) {
      setActiveCategory(menuItems[3]?.category || menuItems[0]?.category || "");
    }
  }, [activeCategory, menuItems]);

  const activeGroup = menuItems.find((group) => group.category === activeCategory) || menuItems[0];
  const filteredItems = useMemo(() => {
    if (!activeGroup) return [];
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const sourceItems = normalizedSearch
      ? menuItems.flatMap((group) => group.items.map((item) => ({ ...item, category: group.category })))
      : activeGroup.items.map((item) => ({ ...item, category: activeGroup.category }));

    return sourceItems.filter((item) => {
      const matchesFilter = filter === "all" || item.type === filter;
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.note.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [activeGroup, filter, menuItems, searchTerm]);

  const midpoint = Math.ceil(filteredItems.length / 2);
  const columns = [filteredItems.slice(0, midpoint), filteredItems.slice(midpoint)];
  const activeVegCount = activeGroup?.items.filter((item) => item.type === "veg").length || 0;
  const activeNonVegCount = activeGroup?.items.filter((item) => item.type === "nonveg").length || 0;
  const isSearching = searchTerm.trim().length > 0;

  if (!activeGroup) return null;

  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
      <div className="sticky top-28 hidden min-h-[560px] overflow-hidden rounded-[2.5rem] border border-white/40 bg-[#15120f] shadow-[0_30px_90px_rgba(48,28,14,0.18)] lg:block">
        <div className="absolute inset-0">
          <img src="/food-momo.JPG" alt="" className="h-full w-full object-cover opacity-[0.82]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/84 via-black/22 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.2),transparent_15rem)]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-turmeric">Take a closer look</p>
          <h3 className="mt-3 text-6xl font-extrabold leading-[0.88] tracking-[-0.055em]">Momo, thali, chai.</h3>
          <p className="mt-5 max-w-sm text-base font-medium leading-7 text-white/70">
            Select a category to reveal the menu beside it, with filters for veg and non-veg.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/78 shadow-[0_28px_80px_rgba(50,30,17,0.11)] backdrop-blur">
        <div className="yy-no-scrollbar overflow-x-auto border-b border-cedar/10 px-4 pb-3 pt-4 sm:px-6">
          <div className="flex min-w-max gap-2">
            {menuItems.map((group) => {
              const isActive = group.category === activeCategory;

              return (
                <button
                  key={group.category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(group.category);
                    setSearchTerm("");
                  }}
                  className={`h-12 rounded-full border px-5 text-sm font-extrabold transition duration-300 ${
                    isActive
                      ? "border-[#15120f] bg-[#15120f] text-white shadow-[0_14px_30px_rgba(0,0,0,0.14)]"
                      : "border-black/5 bg-white text-[#15120f] shadow-sm hover:-translate-y-0.5 hover:border-ember/35 hover:text-ember"
                  }`}
                >
                  {group.category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 border-b border-cedar/10 pb-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-ember">
                {isSearching ? `${filteredItems.length} results` : `${activeGroup.items.length} items`}
              </p>
              <h3 className="mt-2 text-4xl font-extrabold tracking-[-0.055em] text-[#15120f] sm:text-5xl">
                {isSearching ? "Search Results" : activeGroup.category}
              </h3>
              <p className="mt-3 max-w-xl text-base font-medium leading-7 text-cedar/62">
                {isSearching ? `Showing matches across the full Yak & Yeti's menu for "${searchTerm.trim()}".` : activeGroup.intro}
              </p>
              {!isSearching && (
                <span className="mt-3 flex gap-4 text-sm font-extrabold text-cedar/52">
                  <span>{activeVegCount} veg</span>
                  <span>{activeNonVegCount} non-veg</span>
                </span>
              )}
            </div>
            <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
              <label className="group flex min-h-14 items-center gap-3 rounded-full border border-black/5 bg-white px-4 shadow-[0_12px_30px_rgba(43,25,13,0.07)] transition focus-within:border-ember/45 focus-within:shadow-[0_18px_40px_rgba(185,87,44,0.12)]">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#15120f] text-white">
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="m16 16 4 4" />
                  </svg>
                </span>
                <span className="sr-only">Search menu</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search Momo, Thali, Chai..."
                  className="min-w-0 flex-1 bg-transparent text-base font-bold text-[#15120f] outline-none placeholder:text-cedar/38"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f5f1ea] text-sm font-black text-cedar/62 transition hover:bg-[#15120f] hover:text-white"
                    aria-label="Clear menu search"
                  >
                    x
                  </button>
                )}
              </label>

              <div className="inline-flex w-fit rounded-full bg-[#f5f1ea] p-1 shadow-inner">
                {filters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                      filter === item.value ? "bg-[#15120f] text-white shadow-sm" : "text-cedar/62 hover:text-ember"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-x-8 lg:grid-cols-2">
            {filteredItems.length > 0 ? (
              columns.map((items, columnIndex) => (
                <div key={columnIndex} className="min-w-0">
                  {items.map((item) => (
                    <div key={`${item.category}-${item.name}`} className="grid grid-cols-[1fr_auto] gap-4 border-b border-cedar/10 py-5 last:border-b-0">
                      <div className="min-w-0">
                        <p className="text-lg font-extrabold leading-6 tracking-[-0.02em] text-[#1c1713]">
                          {item.name}
                          <span className={`ml-2 inline-block h-2.5 w-2.5 rounded-full align-middle ${item.type === "nonveg" ? "bg-red-500" : "bg-emerald-500"}`} />
                        </p>
                        {isSearching && <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.16em] text-ember">{item.category}</p>}
                        <p className="mt-2 text-sm font-medium leading-6 text-cedar/58">{item.note}</p>
                      </div>
                      <p className="whitespace-nowrap text-lg font-extrabold text-[#1c1713]">{item.price}</p>
                    </div>
                  ))}
                  {items.length === 0 && <div className="py-10 text-center text-sm font-bold text-cedar/45">No more items</div>}
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-sm font-bold text-cedar/55 lg:col-span-2">
                No menu items found for {searchTerm ? `"${searchTerm}"` : activeGroup.category}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
