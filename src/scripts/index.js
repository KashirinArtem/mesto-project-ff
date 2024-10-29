import "../pages/index.css";
import { createCard } from "./card";
import { closeModal, openModal } from "./modal";
import { removeCard } from "./removeCardHandler";
import { handlerForm } from "./formHandler";
import { isEqual } from "./isEqual";
import {
  enableValidation,
  handlerInputValidation,
  initialStateStyleInput,
} from "./validation";
import {
  deleteCard,
  deleteLike,
  getCardsAndUser,
  patchUser,
  postNewCard,
  putLike,
  setAvatar,
} from "./api.js";

const templateCard = document.querySelector("#card-template").content;

const placesList = document.querySelector(".places__list");

const profile = document.querySelector(".profile"),
  profileEditBtn = profile.querySelector(".profile__edit-button"),
  profileTitle = profile.querySelector(".profile__title"),
  profileDescription = profile.querySelector(".profile__description"),
  profileAddBtn = profile.querySelector(".profile__add-button"),
  profileImage = profile.querySelector(".profile__image"),
  profileAddImageBtn = profile.querySelector(".profile__add-image");

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
  popupTypeNewCardClose = popupTypeNewCard.querySelector(".popup__close"),
  popupTypeNewCardForm = popupTypeNewCard.querySelector(".popup__form"),
  inputPlaceName = popupTypeNewCardForm.querySelector(
    ".popup__input_type_card-name"
  ),
  inputUrl = popupTypeNewCardForm.querySelector(".popup__input_type_url"),
  btnTypeNewCardSubmit = popupTypeNewCardForm.querySelector(".popup__button");

const popupTypeEdit = document.querySelector(".popup_type_edit"),
  popupTypeEditClose = popupTypeEdit.querySelector(".popup__close"),
  popupTypeEditForm = popupTypeEdit.querySelector(".popup__form"),
  inputDescription = popupTypeEditForm.querySelector(
    ".popup__input_type_description"
  ),
  inputName = popupTypeEditForm.querySelector(".popup__input_type_name"),
  btnTypeEditSubmit = popupTypeEditForm.querySelector(".popup__button");

const popupTypeProfile = document.querySelector(".popup_type_profile"),
  popupTypeProfileClose = popupTypeProfile.querySelector(".popup__close"),
  popupTypeProfileForm = popupTypeProfile.querySelector(".popup__form"),
  popupTypeProfileLink = popupTypeProfileForm.querySelector(
    ".popup__input_type_profile"
  ),
  popupTypeProfileSubmit = popupTypeProfileForm.querySelector(".popup__button");

const popupConfirmDelete = document.querySelector(".popup_confirm_delete"),
  popupConfirmClose = popupConfirmDelete.querySelector(".popup__close"),
  popupConfirmOk = popupConfirmDelete.querySelector(".popup__button");

let userId = null;

function onModalPicture(e, data) {
  popupTypeImageConfig.image.src = "";
  popupTypeImageConfig.image.alt = "";
  popupTypeImageConfig.caption.textContent = "";

  e.stopPropagation();

  if (isEqual(e)) {
    const { name, alt, link } = data;

    popupTypeImageConfig.image.src = link;
    popupTypeImageConfig.image.alt = alt;
    popupTypeImageConfig.caption.textContent = name;

    openModal(popupTypeImageConfig.popup, {
      target: popupTypeImageConfig.popup,
      triggers: [popupTypeImageConfig.popup, popupTypeImageConfig.closeBtn],
      classRemove: ["popup_is-opened"],
    });
  }
}

function onRemoveCard(e) {
  e.stopPropagation();

  const remove = () => {
    closeModal();

    removeCard(e);

    deleteCard(e.target.closest(".card").id).catch(console.log);

    popupConfirmOk.removeEventListener("click", remove);
  };

  if (isEqual(e)) {
    openModal(popupConfirmDelete, {
      target: popupConfirmDelete,
      triggers: [popupConfirmDelete, popupConfirmClose],
      classRemove: ["popup_is-opened"],
    });

    popupConfirmOk.addEventListener("click", remove);
  }
}

function setProfile(user) {
  const { name, about, _id, avatar } = user;

  profileTitle.textContent = name;
  profileDescription.textContent = about;
  profileImage.style.backgroundImage = `url(${avatar})`;

  if (!userId) {
    userId = user._id;
  }
}

function renderCards(cards) {
  cards.forEach((card) => {
    placesList.append(
      createCard({
        data: card,
        templateCard,
        removeCard: onRemoveCard,
        openModal: onModalPicture,
        cardLikeApi: [putLike, deleteLike],
        userId,
      })
    );
  });
}

function loadingContent(isLoadingContent, btn) {
  btn.textContent = isLoadingContent ? "Сохранение..." : "Сохранить";
}

getCardsAndUser()
  .then((result) => {
    const [user, cards] = result;

    setProfile(user);

    renderCards(cards);
  })
  .catch(console.log);

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

    enableValidation({
      form: popupTypeEditForm,
      inputs: [inputDescription, inputName],
      submit: btnTypeEditSubmit,
      inactiveButtonClass: "popup__button_disabled",
      inputErrorClass: "popup__input_type_error",
      inputSuccessClass: "popup__input_type_success",
    });
  }
});

popupTypeEditForm.addEventListener("submit", (e) => {
  e.preventDefault();

  e.stopPropagation();

  loadingContent(true, btnTypeEditSubmit);

  const { name, description } = handlerForm(e.target, ["name", "description"]);

  patchUser({ name, about: description })
    .then((result) => {
      loadingContent(false, btnTypeEditSubmit);

      setProfile(result);
    })
    .catch(console.log);

  [inputDescription, inputName].forEach((input) => {
    input.removeEventListener("click", handlerInputValidation);
  });
});

profileAddBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModal(popupTypeNewCard, {
      target: popupTypeNewCard,
      triggers: [popupTypeNewCard, popupTypeNewCardClose],
      classRemove: ["popup_is-opened"],
    });

    popupTypeNewCardForm.reset();

    enableValidation({
      form: popupTypeNewCardForm,
      inputs: [inputPlaceName, inputUrl],
      submit: btnTypeNewCardSubmit,
      inactiveButtonClass: "popup__button_disabled",
      inputErrorClass: "popup__input_type_error",
      inputSuccessClass: "popup__input_type_success",
    });
  }
});

popupTypeNewCardForm.addEventListener("submit", (e) => {
  e.preventDefault();

  e.stopPropagation();

  loadingContent(true, btnTypeNewCardSubmit);

  const place = handlerForm(e.target, ["place-name", "link"]);

  postNewCard({ name: place["place-name"], link: place.link })
    .then((result) => {
      loadingContent(false, btnTypeNewCardSubmit);

      const card = createCard({
        data: result,
        templateCard,
        removeCard: onRemoveCard,
        openModal: onModalPicture,
        cardLikeApi: [putLike, deleteLike],
        userId,
      });

      placesList.insertAdjacentElement("afterbegin", card);
    })
    .catch(console.log);

  [inputPlaceName, inputUrl].forEach((input) => {
    input.removeEventListener("click", handlerInputValidation);
  });
});

profileAddImageBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModal(popupTypeProfile, {
      target: popupTypeProfile,
      triggers: [popupTypeProfile, popupTypeProfileClose],
      classRemove: ["popup_is-opened"],
    });

    enableValidation({
      form: popupTypeProfileForm,
      inputs: [popupTypeProfileLink],
      submit: popupTypeProfileSubmit,
      inactiveButtonClass: "popup__button_disabled",
      inputErrorClass: "popup__input_type_error",
      inputSuccessClass: "popup__input_type_success",
    });
  }
});

popupTypeProfileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  e.stopPropagation();

  loadingContent(true, popupTypeProfileSubmit);

  const { link } = handlerForm(e.target, ["link"]);

  popupTypeProfileLink.removeEventListener("click", handlerInputValidation);

  setAvatar(link)
    .then(({ avatar }) => {
      loadingContent(false, popupTypeProfileSubmit);

      profileImage.style.backgroundImage = `url(${avatar})`;
    })
    .catch(console.log);
});

// https://i.pinimg.com/originals/5b/6e/ca/5b6eca63605bea0eeb48db43f77fa0ce.jpg
