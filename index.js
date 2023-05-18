import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://shopping-list-4dae2-default-rtdb.firebaseio.com/",
};

//Init App
const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, "items");

console.log(database);
// Get elements
const btnAddCart = document.getElementById("btn-addCart");
const inputAddCart = document.getElementById("input-addCart");
const ulShoppingList = document.getElementById("shopping-list");

// General Functions
const resetInputValue = (input) => {
  input.value = "";
};

const appendListItem = (list, listItem) => {
  const [listItemID, listItemValue] = listItem;
  const newEl = document.createElement("li");
  newEl.textContent = `${listItemValue}`;
  newEl.addEventListener("click", () => {
    const exactLocationOfItemInDB = ref(database, `items/${listItemID}`);
    remove(exactLocationOfItemInDB);
  });
  list.append(newEl);
};

const clearShoppingList = () => {
  ulShoppingList.innerHTML = "";
};

// Get values from DB
onValue(itemsInDB, function (snapshot) {
  if (snapshot.exists()) {
    clearShoppingList();
    const databaseItemsArray = Object.entries(snapshot.val());

    console.log(databaseItemsArray);

    for (let i = 0; i < databaseItemsArray.length; i++) {
      const currentItem = databaseItemsArray[i];
      appendListItem(ulShoppingList, currentItem);
    }
  } else {
    ulShoppingList.innerHTML = `<p>No items added...</p>`;
  }
});

// Event handlers
const addCartHandler = () => {
  let inputValue = inputAddCart.value;
  resetInputValue(inputAddCart);

  if (!inputValue) return;

  // push to database
  push(itemsInDB, inputValue);
};

// Add Event Listners
btnAddCart.addEventListener("click", addCartHandler);
