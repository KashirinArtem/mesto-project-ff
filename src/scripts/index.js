import "../pages/index.css";
import { initialCards as cardsData } from "./cards";
import { createCard } from "./card";
import { openModal } from "./modal";
import { removeCard } from "./removeCardHandler";
import { handlerForm } from "./formHandler";
import { isEqual } from "./isEqual";

const templateCard = document.querySelector("#card-template").content;

const placesList = document.querySelector(".places__list");

const profile = document.querySelector(".profile"),
  profileEditBtn = profile.querySelector(".profile__edit-button"),
  profileTitle = profile.querySelector(".profile__title"),
  profileDescription = profile.querySelector(".profile__description"),
  profileAddBtn = profile.querySelector(".profile__add-button");

const popupTypeImage = document.querySelector(".popup_type_image"),
  popupTypeImageClose = popupTypeImage.querySelector(".popup__close"),
  popupTypeImageImg = popupTypeImage.querySelector(".popup__image"),
  popupTypeImageCaption = popupTypeImage.querySelector(".popup__caption"),
  popupTypeImageConfig = {
    image: popupTypeImageImg,
    caption: popupTypeImageCaption,
  };

const openModalPopupTypeImage = openModal(popupTypeImageConfig.popup, {
  target: popupTypeImageConfig.popup,
  triggers: [popupTypeImageConfig.popup, popupTypeImageConfig.closeBtn],
  classRemove: ["popup_is-opened"],
});

const openModalTypeNewCard = openModal(popupTypeNewCard, {
  target: popupTypeNewCard,
  triggers: [popupTypeNewCard, popupTypeNewCardClose],
  classRemove: ["popup_is-opened"],
});

const openModalTypeEdit = openModal(popupTypeEdit, {
  target: popupTypeEdit,
  triggers: [popupTypeEdit, popupTypeEditClose],
  classRemove: ["popup_is-opened"],
});

const popupTypeNewCard = document.querySelector(".popup_type_new-card"),
  popupTypeNewCardClose = popupTypeNewCard.querySelector(".popup__close"),
  popupTypeNewCardForm = popupTypeNewCard.querySelector(".popup__form");

const popupTypeEdit = document.querySelector(".popup_type_edit"),
  popupTypeEditClose = popupTypeEdit.querySelector(".popup__close"),
  popupTypeEditForm = popupTypeEdit.querySelector(".popup__form"),
  inputDescription = popupTypeEditForm.querySelector(
    ".popup__input_type_description"
  ),
  inputName = popupTypeEditForm.querySelector(".popup__input_type_name");

cardsData.forEach((item) => {
  placesList.append(
    createCard({
      data: item,
      templateCard,
      removeCard,
      popupConfig: popupTypeImageConfig,
      openModal: openModalPopupTypeImage,
    })
  );
});

profileEditBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModalTypeEdit();

    inputName.value = profileTitle.textContent;
    inputDescription.value = profileDescription.textContent;
  }
});

profileAddBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModalTypeNewCard();
  }
});

popupTypeEditForm.addEventListener("submit", (e) => {
  e.preventDefault();

  e.stopPropagation();

  const { name, description } = handlerForm(e.target, ["name", "description"]);

  profileTitle.textContent = name;
  profileDescription.textContent = description;
});

popupTypeNewCardForm.addEventListener("submit", (e) => {
  e.preventDefault();

  e.stopPropagation();

  const place = handlerForm(e.target, ["place-name", "link"]);

  const card = createCard({
    data: {
      name: place["place-name"],
      link: place.link,
      alt: place["place-name"],
    },
    templateCard,
    removeCard,
    openModal: openModalPopupTypeImage,
    popupConfig: popupTypeImageConfig,
  });

  placesList.insertAdjacentElement("afterbegin", card);
});

// https://i.pinimg.com/originals/5b/6e/ca/5b6eca63605bea0eeb48db43f77fa0ce.jpg
