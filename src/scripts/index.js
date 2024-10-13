import "../pages/index.css";
import { initialCards as cardsData } from "./cards";
import { createCard } from "./card";
import { openModal } from "./modal";
import { removeCard } from "./removeCardHandler";
import { likeCard } from "./likeCardHandler";
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
    popup: popupTypeImage,
    closeBtn: popupTypeImageClose,
    image: popupTypeImageImg,
    caption: popupTypeImageCaption,
  };

const popupTypeNewCard = document.querySelector(".popup_type_new-card"),
  popupTypeNewCardClose = popupTypeNewCard.querySelector(".popup__close");

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
      likeCard,
      popupConfig: popupTypeImageConfig,
      openModal,
    })
  );
});

profileEditBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModal(popupTypeEdit, {
      target: popupTypeEdit,
      triggers: [popupTypeEdit, popupTypeEditClose],
      classRemove: ["popup_is-opened"],
    });

    inputName.value = profileTitle.textContent;
    inputDescription.value = profileDescription.textContent;
  }
});

profileAddBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModal(popupTypeNewCard, {
      target: popupTypeNewCard,
      triggers: [popupTypeNewCard, popupTypeNewCardClose],
      classRemove: ["popup_is-opened"],
    });
  }
});

document.addEventListener("submit", (e) => {
  e.preventDefault();

  e.stopPropagation();

  const attributeValue = e.target.getAttribute("name");

  switch (attributeValue) {
    case "edit-profile": {
      const { name, description } = handlerForm(e.target, [
        "name",
        "description",
      ]);

      profileTitle.textContent = name;
      profileDescription.textContent = description;

      break;
    }
    case "new-place": {
      const place = handlerForm(e.target, ["place-name", "link"]);

      const card = createCard({
        data: {
          name: place["place-name"],
          link: place.link,
          alt: place["place-name"],
        },
        templateCard,
        removeCard,
        likeCard,
        openModal,
        popupConfig: popupTypeImageConfig,
      });

      placesList.insertAdjacentElement("afterbegin", card);

      break;
    }
    default: {
      console.log("Something else");
    }
  }
});

// https://i.pinimg.com/originals/5b/6e/ca/5b6eca63605bea0eeb48db43f77fa0ce.jpg
