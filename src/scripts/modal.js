import { isEqual } from "./isEqual";

function openModal(popupElement) {
  popupElement.classList.add("popup_is-opened");

  popupElement.addEventListener("click", closeByOverlayClick);

  document.addEventListener("keydown", closeByEsc);
}

function closeModal(popupElement) {
  popupElement.classList.remove("popup_is-opened");

  popupElement.removeEventListener("click", closeByOverlayClick);

  document.removeEventListener("keydown", closeByEsc);
}

function closeByOverlayClick(e) {
  e.stopPropagation();

  if (!isEqual(e)) return;

  closeModal(e.currentTarget);
}

function closeByEsc(e) {
  if (e.key === "Escape") {
    closeModal(document.querySelector(".popup_is-opened"));
  }
}

export { openModal, closeModal, closeByOverlayClick };
