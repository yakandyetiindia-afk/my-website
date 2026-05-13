"use client";

import { useEffect, useState } from "react";
import { CONTENT_STORAGE_KEY, defaultContent, mergeContent } from "@/lib/content";

export function useEditableContent() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONTENT_STORAGE_KEY);
      if (stored) setContent(mergeContent(JSON.parse(stored)));
    } catch {
      setContent(defaultContent);
    }
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
