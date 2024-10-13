import { isEqual } from "./isEqual";

function likeCard(e) {
  e.stopPropagation();

  if (isEqual(e)) e.target.classList.toggle("card__like-button_is-active");
}

export { likeCard };
