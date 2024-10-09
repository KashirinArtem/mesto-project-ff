export function searchingElementInDOM(selector, parentNode = null) {
  return parentNode
    ? parentNode.querySelector(selector)
    : document.querySelector(selector);
}
