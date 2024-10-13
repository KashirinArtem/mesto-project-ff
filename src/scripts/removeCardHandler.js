import { isEqual } from "./isEqual";

function removeCard(e) {
  e.stopPropagation();

  if (isEqual(e)) e.target.parentNode.remove();
}

export { removeCard };
