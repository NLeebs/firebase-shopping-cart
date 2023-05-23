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
const storeArr = ["Aldi", "Mediterranean Market", "Kroger", "Giant Eagle"];
const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, "items");

// Create DB references
const DBRefObject = {};
storeArr.forEach((store) => {
  const varName = `itemsIn${store.replace(" ", "")}DB`;
  DBRefObject[varName] = ref(database, `items/${store.replace(" ", "-")}`);
});

// Get elements
const btnAddCart = document.getElementById("btn-addCart");
const inputAddCart = document.getElementById("input-addCart");
const aldiShoppingList = document.getElementById("aldi-shopping-list");

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
    clearShoppingLists(aldiShoppingList);
    const databaseItemsArray = Object.entries(snapshot.val());

    for (let i = 0; i < databaseItemsArray.length; i++) {
      const currentItem = databaseItemsArray[i];
      appendListItem(aldiShoppingList, currentItem);
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
  push(DBRefObject.itemsInAldiDB, inputValue);
};

// Add Event Listners
btnAddCart.addEventListener("click", addCartHandler);
