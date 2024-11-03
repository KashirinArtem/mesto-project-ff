function handlerRemoveCard(card) {
  card.remove();
}

function handlerLike(likeBtn, likeCount, likes, className, isContainsClass) {
  if (isContainsClass) {
    likeCount.textContent = likes.length;

    likeBtn.classList.add(className);
  } else {
    likeCount.textContent = likes.length;

    likeBtn.classList.remove(className);
  }
}

// Решил вынести из тела createCard
function handlerModalPicture({ link, name }, { img, caption }) {
  img.src = img.alt = caption.textContent = "";

  img.src = link;
  img.alt = caption.textContent = name;
}

function handlerErrorLoadImage(imgElement, link) {
  imgElement.src = link;

  imgElement.style.cursor = "not-allowed";
}
function createCard(configCard) {
  const {
    data,
    templateCard,
    userId,
    onRemoveCard,
    onModalPicture,
    onLikeCard,
    onErrorLoadImage,
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

  const setActiveLike = (ownerLike) => {
    if (ownerLike._id === userId)
      likeBtn.classList.add("card__like-button_is-active");
  };

  owner._id === userId
    ? deleteBtn.addEventListener("click", onRemoveCard)
    : (deleteBtn.style.display = "none");

  likes.forEach(setActiveLike);

  likeBtn.addEventListener("click", onLikeCard);

  cardImg.addEventListener("click", onModalPicture);

  onErrorLoadImage(cardImg, () => {
    cardImg.removeEventListener("click", onModalPicture);

    likeBtn.removeEventListener("click", onLikeCard);

    card.title = "Image not found!";

    likeBtn.style.cursor = "not-allowed";
    card.style.cursor = "not-allowed";
  });

  return card;
}

export {
  createCard,
  handlerRemoveCard,
  handlerLike,
  handlerModalPicture,
  handlerErrorLoadImage,
};
