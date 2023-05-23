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

// Get elements
const btnAddCartEl = document.getElementById("btn-addCart");
const inputAddCartEl = document.getElementById("input-addCart");
const selectStoreEl = document.getElementById("select-store");
const aldiShoppingListEl = document.getElementById("aldi-shopping-list");

//Init App
const app = initializeApp(appSettings);
const database = getDatabase(app);

const storeArr = ["Aldi", "Mediterranean Market", "Kroger", "Giant Eagle"];
storeArr.forEach((store) => {
  const newEl = document.createElement("option");
  newEl.textContent = `${store}`;
  newEl.setAttribute("value", `${store.replace(" ", "-").toLowerCase()}`);
  selectStoreEl.append(newEl);
});

// Create DB references
const DBRefObject = {};
storeArr.forEach((store) => {
  const varName = `itemsIn${store.replace(" ", "")}DB`;
  DBRefObject[varName] = ref(database, `items/${store.replace(" ", "-")}`);
});

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

const clearShoppingLists = (list) => {
  list.innerHTML = "";
};

// Get values from DB
onValue(DBRefObject.itemsInAldiDB, function (snapshot) {
  if (snapshot.exists()) {
    clearShoppingLists(aldiShoppingListEl);
    const databaseItemsArray = Object.entries(snapshot.val());

    for (let i = 0; i < databaseItemsArray.length; i++) {
      const currentItem = databaseItemsArray[i];
      appendListItem(aldiShoppingListEl, currentItem);
    }
  } else {
    ulShoppingList.innerHTML = `<p>No items added...</p>`;
  }
});

// Event handlers
const addCartHandler = () => {
  let inputValue = inputAddCartEl.value;
  resetInputValue(inputAddCartEl);

  if (!inputValue) return;

  // push to database
  push(DBRefObject.itemsInAldiDB, inputValue);
};

// Add Event Listners
btnAddCartEl.addEventListener("click", addCartHandler);
