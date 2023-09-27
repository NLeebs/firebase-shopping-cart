import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import recipeObj from "./store/recipes.js";

const appSettings = {
  databaseURL: "https://shopping-list-4dae2-default-rtdb.firebaseio.com/",
};

/////////// Get elements ///////////
const btnAddCartEl = document.getElementById("btn-addCart");
const inputAddCartEl = document.getElementById("input-addCart");
const inputAmountEl = document.getElementById("input-amount");
const selectStoreEl = document.getElementById("select-store");
const selectTypeEl = document.getElementById("select-type");
const selectRecipeEl = document.getElementById("select-recipe");
const shoppingListEl = document.getElementById("shopping-list");

/////////// Init App ///////////
const app = initializeApp(appSettings);
const database = getDatabase(app);

const createSelectOptions = function (arr, selectEl, isTypes) {
  if (!isTypes) arr.sort();
  if (isTypes) arr.push("Other");
  arr.forEach((option) => {
    const newEl = document.createElement("option");
    newEl.textContent = `${option}`;
    newEl.setAttribute("value", `${option.replaceAll(" ", "-").toLowerCase()}`);
    selectEl.append(newEl);
  });
};

//Stores - Add or change here
const storeArr = [
  "Aldi",
  "Mediterranean Market",
  "Saraga",
  "Kroger",
  "Giant Eagle",
].sort();
createSelectOptions(storeArr, selectStoreEl);

//Item Types -  Add or change here
const itemTypes = [
  "Produce",
  "Dry Goods",
  "Baked Goods",
  "Refridge",
  "Frozen",
  "Beverage",
];
createSelectOptions(itemTypes, selectTypeEl, true);

//Recipes
const recipeNameArr = Object.keys(recipeObj);
createSelectOptions(recipeNameArr, selectRecipeEl);

/////////// Create DB references ///////////
const itemsInDB = ref(database, "items");
const DBRefObject = {};
storeArr.forEach((store) => {
  const varName = `itemsIn${store.replace(" ", "")}DB`;
  DBRefObject[varName] = ref(database, `items/${store.replace(" ", "-")}`);
});

/////////// General Functions ///////////
const resetInputValue = (input) => {
  const inputID = input.getAttribute("id");
  if (inputID === "input-addCart" || inputID === "select-recipe")
    input.value = "";
  if (inputID === "input-amount") input.value = 1;
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
    if (listItemObj.amount > 1)
      newEl.textContent = `${listItemObj.item} x ${listItemObj.amount}`;
    else newEl.textContent = `${listItemObj.item}`;
    newEl.setAttribute("data-type", listItemObj.type);
    // Delete functionality - needs to find path
    newEl.addEventListener("click", () => {
      const exactLocationOfItemInDB = ref(
        database,
        `items/${route}/${listItemID}`
      );
      if (listItemObj.amount === 1) remove(exactLocationOfItemInDB);
      else
        update(exactLocationOfItemInDB, {
          amount: listItemObj.amount - 1,
        });
    });
    list.append(newEl);
  });
};

const sortGroceryItemsByType = function (arr) {
  return arr.sort((a, b) => {
    const customOrder = [
      "produce",
      "dry-goods",
      "baked-goods",
      "refridge",
      "frozen",
      "beverage",
      "other",
    ];
    const indexA = customOrder.indexOf(a[1].type);
    const indexB = customOrder.indexOf(b[1].type);

    return indexA - indexB;
  });
};

const clearShoppingLists = () => {
  shoppingListEl.innerHTML = "";
};

const capitalizeWord = function (word) {
  const firstLetter = word.charAt(0).toUpperCase();
  const restOfWord = word.slice(1);
  return `${firstLetter}${restOfWord}`;
};

const capitalizeInputValue = function (value) {
  const words = value.split(" ");
  const capitalizedWords = words.map((word) => {
    return capitalizeWord(word);
  });
  return capitalizedWords.join(" ");
};

const dashedFormatToStandard = function (str, type) {
  const words = str.split("-");
  const capitalizedWords = words.map((word) => {
    return capitalizeWord(word);
  });
  if (type === "DB") return capitalizedWords.join("");
  if (type === "route") return capitalizedWords.join("-");
  else return capitalizedWords.join(" ");
};

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

/////////// Search for same item in same store ///////////
const sameItemInSameStore = function (DBRef, newItemObj) {
  let isSame = null;
  onValue(DBRefObject[DBRef], function (snapshot) {
    if (snapshot.exists()) {
      Object.entries(snapshot.val()).forEach((itemObj) => {
        if (itemObj[1].item === newItemObj.item) {
          isSame = itemObj[0];
        }
      });
    }
  });
  return isSame;
};

/////////// Event handlers ///////////
//Add an item or recipe to the cart
const addCartHandler = function () {
  const inputValue = capitalizeInputValue(inputAddCartEl.value);
  const selectValue = selectRecipeEl.value;
  const itemAmount = +inputAmountEl.value;
  resetInputValue(inputAddCartEl);
  resetInputValue(inputAmountEl);
  resetInputValue(selectRecipeEl);
  selectValueChangeHandler();

  if (selectValue === "") {
    if (!inputValue) return;

    const storeValue = dashedFormatToStandard(selectStoreEl.value, "DB");
    const storeRoute = dashedFormatToStandard(selectStoreEl.value, "route");
    const itemObj = {
      item: inputValue,
      type: selectTypeEl.value,
      amount: itemAmount,
    };
    const DBRef = `itemsIn${storeValue}DB`;

    // push to database -- ADD FUNCTIONALITY TO RECIPES
    const existingItemID = sameItemInSameStore(DBRef, itemObj);
    if (existingItemID) {
      const updateRef = ref(database, `items/${storeRoute}/${existingItemID}`);
      let currentAmount;
      onValue(updateRef, (snapshot) => {
        const currentObj = Object.entries(snapshot.val());
        currentAmount = currentObj[0][1];
      });
      update(updateRef, {
        amount: currentAmount + itemAmount,
      });
    }
    if (!existingItemID) {
      push(DBRefObject[DBRef], itemObj);
    }
  } else {
    const recipeSelected = dashedFormatToStandard(selectValue);
    console.log(recipeSelected);
    console.log(selectValue);
    Object.entries(recipeObj[recipeSelected]).forEach((storeArr) => {
      const storeValue = storeArr[0].replaceAll(" ", "");
      const DBRef = `itemsIn${storeValue}DB`;
      const storeRoute = storeArr[0].replaceAll(" ", "-");

      storeArr[1].forEach((itemObj) => {
        const existingItemID = sameItemInSameStore(DBRef, itemObj);

        if (existingItemID) {
          const updateRef = ref(
            database,
            `items/${storeRoute}/${existingItemID}`
          );

          const currentAmount = getCurrentItemAmount(updateRef);
          update(updateRef, {
            amount: currentAmount + itemObj.amount,
          });
        }
        if (!existingItemID) {
          push(DBRefObject[DBRef], itemObj);
        }
      });
    });
  }
};

const getCurrentItemAmount = function (updateRef) {
  let currentAmount;
  onValue(updateRef, (snapshot) => {
    const currentObj = Object.entries(snapshot.val());
    currentAmount = currentObj[0][1];
  });
  return currentAmount;
};

//Change UI based on recipe selection
const selectValueChangeHandler = function () {
  if (selectRecipeEl.value !== "") {
    inputAddCartEl.setAttribute("disabled", "");
    inputAddCartEl.classList.add("disabled"),
      inputAmountEl.setAttribute("disabled", "");
    inputAmountEl.classList.add("disabled"),
      selectStoreEl.setAttribute("disabled", "");
    selectTypeEl.setAttribute("disabled", "");
  } else {
    inputAddCartEl.removeAttribute("disabled");
    inputAddCartEl.classList.remove("disabled"),
      inputAmountEl.removeAttribute("disabled");
    inputAmountEl.classList.remove("disabled"),
      selectStoreEl.removeAttribute("disabled");
    selectTypeEl.removeAttribute("disabled");
  }
};

/////////// Add Event Listners ///////////
btnAddCartEl.addEventListener("click", addCartHandler);
inputAddCartEl.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addCartHandler();
  }
});
selectRecipeEl.addEventListener("change", selectValueChangeHandler);
