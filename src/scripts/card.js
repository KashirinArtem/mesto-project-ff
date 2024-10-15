import { isEqual } from "./isEqual";

function createCard(configCard) {
  const { data, templateCard, removeCard, openModal } = configCard;

  const cardClone = templateCard.cloneNode(true),
    card = cardClone.querySelector(".card"),
    cardImg = card.querySelector(".card__image"),
    cardTitle = card.querySelector(".card__title"),
    deleteBtn = card.querySelector(".card__delete-button"),
    likeBtn = card.querySelector(".card__like-button");

  const { name, alt, link } = data;

  cardImg.src = link;
  cardImg.alt = alt;
  cardTitle.textContent = name;

  deleteBtn.addEventListener("click", removeCard);

  likeBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (isEqual(e)) e.target.classList.toggle("card__like-button_is-active");
  });

  cardImg.addEventListener("click", (e) => openModal(e, data));

  return card;
}

export { createCard };
