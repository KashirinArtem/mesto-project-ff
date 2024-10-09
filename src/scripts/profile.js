import { searchingElementInDOM } from "./searchElement";
import {
  PROFILE_TITLE,
  PROFILE_DESCRIPTION,
  PROFILE_EDIT_BTN,
  POPUP_TYPE_EDIT,
  POPUP_IS_OPENED,
  POPUP_ClOSE,
  FORM_EDIT_PROFILE_NAME,
  FORM_EDIT_PROFILE_DESCRIPTION,
  POPUP_FORM,
} from "./const";
import { openModal, closeModal } from "./modal";
import { formProfileHandler } from "./formHandler";

const profileTitle = searchingElementInDOM(PROFILE_TITLE),
  profileDescription = searchingElementInDOM(PROFILE_DESCRIPTION),
  overlay = searchingElementInDOM(POPUP_TYPE_EDIT),
  closeBtn = searchingElementInDOM(POPUP_ClOSE, overlay),
  profileBtn = searchingElementInDOM(PROFILE_EDIT_BTN),
  form = searchingElementInDOM(POPUP_FORM, overlay),
  name = searchingElementInDOM(FORM_EDIT_PROFILE_NAME, form),
  description = searchingElementInDOM(FORM_EDIT_PROFILE_DESCRIPTION, form);

profileBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  /*
хочу удалять обработчики с overlay, closeBtn и document после закрытия модального окна,
поэтому в openModal есть опциональный параметр configForClose

* */
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

  name.value = profileTitle.textContent;
  description.value = profileDescription.textContent;

  form.addEventListener("submit", formProfileHandler);
});

export { profileTitle, profileDescription, name, description, overlay };
