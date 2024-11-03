const token = "499d2508-6d5c-4b1a-b3b3-c40413fe95f5",
  baseUrl = "https://nomoreparties.co/v1/wff-cohort-25/",
  headers = {
    authorization: token,
    "Content-Type": "application/json",
  };

function getResponse(response, method) {
  return response.ok
    ? response.json()
    : Promise.reject(`Error: ${response.status}. Method: ${method}`);
}

function getCards() {
  return fetch(baseUrl + "cards", { headers }).then((res) =>
    getResponse(res, "getCards")
  );
}

function getUser() {
  return fetch(baseUrl + "users/me", { headers }).then((res) =>
    getResponse(res, "getUser")
  );
}

function patchUser(userInfo) {
  return fetch(baseUrl + "users/me", {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      name: userInfo.name,
      about: userInfo.about,
    }),
  }).then((res) => getResponse(res, "patchUser"));
}

function getInitialData() {
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
  }).then((res) => getResponse(res, "postNewCard"));
}

function deleteCard(cardId) {
  return fetch(baseUrl + "cards/" + cardId, {
    method: "DELETE",
    headers,
  }).then((res) => getResponse(res, "deleteCard"));
}

function putLike(cardId) {
  return fetch(baseUrl + "cards/likes/" + cardId, {
    method: "PUT",
    headers,
  }).then((res) => getResponse(res, "putLike"));
}

function deleteLike(cardId) {
  return fetch(baseUrl + "cards/likes/" + cardId, {
    method: "DELETE",
    headers,
  }).then((res) => getResponse(res, "deleteLike"));
}

function setAvatar(avatar) {
  return fetch(baseUrl + "users/me/avatar", {
    method: "PATCH",
    headers,
    body: JSON.stringify({ avatar }),
  }).then((res) => getResponse(res, "setAvatar"));
}

export {
  getInitialData,
  patchUser,
  postNewCard,
  deleteCard,
  putLike,
  deleteLike,
  setAvatar,
};
