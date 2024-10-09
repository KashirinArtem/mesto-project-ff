import { searchingElementInDOM } from "./searchElement";
import {
  TEMPLATE,
  CARD,
  CARD_IMAGE,
  CARD_TITLE,
  DELETE_BTN,
  POPUP_TYPE_IMAGE,
  POPUP_CAPTION,
  POPUP_IMAGE,
  POPUP_IS_OPENED,
  POPUP_ClOSE,
  CARD_LIKE_BTN,
  LIKE_BTN_IS_ACTIVE,
} from "./const";
import { openModal, closeModal } from "./modal";

const templateCard = searchingElementInDOM(TEMPLATE).content,
  overlay = searchingElementInDOM(POPUP_TYPE_IMAGE),
  closeBtn = searchingElementInDOM(POPUP_ClOSE, overlay),
  img = searchingElementInDOM(POPUP_IMAGE, overlay),
  caption = searchingElementInDOM(POPUP_CAPTION, overlay);

const createCard = ({ name, alt, link }) => {
  const cardClone = templateCard.cloneNode(true),
    card = searchingElementInDOM(CARD, cardClone),
    cardImg = searchingElementInDOM(CARD_IMAGE, card),
    cardTitle = searchingElementInDOM(CARD_TITLE, card),
    deleteBtn = searchingElementInDOM(DELETE_BTN, card),
    likeBtn = searchingElementInDOM(CARD_LIKE_BTN, card);

  cardImg.src = link;
  cardImg.alt = alt;
  cardTitle.textContent = name;

  deleteBtn.addEventListener("click", () => removeCard(card));

  cardImg.addEventListener("click", (e) => {
    e.stopPropagation();

    img.src = link;
    img.alt = alt;
    caption.textContent = name;

    openModal(overlay, [POPUP_IS_OPENED], {
      modal: overlay,
      classRemove: [POPUP_IS_OPENED],
      listeners: [overlay, closeBtn],
      isDocumentSetListener: true,
      documentTypeEvent: "keydown",
    });

    overlay.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", closeModal);
  });

  likeBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (e.target === e.currentTarget) {
      e.target.classList.toggle(LIKE_BTN_IS_ACTIVE);
    }
  });

  return card;
};

const removeCard = (card) => {
  card.remove();
};

export { createCard, removeCard };
