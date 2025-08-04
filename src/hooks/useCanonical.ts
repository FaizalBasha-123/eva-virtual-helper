
import { useEffect } from "react";

export function useCanonical(path?: string) {
  useEffect(() => {
    const canonicalLink = document.querySelector("link[rel='canonical']");
    const url = path
      ? `${window.location.origin}${path}`
      : window.location.href;

    if (canonicalLink) {
      canonicalLink.setAttribute("href", url);
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", url);
      document.head.appendChild(link);
    }
  }, [path]);
}
