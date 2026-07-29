"use client";

import { useEffect, useState } from "react";
import { CONTENT_STORAGE_KEY, defaultContent, mergeContent } from "@/lib/content";

export function useEditableContent() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    function loadContent() {
      try {
        const stored = window.localStorage.getItem(CONTENT_STORAGE_KEY);
        setContent(stored ? mergeContent(JSON.parse(stored)) : defaultContent);
      } catch {
        setContent(defaultContent);
      }
    }

    loadContent();
    window.addEventListener("yak-yeti-content-updated", loadContent);
    window.addEventListener("storage", loadContent);

    return () => {
      window.removeEventListener("yak-yeti-content-updated", loadContent);
      window.removeEventListener("storage", loadContent);
    };
  }, []);

  return content;
}

export function saveEditableContent(content) {
  window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(mergeContent(content)));
  window.dispatchEvent(new Event("yak-yeti-content-updated"));
}

export function resetEditableContent() {
  window.localStorage.removeItem(CONTENT_STORAGE_KEY);
  window.dispatchEvent(new Event("yak-yeti-content-updated"));
}
