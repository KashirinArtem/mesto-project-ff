import { placesList } from ".";
import { createCard } from "./card";
import { POPUP_IS_OPENED } from "./const";
import { closeModal } from "./modal";
import { overlay as overlayNewCard, placeName, link } from "./newCard";
import {
  profileTitle,
  profileDescription,
  name,
  description,
  overlay as overlayProfile,
} from "./profile";

function formProfileHandler(e) {
  e.preventDefault();

  if (e.target === e.currentTarget) {
    profileTitle.textContent = name.value;
    profileDescription.textContent = description.value;

    e.target.reset();
    e.target.removeEventListener("submit", formProfileHandler);

    closeModal(e, [POPUP_IS_OPENED], overlayProfile);
  }
}

function formNewCardHandler(e) {
  e.preventDefault();

  if (e.target === e.currentTarget) {
    placesList.insertAdjacentElement(
      "afterbegin",
      createCard({
        name: placeName.value,
        alt: placeName.value,
        link: link.value,
      })
    );
  }

  e.target.reset();
  e.target.removeEventListener("submit", formProfileHandler);

  closeModal(e, [POPUP_IS_OPENED], overlayNewCard);
}

export { formProfileHandler, formNewCardHandler };
