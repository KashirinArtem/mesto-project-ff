import "../pages/index.css";
import {
  createCard,
  handlerErrorLoadImage,
  handlerLike,
  handlerModalPicture,
  handlerRemoveCard,
} from "./card";
import { closeModal, openModal } from "./modal";
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

const validationConfig = [
  {
    form: popupTypeEditForm,
    inputs: [inputDescription, inputName],
    submitBtn: btnTypeEditSubmit,
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    inputSuccessClass: "popup__input_type_success",
  },
  {
    form: popupTypeNewCardForm,
    inputs: [inputPlaceName, inputUrl],
    submitBtn: btnTypeNewCardSubmit,
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    inputSuccessClass: "popup__input_type_success",
  },
  {
    form: popupTypeProfileForm,
    inputs: [popupTypeProfileLink],
    submitBtn: popupTypeProfileSubmit,
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    inputSuccessClass: "popup__input_type_success",
  },
];

const clearValidationConfig = {
  editProfile: {
    inputs: validationConfig[0].inputs,
    removeClassNames: [
      validationConfig[0].inputErrorClass,
      validationConfig[0].inputSuccessClass,
    ],
  },
  newPlace: {
    inputs: validationConfig[1].inputs,
    removeClassNames: [
      validationConfig[1].inputErrorClass,
      validationConfig[1].inputSuccessClass,
    ],
  },
  avatarProfile: {
    inputs: validationConfig[2].inputs,
    removeClassNames: [
      validationConfig[2].inputErrorClass,
      validationConfig[2].inputSuccessClass,
    ],
  },
};

function onModalPicture(e, data) {
  e.stopPropagation();

  if (isEqual(e)) {
    handlerModalPicture(data, {
      img: popupTypeImageImg,
      caption: popupTypeImageCaption,
    });

    openModal(popupTypeImage);
  }
}

function onRemoveCard(e, callbackFn) {
  e.stopPropagation();

  const remove = () => {
    const card = e.target.closest(".card");

    deleteCard(card.id)
      .then(() => {
        closeModal(popupConfirmDelete);

        handlerRemoveCard(card);

        const deleteBtn = card.querySelector(".card__delete-button"),
          likeBtn = card.querySelector(".card__like-button"),
          cardImg = card.querySelector(".card__image");

        deleteBtn.removeEventListener("click", onRemoveCard);
        likeBtn.removeEventListener("click", onLikeCard);
        cardImg.removeEventListener("click", onModalPicture);
        popupConfirmOk.removeEventListener("click", remove);
      })
      .catch(console.log);
  };

  if (isEqual(e)) {
    openModal(popupConfirmDelete);

    popupConfirmOk.addEventListener("click", remove);
  }
}

function onLikeCard(e) {
  e.stopPropagation();

  if (!isEqual(e)) return;

  const card = e.currentTarget.closest(".card"),
    id = card.id,
    likeBtn = e.currentTarget,
    likeCount = card.querySelector(".card__like-count"),
    className = "card__like-button_is-active";

  if (!likeBtn.classList.contains(className)) {
    putLike(id)
      .then(({ likes }) => {
        handlerLike(likeBtn, likeCount, likes, className, true);
      })
      .catch(console.log);
  } else {
    deleteLike(id)
      .then(({ likes }) => {
        handlerLike(likeBtn, likeCount, likes, className, false);
      })
      .catch(console.log);
  }
}

function setProfile(user) {
  const { name, about, _id, avatar } = user;

  profileTitle.textContent = name;
  profileDescription.textContent = about;
  profileImage.style.backgroundImage = `url(${avatar})`;

  if (!userId) userId = _id;
}

function onErrorLoadImage(imgElement, callbackFn) {
  const errorImg =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQppJKxBxJI-9UWLe2VVmzuBd24zsq4_ihxZw&s";

  imgElement.onerror = () => {
    handlerErrorLoadImage(imgElement, errorImg);

    callbackFn();
  };
}

function renderCards(cardsList) {
  cardsList.forEach((cardData) => {
    placesList.append(
      createCard({
        data: cardData,
        templateCard,
        userId,
        onRemoveCard,
        // Единственное место, где могу получить data для handlerModalPicture
        onModalPicture: (e) => onModalPicture(e, cardData),
        onLikeCard,
        onErrorLoadImage,
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

// btn

profileEditBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModal(popupTypeEdit);

    inputName.value = profileTitle.textContent;
    inputDescription.value = profileDescription.textContent;

    clearValidation(clearValidationConfig.editProfile);
  }
});

profileAddBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModal(popupTypeNewCard);

    popupTypeNewCardForm.reset();

    clearValidation(clearValidationConfig.newPlace);
  }
});

profileAddImageBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isEqual(e)) {
    openModal(popupTypeProfile);

    popupTypeProfileForm.reset();

    clearValidation(clearValidationConfig.avatarProfile);
  }
});

// form

popupTypeEditForm.addEventListener("submit", (e) => {
  e.preventDefault();

  e.stopPropagation();

  loadingContent(true, btnTypeEditSubmit);

  patchUser({ name: inputName.value, about: inputDescription.value })
    .then((result) => {
      loadingContent(false, btnTypeEditSubmit);

      setProfile(result);

      closeModal(popupTypeEdit);

      clearValidation(clearValidationConfig.editProfile);
    })
    .catch(console.log);
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
        onModalPicture: (e) => onModalPicture(e, card),
        onLikeCard,
        userId,
        onErrorLoadImage,
      });

      placesList.insertAdjacentElement("afterbegin", card);

      closeModal(popupTypeNewCard);

      clearValidation(clearValidationConfig.newPlace);
    })
    .catch(console.log);
});

popupTypeProfileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  e.stopPropagation();

  loadingContent(true, popupTypeProfileSubmit);

  setAvatar(popupTypeProfileLink.value)
    .then(({ avatar }) => {
      loadingContent(false, popupTypeProfileSubmit);

      profileImage.style.backgroundImage = `url(${avatar})`;

      closeModal(popupTypeProfile);

      clearValidation(clearValidationConfig.avatarProfile);
    })
    .catch(console.log);
});

// popup

popupTypeImageClose.addEventListener("click", (e) =>
  closeModal(popupTypeImage)
);

popupConfirmClose.addEventListener("click", (e) =>
  closeModal(popupConfirmClose)
);

popupTypeEditClose.addEventListener("click", (e) => closeModal(popupTypeEdit));

popupTypeNewCardClose.addEventListener("click", (e) =>
  closeModal(popupTypeNewCard)
);

popupTypeProfileClose.addEventListener("click", (e) =>
  closeModal(popupTypeProfile)
);

// рыба - https://i.pinimg.com/originals/5b/6e/ca/5b6eca63605bea0eeb48db43f77fa0ce.jpg

enableValidation(validationConfig);
