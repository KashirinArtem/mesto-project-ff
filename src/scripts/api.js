const token = "499d2508-6d5c-4b1a-b3b3-c40413fe95f5",
  baseUrl = "https://nomoreparties.co/v1/wff-cohort-25/",
  headers = {
    authorization: token,
    "Content-Type": "application/json",
  };

function getResponse(response) {
  return response.ok
    ? response.json()
    : Promise.reject(`Error: ${response.status}`);
}

function getCards() {
  return fetch(baseUrl + "cards", { headers }).then(getResponse);
}

function getUser() {
  return fetch(baseUrl + "users/me", { headers }).then(getResponse);
}

function patchUser(userInfo) {
  return fetch(baseUrl + "users/me", {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      name: userInfo.name,
      about: userInfo.about,
    }),
  }).then(getResponse);
}

function getCardsAndUser() {
  return Promise.all([getUser(), getCards()]);
}

function postNewCard(cardInfo) {
  return fetch(baseUrl + "cards", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: cardInfo.name,
      link: cardInfo.link,
    }),
  }).then(getResponse);
}

function deleteCard(cardId) {
  return fetch(baseUrl + "cards/" + cardId, {
    method: "DELETE",
    headers,
  }).then(getResponse);
}

function putLike(cardId) {
  return fetch(baseUrl + "cards/likes/" + cardId, {
    method: "PUT",
    headers,
  }).then(getResponse);
}

function deleteLike(cardId) {
  return fetch(baseUrl + "cards/likes/" + cardId, {
    method: "DELETE",
    headers,
  }).then(getResponse);
}

function setAvatar(avatar) {
  return fetch(baseUrl + "users/me/avatar", {
    method: "PATCH",
    headers,
    body: JSON.stringify({ avatar }),
  }).then(getResponse);
}

export {
  getCardsAndUser,
  patchUser,
  postNewCard,
  deleteCard,
  putLike,
  deleteLike,
  setAvatar,
};
