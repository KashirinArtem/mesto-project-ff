import { isEqual } from "./isEqual";

function removeCard(e) {
  e.target.closest(".card").remove();
}

export { removeCard };
