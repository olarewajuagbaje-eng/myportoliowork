import DOMPurify from "dompurify";

/**
 * Sanitize rich-text HTML (blog bodies) before rendering.
 * Blocks script/style injection, event handlers and javascript: URLs
 * while preserving the formatting the editor produces.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html ?? "", {
    ALLOWED_TAGS: [
      "p", "br", "hr", "strong", "em", "u", "s", "code", "pre", "blockquote",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td", "span", "div", "iframe",
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "src", "alt", "title", "width", "height",
      "class", "colspan", "rowspan", "style", "allow", "allowfullscreen", "frameborder",
    ],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|data:image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,|#|\/)/i,
    FORBID_TAGS: ["script", "object", "embed", "form", "input", "link", "meta"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "formaction"],
  });
}

/** Strip all HTML — used for plain-text surfaces such as comments. */
export function stripHtml(text: string): string {
  return DOMPurify.sanitize(text ?? "", { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
