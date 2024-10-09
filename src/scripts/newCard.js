import {
  PROFILE_ADD_BTN,
  POPUP_TYPE_NEW_CARD,
  POPUP_ClOSE,
  POPUP_IS_OPENED,
  NEW_CARD_FORM_NAME,
  INPUT_TYPE_CARD_NAME,
  INPUT_TYPE_URL,
  POPUP_FORM,
} from "./const";
import { formNewCardHandler } from "./formHandler";
import { closeModal, openModal } from "./modal";
import { searchingElementInDOM } from "./searchElement";

const profileAddBtn = searchingElementInDOM(PROFILE_ADD_BTN),
  overlay = searchingElementInDOM(POPUP_TYPE_NEW_CARD),
  closeBtn = searchingElementInDOM(POPUP_ClOSE, overlay),
  form = searchingElementInDOM(POPUP_FORM, overlay),
  placeName = searchingElementInDOM(INPUT_TYPE_CARD_NAME, form),
  link = searchingElementInDOM(INPUT_TYPE_URL, form);

profileAddBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  openModal(overlay, [POPUP_IS_OPENED], {
    modal: overlay,
    classRemove: [POPUP_IS_OPENED],
    listeners: [overlay, closeBtn],
    isDocumentSetListener: true,
    documentTypeEvent: "keydown",
  });

  overlay.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", closeModal);

  form.addEventListener("submit", formNewCardHandler);
});

export { overlay, placeName, link };
