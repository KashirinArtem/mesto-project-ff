import { isEqual } from "./isEqual";

function createCard(configCard) {
  const { data, templateCard, removeCard, likeCard, popupConfig, openModal } =
    configCard;

  const cardClone = templateCard.cloneNode(true),
    card = cardClone.querySelector(".card"),
    cardImg = card.querySelector(".card__image"),
    cardTitle = card.querySelector(".card__title"),
    deleteBtn = card.querySelector(".card__delete-button"),
    likeBtn = card.querySelector(".card__like-button");

  const { name, alt, link } = data;

  const { popup, closeBtn, image, caption } = popupConfig;

  cardImg.src = link;
  cardImg.alt = alt;
  cardTitle.textContent = name;

  deleteBtn.addEventListener("click", removeCard);

  likeBtn.addEventListener("click", likeCard);

  cardImg.addEventListener("click", (e) => {
    e.stopPropagation();

    if (isEqual(e)) {
      openModal(popup, {
        target: popup,
        triggers: [popup, closeBtn],
        classRemove: ["popup_is-opened"],
      });

      image.src = link;
      image.alt = alt;
      caption.textContent = name;
    }
  });

  return card;
}

export { createCard };
