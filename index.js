import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
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

// Console log when button is pressed
const addCartHandler = () => {
  let inputValue = inputAddCart.value;
  inputAddCart.value = "";

  // push to database
  push(itemsInDB, inputValue);

  // append to list
  ulShoppingList.innerHTML += `<li>${inputValue}</li>`;

  console.log(`${inputValue} added to database`);
};

// Add Event Listners
btnAddCart.addEventListener("click", addCartHandler);
