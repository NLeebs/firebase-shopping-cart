import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// import recipeObj from "./store/recipes.js";

const appSettings = {
  databaseURL: "https://shopping-list-4dae2-default-rtdb.firebaseio.com/",
};

/////////// Get elements ///////////
const btnAddCartEl = document.getElementById("btn-addCart");
const inputAddCartEl = document.getElementById("input-addCart");
const selectStoreEl = document.getElementById("select-store");
const selectTypeEl = document.getElementById("select-type");
const shoppingListEl = document.getElementById("shopping-list");

/////////// Init App ///////////
const app = initializeApp(appSettings);
const database = getDatabase(app);

const createSelectOptions = function (arr, selectEl) {
  arr.forEach((option) => {
    const newEl = document.createElement("option");
    newEl.textContent = `${option}`;
    newEl.setAttribute("value", `${option.replace(" ", "-").toLowerCase()}`);
    selectEl.append(newEl);
  });
};

//Item Types
const itemTypes = [
  "Produce",
  "Sealed",
  "Protein",
  "Refridge",
  "Frozen",
  "Bread",
  "Beverage",
  "Other",
];
createSelectOptions(itemTypes, selectTypeEl);

//Stores
const storeArr = [
  "Aldi",
  "Mediterranean Market",
  "Saraga",
  "Kroger",
  "Giant Eagle",
].sort();
createSelectOptions(storeArr, selectStoreEl);

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

const appendListItems = (list, listItemsArr, route) => {
  listItemsArr.forEach((listItem) => {
    const [listItemID, listItemObj] = listItem;
    const newEl = document.createElement("li");
    newEl.textContent = `${listItemObj.item}`;
    newEl.setAttribute("data-type", listItemObj.type);
    // Delete functionality - needs to find path
    newEl.addEventListener("click", () => {
      const exactLocationOfItemInDB = ref(
        database,
        `items/${route}/${listItemID}`
      );
      remove(exactLocationOfItemInDB);
    });
    list.append(newEl);
  });
};

const sortGroceryItemsByType = function (arr) {
  return arr.sort((a, b) => {
    return a[1].type.localeCompare(b[1].type);
  });
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

          const currentItemArr = [];
          for (let i = 0; i < databaseItemsArray.length; i++) {
            const currentItem = databaseItemsArray[i];
            currentItemArr.push(databaseItemsArray[i]);
          }

          const sortedCurrentItemArr = sortGroceryItemsByType(currentItemArr);
          appendListItems(
            shoppingListEl,
            sortedCurrentItemArr,
            storeRoutes[index]
          );

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

  const itemObj = { item: inputValue, type: selectTypeEl.value };

  // push to database
  push(DBRefObject[`itemsIn${storeValue}DB`], itemObj);
};

/////////// Add Event Listners ///////////
btnAddCartEl.addEventListener("click", addCartHandler);
inputAddCartEl.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addCartHandler();
  }
});
