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

  useEffect(() => {
    if (!menuItems.some((group) => group.category === activeCategory)) {
      setActiveCategory(menuItems[3]?.category || menuItems[0]?.category || "");
    }
  }, [activeCategory, menuItems]);

  const activeGroup = menuItems.find((group) => group.category === activeCategory) || menuItems[0];
  const filteredItems = useMemo(() => {
    if (!activeGroup) return [];
    if (filter === "all") return activeGroup.items;
    return activeGroup.items.filter((item) => item.type === filter);
  }, [activeGroup, filter]);

  const midpoint = Math.ceil(filteredItems.length / 2);
  const columns = [filteredItems.slice(0, midpoint), filteredItems.slice(midpoint)];
  const activeVegCount = activeGroup?.items.filter((item) => item.type === "veg").length || 0;
  const activeNonVegCount = activeGroup?.items.filter((item) => item.type === "nonveg").length || 0;

  if (!activeGroup) return null;

  return (
    <div className="mt-12 rounded-[2rem] border border-black/5 bg-white p-4 shadow-[0_24px_70px_rgba(42,30,21,0.09)] sm:p-6">
      <div className="-mx-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6">
        <div className="flex min-w-max gap-2">
        {menuItems.map((group) => {
          const isActive = group.category === activeCategory;

          return (
            <button
              key={group.category}
              type="button"
              onClick={() => setActiveCategory(group.category)}
              className={`h-14 rounded-full border px-5 text-sm font-semibold transition duration-300 ${
                isActive
                  ? "border-[#15120f] bg-[#15120f] text-white shadow-[0_12px_28px_rgba(0,0,0,0.14)]"
                  : "border-black/5 bg-[#fbfaf8] text-[#15120f] shadow-sm hover:-translate-y-0.5 hover:border-ember/35 hover:text-ember"
              }`}
            >
              {group.category}
            </button>
          );
        })}
        </div>
      </div>

      <div className="mt-5 rounded-[1.75rem] border border-black/5 bg-[#fbfaf8] p-5 sm:p-6">
        <div className="flex flex-col gap-5 border-b border-cedar/10 pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember">{activeGroup.items.length} items</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#15120f]">{activeGroup.category}</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-cedar/60">
              {activeGroup.intro}
              <span className="mt-2 flex gap-4 font-semibold text-cedar/52">
                <span>{activeVegCount} veg</span>
                <span>{activeNonVegCount} non-veg</span>
              </span>
            </p>
          </div>
          <div className="inline-flex w-fit rounded-full bg-[#f5f1ea] p-1">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filter === item.value ? "bg-[#15120f] text-white shadow-sm" : "text-cedar/62 hover:text-ember"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {filteredItems.length > 0 ? (
            columns.map((items, columnIndex) => (
              <div key={columnIndex} className="rounded-[1.25rem] bg-white px-4 shadow-sm ring-1 ring-black/5">
                {items.map((item) => (
                  <div key={item.name} className="grid grid-cols-[1fr_auto] gap-4 border-b border-cedar/8 py-4 last:border-b-0">
                    <div>
                      <p className="text-base font-semibold leading-6 text-[#1c1713]">
                        {item.name}
                        <span className={`ml-2 inline-block h-2.5 w-2.5 rounded-full align-middle ${item.type === "nonveg" ? "bg-red-500" : "bg-emerald-500"}`} />
                      </p>
                      <p className="mt-1 text-sm leading-6 text-cedar/58">{item.note}</p>
                    </div>
                    <p className="whitespace-nowrap text-base font-semibold text-[#1c1713]">{item.price}</p>
                  </div>
                ))}
                {items.length === 0 && <div className="py-10 text-center text-sm font-medium text-cedar/45">No more items</div>}
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-sm font-medium text-cedar/55 lg:col-span-2">No items in this filter for {activeGroup.category}.</div>
          )}
        </div>
      </div>
    </div>
  );
}
