import { isEqual } from "./isEqual";

let closeConfig = null;

function openModal(popup, configForClose = null) {
  popup.classList.add("popup_is-opened");

  if (configForClose) {
    closeConfig = configForClose;

    const { triggers } = closeConfig;

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", closeModal);
    });
  }

  document.addEventListener("keydown", closeModal);
}

function closeModal(e = null) {
  e?.stopPropagation?.();

  const { target, classRemove, triggers } = closeConfig;

  if (isEqual(e) || e?.key === "Escape" || !e) {
    classRemove.forEach((cl) => {
      target.classList.remove(cl);
    });

    triggers.forEach((trigger) => {
      trigger.removeEventListener("click", closeModal);
    });

    document.removeEventListener("keydown", closeModal);

    closeConfig = null;
  }
}

export { openModal, closeModal };
