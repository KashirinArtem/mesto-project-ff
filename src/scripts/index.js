import "../pages/index.css";
import { initialCards as cardsData } from "./cards";
import { searchingElementInDOM } from "./searchElement";
import { createCard } from "./card";
import "./profile";
import "./newCard";
import { LIST } from "./const";

const placesList = searchingElementInDOM(LIST);

cardsData.forEach((card) => {
  placesList.append(createCard(card));
});

export { placesList };
