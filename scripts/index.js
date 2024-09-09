// @todo: Темплейт карточки
const TEMPLATE = "#card-template",
  CARD = ".card",
  CARD_IMAGE = ".card__image",
  CARD_TITLE = ".card__title",
  DELETE_BTN = ".card__delete-button",
  LIST = ".places__list";

const templateCard = document.querySelector(TEMPLATE).content,
  placesList = document.querySelector(LIST);

// @todo: DOM узлы

// @todo: Функция создания карточки
const createCard = ({ name, alt, link }) => {
  const cardClone = templateCard.cloneNode(true),
    card = cardClone.querySelector(CARD),
    cardImg = card.querySelector(CARD_IMAGE),
    cardTitle = card.querySelector(CARD_TITLE),
    deleteBtn = card.querySelector(DELETE_BTN);

  cardImg.src = link;
  cardImg.alt = alt;
  cardTitle.textContent = name;

  deleteBtn.addEventListener("click", () => {
    removeCard(card);
  });

  return card;
};

// @todo: Функция удаления карточки
const removeCard = (card) => {
  card.remove();
};

// @todo: Вывести карточки на страницу
initialCards.forEach((card) => {
  placesList.append(createCard(card));
});
