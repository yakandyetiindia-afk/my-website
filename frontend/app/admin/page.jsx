"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { resetEditableContent, saveEditableContent } from "@/components/useEditableContent";
import { CONTENT_STORAGE_KEY, defaultContent, mergeContent } from "@/lib/content";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-cedar/50">{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#15120f] outline-none transition focus:border-ember"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-cedar/50">{label}</span>
      <textarea
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#15120f] outline-none transition focus:border-ember"
      />
    </label>
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const [content, setContent] = useState(defaultContent);
  const [activeCategory, setActiveCategory] = useState(defaultContent.menu[0]?.category || "");
  const [message, setMessage] = useState("");
  const [importValue, setImportValue] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONTENT_STORAGE_KEY);
      const next = stored ? mergeContent(JSON.parse(stored)) : defaultContent;
      setContent(next);
      setActiveCategory(next.menu[0]?.category || "");
    } catch {
      setContent(defaultContent);
    }
  }, []);

  const activeIndex = useMemo(
    () => Math.max(0, content.menu.findIndex((group) => group.category === activeCategory)),
    [activeCategory, content.menu]
  );
  const activeGroup = content.menu[activeIndex] || content.menu[0];

  const update = (path, value) => {
    setContent((current) => {
      const next = clone(current);
      let ref = next;
      path.slice(0, -1).forEach((key) => {
        ref = ref[key];
      });
      ref[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateActiveGroup = (key, value) => {
    setContent((current) => {
      const next = clone(current);
      next.menu[activeIndex][key] = value;
      if (key === "category") setActiveCategory(value);
      return next;
    });
  };

  const updateItem = (itemIndex, key, value) => {
    setContent((current) => {
      const next = clone(current);
      next.menu[activeIndex].items[itemIndex][key] = value;
      return next;
    });
  };

  const save = () => {
    saveEditableContent(content);
    setMessage("Saved. Open the homepage in this browser to see the updates.");
  };

  const exportJson = () => {
    setImportValue(JSON.stringify(content, null, 2));
    setMessage("Export JSON is ready below.");
  };

  const importJson = () => {
    try {
      const next = mergeContent(JSON.parse(importValue));
      setContent(next);
      setActiveCategory(next.menu[0]?.category || "");
      saveEditableContent(next);
      setMessage("Imported and saved.");
    } catch {
      setMessage("Import failed. Check the JSON format.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-[#15120f]">
      <Header />
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2.5rem] bg-[#15120f] p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,0.18)] sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-turmeric">Admin</p>
                <h1 className="mt-4 text-5xl font-extrabold leading-[0.94] tracking-[-0.055em] sm:text-6xl">
                  Update website content.
                </h1>
                <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/62">
                  Edit menu items, hero text, links, reviews, and image URLs without opening the code.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={save} className="rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#15120f]">
                  Save changes
                </button>
                <button onClick={exportJson} className="rounded-full bg-white/10 px-5 py-3 text-sm font-extrabold text-white">
                  Export
                </button>
                <button
                  onClick={() => {
                    resetEditableContent();
                    setContent(defaultContent);
                    setActiveCategory(defaultContent.menu[0]?.category || "");
                    setMessage("Reset to default content.");
                  }}
                  className="rounded-full bg-white/10 px-5 py-3 text-sm font-extrabold text-white"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {message && (
            <p className="mt-4 rounded-2xl border border-black/5 bg-white px-5 py-3 text-sm font-extrabold text-ember shadow-sm">
              {message}
            </p>
          )}

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-black/5 bg-white/82 p-6 shadow-[0_20px_60px_rgba(42,30,21,0.08)] backdrop-blur">
              <h2 className="text-2xl font-extrabold tracking-[-0.04em]">Text and links</h2>
              <div className="mt-5 grid gap-4">
                <Field label="Phone" value={content.business.phone} onChange={(value) => update(["business", "phone"], value)} />
                <Field label="WhatsApp number" value={content.business.whatsapp} onChange={(value) => update(["business", "whatsapp"], value)} />
                <Field label="Instagram URL" value={content.business.instagram} onChange={(value) => update(["business", "instagram"], value)} />
                <Field label="Google Maps URL" value={content.business.maps} onChange={(value) => update(["business", "maps"], value)} />
                <Field label="Google review URL" value={content.business.reviewLink} onChange={(value) => update(["business", "reviewLink"], value)} />
                <Field label="Zomato URL" value={content.business.zomato} onChange={(value) => update(["business", "zomato"], value)} />
                <Field label="Address / map label" value={content.business.address} onChange={(value) => update(["business", "address"], value)} />
                <TextArea label="Hours" value={content.business.hours} onChange={(value) => update(["business", "hours"], value)} />
                <TextArea label="Hero title" value={content.hero.title} onChange={(value) => update(["hero", "title"], value)} />
                <TextArea label="Hero description" value={content.hero.description} onChange={(value) => update(["hero", "description"], value)} />
                <TextArea label="Menu title" value={content.menuText.title} onChange={(value) => update(["menuText", "title"], value)} />
                <TextArea label="Menu description" value={content.menuText.description} onChange={(value) => update(["menuText", "description"], value)} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-white/82 p-6 shadow-[0_20px_60px_rgba(42,30,21,0.08)] backdrop-blur">
              <h2 className="text-2xl font-extrabold tracking-[-0.04em]">Hero food images</h2>
              <div className="mt-5 grid gap-4">
                {content.hero.foodImages.map((image, index) => (
                  <div key={index} className="rounded-2xl bg-[#f7f2ea] p-4">
                    <Field label={`Image ${index + 1} URL`} value={image.src} onChange={(value) => update(["hero", "foodImages", index, "src"], value)} />
                    <div className="mt-3">
                      <Field label="Alt text" value={image.alt} onChange={(value) => update(["hero", "foodImages", index, "alt"], value)} />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-3 text-sm font-semibold text-cedar/70"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        update(["hero", "foodImages", index, "src"], await fileToDataUrl(file));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-black/5 bg-white/82 p-6 shadow-[0_20px_60px_rgba(42,30,21,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-[-0.04em]">Menu editor</h2>
                <p className="mt-2 text-sm font-semibold text-cedar/60">Choose a category, edit its title and items, then save.</p>
              </div>
              <button
                onClick={() => {
                  const category = `New Category ${content.menu.length + 1}`;
                  setContent((current) => ({ ...current, menu: [...current.menu, { category, intro: "", items: [] }] }));
                  setActiveCategory(category);
                }}
                className="rounded-full bg-[#15120f] px-5 py-3 text-sm font-extrabold text-white"
              >
                Add category
              </button>
            </div>

            <div className="yy-no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-2">
              {content.menu.map((group) => (
                <button
                  key={group.category}
                  onClick={() => setActiveCategory(group.category)}
                  className={`h-12 shrink-0 rounded-full px-5 text-sm font-extrabold ${group.category === activeCategory ? "bg-[#15120f] text-white" : "bg-[#f7f2ea] text-cedar"}`}
                >
                  {group.category}
                </button>
              ))}
            </div>

            {activeGroup && (
              <div className="mt-5 rounded-[1.5rem] bg-[#f7f2ea] p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Category name" value={activeGroup.category} onChange={(value) => updateActiveGroup("category", value)} />
                  <TextArea label="Category intro" value={activeGroup.intro} onChange={(value) => updateActiveGroup("intro", value)} />
                </div>
                <div className="mt-5 grid gap-4">
                  {activeGroup.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="grid gap-3 rounded-2xl bg-white p-4 md:grid-cols-[1fr_120px_130px_auto]">
                      <Field label="Item" value={item.name} onChange={(value) => updateItem(itemIndex, "name", value)} />
                      <Field label="Price" value={item.price} onChange={(value) => updateItem(itemIndex, "price", value)} />
                      <label className="block">
                        <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-cedar/50">Type</span>
                        <select
                          value={item.type}
                          onChange={(event) => updateItem(itemIndex, "type", event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#15120f]"
                        >
                          <option value="veg">Veg</option>
                          <option value="nonveg">Non-Veg</option>
                        </select>
                      </label>
                      <button
                        onClick={() => {
                          setContent((current) => {
                            const next = clone(current);
                            next.menu[activeIndex].items.splice(itemIndex, 1);
                            return next;
                          });
                        }}
                        className="self-end rounded-full bg-red-50 px-4 py-3 text-sm font-extrabold text-red-600"
                      >
                        Delete
                      </button>
                      <div className="md:col-span-4">
                        <TextArea label="Description" value={item.note} onChange={(value) => updateItem(itemIndex, "note", value)} />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setContent((current) => {
                      const next = clone(current);
                      next.menu[activeIndex].items.push({ name: "New item", price: "₹0", type: "veg", note: "" });
                      return next;
                    });
                  }}
                  className="mt-5 rounded-full bg-[#15120f] px-5 py-3 text-sm font-extrabold text-white"
                >
                  Add item
                </button>
              </div>
            )}
          </section>

          <section className="mt-6 rounded-[2rem] border border-black/5 bg-white/82 p-6 shadow-[0_20px_60px_rgba(42,30,21,0.08)] backdrop-blur">
            <h2 className="text-2xl font-extrabold tracking-[-0.04em]">Import / export backup</h2>
            <textarea
              value={importValue}
              onChange={(event) => setImportValue(event.target.value)}
              rows={8}
              className="mt-5 w-full rounded-2xl border border-black/10 bg-[#f7f2ea] p-4 font-mono text-xs outline-none focus:border-ember"
              placeholder="Paste exported JSON here to import, or click Export to copy current content."
            />
            <button onClick={importJson} className="mt-4 rounded-full bg-[#15120f] px-5 py-3 text-sm font-extrabold text-white">
              Import and save
            </button>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}
