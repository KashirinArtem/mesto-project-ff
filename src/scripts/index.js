import "../pages/index.css";
import { createCard } from "./card";
import { closeByOverlayClick, closeModal, openModal } from "./modal";
import { isEqual } from "./isEqual";
import { clearValidation, enableValidation } from "./validation";
import {
  deleteCard,
  deleteLike,
  getInitialData,
  patchUser,
  postNewCard,
  putLike,
  setAvatar,
} from "./api.js";
import { loadingContent } from "./utils.js";

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
  popupTypeImageCaption = popupTypeImage.querySelector(".popup__caption");

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

function onModalPicture(e, { name, alt, link }) {
  popupTypeImageImg.src =
    popupTypeImageImg.alt =
    popupTypeImageCaption.textContent =
      "";

  e.stopPropagation();

  if (isEqual(e)) {
    popupTypeImageImg.src = link;
    popupTypeImageImg.alt = alt;
    popupTypeImageCaption.textContent = name;

    openModal(popupTypeImage);

    popupTypeImage.addEventListener("click", closeByOverlayClick);
    popupTypeImageClose.addEventListener("click", (e) =>
      closeModal(popupTypeImage)
    );
  }
}

function onRemoveCard(e, callbackFn) {
  e.stopPropagation();

  const remove = () => {
    deleteCard(e.target.closest(".card").id).catch(console.log);

    callbackFn();

    closeModal(popupConfirmDelete);
  };

  if (isEqual(e)) {
    openModal(popupConfirmDelete);

    popupConfirmDelete.addEventListener("click", closeByOverlayClick);
    popupConfirmClose.addEventListener("click", (e) => closeModal(e.target));

    popupConfirmOk.addEventListener("click", remove);
  }
}

function setProfile(user) {
  const { name, about, _id, avatar } = user;

  profileTitle.textContent = name;
  profileDescription.textContent = about;
  profileImage.style.backgroundImage = `url(${avatar})`;

  if (!userId) userId = _id;
}

function renderCards(cards) {
  cards.forEach((card) => {
    placesList.append(
      createCard({
        data: card,
        templateCard,
        onRemoveCard,
        onModalPicture,
        cardLikeApi: [putLike, deleteLike],
        userId,
      })
    );
  });
}

getInitialData()
  .then((result) => {
    const [user, cards] = result;

    setProfile(user);

    renderCards(cards);
  })
  .catch(console.log);

// -------------------------

profileEditBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModal(popupTypeEdit);

    inputName.value = profileTitle.textContent;
    inputDescription.value = profileDescription.textContent;

    popupTypeEdit.addEventListener("click", closeByOverlayClick);
    popupTypeEditClose.addEventListener("click", (e) =>
      closeModal(popupTypeEdit)
    );

    clearValidation(
      [inputDescription, inputName],
      ["popup__input_type_error", "popup__input_type_success"]
    );

    enableValidation({
      form: popupTypeEditForm,
      inputs: [inputDescription, inputName],
      submitBtn: btnTypeEditSubmit,
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

  patchUser({ name: inputName.value, about: inputDescription.value })
    .then((result) => {
      loadingContent(false, btnTypeEditSubmit);

      setProfile(result);
    })
    .catch(console.log);

  closeModal(popupTypeEdit);

  clearValidation(
    [inputDescription, inputName],
    ["popup__input_type_error", "popup__input_type_success"]
  );
});

// -----------------------

profileAddBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModal(popupTypeNewCard);

    popupTypeNewCardForm.reset();

    popupTypeNewCard.addEventListener("click", closeByOverlayClick);
    popupTypeNewCardClose.addEventListener("click", (e) =>
      closeModal(popupTypeNewCard)
    );

    clearValidation(
      [inputPlaceName, inputUrl],
      ["popup__input_type_error", "popup__input_type_success"]
    );

    enableValidation({
      form: popupTypeNewCardForm,
      inputs: [inputPlaceName, inputUrl],
      submitBtn: btnTypeNewCardSubmit,
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

  postNewCard({ name: inputPlaceName.value, link: inputUrl.value })
    .then((result) => {
      loadingContent(false, btnTypeNewCardSubmit);

      const card = createCard({
        data: result,
        templateCard,
        onRemoveCard,
        onModalPicture,
        cardLikeApi: [putLike, deleteLike],
        userId,
      });

      placesList.insertAdjacentElement("afterbegin", card);
    })
    .catch(console.log);

  popupTypeNewCardForm.reset();

  closeModal(popupTypeNewCard);

  clearValidation(
    [inputPlaceName, inputUrl],
    ["popup__input_type_error", "popup__input_type_success"]
  );
});

// ----------------------

profileAddImageBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModal(popupTypeProfile);

    popupTypeProfileForm.reset();

    popupTypeProfile.addEventListener("click", closeByOverlayClick);
    popupTypeProfileClose.addEventListener("click", (e) =>
      closeModal(popupTypeProfile)
    );

    clearValidation(
      [popupTypeProfileLink],
      ["popup__input_type_error", "popup__input_type_success"]
    );

    enableValidation({
      form: popupTypeProfileForm,
      inputs: [popupTypeProfileLink],
      submitBtn: popupTypeProfileSubmit,
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

  setAvatar(popupTypeProfileLink.value)
    .then(({ avatar }) => {
      loadingContent(false, popupTypeProfileSubmit);

      profileImage.style.backgroundImage = `url(${avatar})`;
    })
    .catch(console.log);

  popupTypeProfileForm.reset();

  closeModal(popupTypeProfile);

  clearValidation(
    [popupTypeProfileLink],
    ["popup__input_type_error", "popup__input_type_success"]
  );
});

// https://i.pinimg.com/originals/5b/6e/ca/5b6eca63605bea0eeb48db43f77fa0ce.jpg
