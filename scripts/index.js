// @todo: Темплейт карточки
const TEMPLATE = "#card-template",
  CARD_IMAGE = ".card__image",
  CARD_TITLE = ".card__title",
  DELETE_BTN = "card__delete-button",
  LIST = ".places__list";

const templateCard = document.querySelector(TEMPLATE).content,
  placesList = document.querySelector(LIST);

// @todo: DOM узлы

// @todo: Функция создания карточки
const createCard = (name, link) => {
  const cardClone = templateCard.cloneNode(true),
    cardImg = cardClone.querySelector(CARD_IMAGE),
    cardTitle = cardClone.querySelector(CARD_TITLE);

  cardImg.src = link;
  cardTitle.textContent = name;

  return cardClone;
};

// @todo: Функция удаления карточки
const removeCard = (event) => {
  const target = event.target,
    parentNode = target.parentNode;

  [...target.classList].includes(DELETE_BTN) && parentNode.remove();
};

placesList.addEventListener("click", removeCard);

// @todo: Вывести карточки на страницу
initialCards.forEach(({ name, link }) => {
  placesList.append(createCard(name, link));
});
