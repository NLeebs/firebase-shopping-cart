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

/////////// Get elements ///////////
const btnAddCartEl = document.getElementById("btn-addCart");
const inputAddCartEl = document.getElementById("input-addCart");
const selectStoreEl = document.getElementById("select-store");
const shoppingListEl = document.getElementById("shopping-list");
const aldiShoppingListEl = document.getElementById("aldi-shopping-list");
const mMarketShoppingListEl = document.getElementById(
  "mediterranean-market-shopping-list"
);

/////////// Init App ///////////
const app = initializeApp(appSettings);
const database = getDatabase(app);

//Stores
const storeArr = [
  "Aldi",
  "Mediterranean Market",
  "Kroger",
  "Giant Eagle",
].sort();
storeArr.forEach((store) => {
  const newEl = document.createElement("option");
  newEl.textContent = `${store}`;
  newEl.setAttribute("value", `${store.replace(" ", "-").toLowerCase()}`);
  selectStoreEl.append(newEl);
});

/////////// Create DB references ///////////
const itemsInDB = ref(database, "items");
const DBRefObject = {};
storeArr.forEach((store) => {
  const varName = `itemsIn${store.replace(" ", "")}DB`;
  DBRefObject[varName] = ref(database, `items/${store.replace(" ", "-")}`);
});

/////////// General Functions ///////////
const resetInputValue = (input) => {
  input.value = "";
};

const appendListHeader = (list, header) => {
  const newEl = document.createElement("h2");
  newEl.textContent = header;
  list.append(newEl);
};

const appendListItem = (list, listItem, route) => {
  const [listItemID, listItemValue] = listItem;
  const newEl = document.createElement("li");
  newEl.textContent = `${listItemValue}`;
  // Delete functionality - needs to find path
  newEl.addEventListener("click", () => {
    const exactLocationOfItemInDB = ref(
      database,
      `items/${route}/${listItemID}`
    );
    remove(exactLocationOfItemInDB);
  });
  list.append(newEl);
};

const clearShoppingLists = () => {
  shoppingListEl.innerHTML = "";
};

function storeValueToPath(str) {
  const words = str.split("-"); // Split the string into an array of words
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase(); // Get the first letter of each word and capitalize it
    const restOfWord = word.slice(1); // Get the remaining characters of each word
    return `${firstLetter}${restOfWord}`; // Concatenate the capitalized first letter with the rest of the word
  });
  return capitalizedWords.join(""); // Join the array of capitalized words back into a string
}

/////////// Get values from DB ///////////
onValue(itemsInDB, function (snapshot) {
  if (snapshot.exists()) {
    clearShoppingLists();
    const storeRoutes = Object.entries(snapshot.val()).map((item) => item[0]);
    const stores = storeRoutes.map((store) => store.replace("-", " "));
    let index = 0;

    Object.keys(DBRefObject).forEach((DBref) => {
      onValue(DBRefObject[DBref], function (snapshot) {
        if (snapshot.exists()) {
          const databaseItemsArray = Object.entries(snapshot.val());

          appendListHeader(shoppingListEl, stores[index]);

          for (let i = 0; i < databaseItemsArray.length; i++) {
            const currentItem = databaseItemsArray[i];
            appendListItem(shoppingListEl, currentItem, storeRoutes[index]);
          }

          index++;
        }
      });
    });
  } else {
    shoppingListEl.innerHTML = `<p>No items added...</p>`;
  }
});

/////////// Event handlers ///////////
const addCartHandler = () => {
  const inputValue = inputAddCartEl.value;
  resetInputValue(inputAddCartEl);

  if (!inputValue) return;

  const storeValue = storeValueToPath(selectStoreEl.value);

  // push to database
  push(DBRefObject[`itemsIn${storeValue}DB`], inputValue);
};

/////////// Add Event Listners ///////////
btnAddCartEl.addEventListener("click", addCartHandler);
