import { isEqual } from "./isEqual";

function createCard(configCard) {
  const {
    data,
    templateCard,
    onRemoveCard,
    onModalPicture,
    userId,
    cardLikeApi,
  } = configCard;

  const { likes, link, name, _id, owner } = data;

  const cardClone = templateCard.cloneNode(true),
    card = cardClone.querySelector(".card"),
    cardImg = card.querySelector(".card__image"),
    cardTitle = card.querySelector(".card__title"),
    deleteBtn = card.querySelector(".card__delete-button"),
    likeBtn = card.querySelector(".card__like-button"),
    likeCount = card.querySelector(".card__like-count");

  card.id = _id;

  cardImg.src = link;
  cardImg.alt = cardTitle.textContent = name;
  likeCount.textContent = likes.length;

  const handlerRemoveCard = (e) => {
    onRemoveCard(e, () => {
      likeBtn.removeEventListener("click", handlerLike);
      cardImg.removeEventListener("click", handlerModalPicture);
      deleteBtn.removeEventListener("click", handlerRemoveCard);

      card.remove();
    });
  };

  const handlerModalPicture = (e) => {
    e.stopPropagation();

    isEqual(e) && onModalPicture(e, data);
  };

  const handlerLike = (e) => {
    e.stopPropagation();

    if (!isEqual(e)) return;

    const { classList } = e.currentTarget,
      [putLike, deleteLike] = cardLikeApi,
      className = "card__like-button_is-active";

    const hasClass = classList.contains(className);

    if (!hasClass) {
      putLike(_id)
        .then(({ likes }) => {
          likeCount.textContent = likes.length;

          classList.add(className);
        })
        .catch(console.log);
    } else {
      deleteLike(_id)
        .then(({ likes }) => {
          likeCount.textContent = likes.length;

          classList.remove(className);
        })
        .catch(console.log);
    }
  };

  const setActiveLike = (ownerLike) => {
    if (ownerLike._id === userId)
      likeBtn.classList.add("card__like-button_is-active");
  };

  if (owner._id === userId)
    deleteBtn.addEventListener("click", handlerRemoveCard);
  else deleteBtn.style.display = "none";

  likes.forEach(setActiveLike);

  likeBtn.addEventListener("click", handlerLike);

  cardImg.addEventListener("click", handlerModalPicture);

  return card;
}

export { createCard };
