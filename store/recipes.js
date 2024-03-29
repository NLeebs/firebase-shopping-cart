// NOTES: Do not Capitalize anything besides first letter of each word

const recipeObj = {
  "Abodo Chicken": {
    Aldi: [
      { item: "Chicken Thighs", type: "refridge", amount: 1 },
      { item: "Garlic", type: "produce", amount: 1 },
      { item: "Jalapeno", type: "produce", amount: 1 },
    ],
    "Mediterranean Market": [
      { item: "Bay Leaves", type: "dry-goods", amount: 1 },
    ],
    Saraga: [
      { item: "Soy Sauce", type: "dry-goods", amount: 1 },
      { item: "Vinegar", type: "dry-goods", amount: 1 },
    ],
  },
  "Buttermilk Chicken": {
    Aldi: [
      { item: "Buttermilk", type: "refridge", amount: 1 },
      { item: "Whole Chicken", type: "refridge", amount: 1 },
    ],
  },
  "Butternut Squash Soup": {
    Aldi: [
      { item: "Butternut Squash", type: "produce", amount: 1 },
      { item: "Onions", type: "produce", amount: 1 },
      { item: "Celery", type: "produce", amount: 1 },
      { item: "Carrots", type: "produce", amount: 1 },
      { item: "Sweet Potatoes", type: "produce", amount: 1 },
      { item: "Chicken Stock", type: "dry-goods", amount: 1 },
      { item: "Butter", type: "refridge", amount: 1 },
    ],
  },
  "Collard Greens": {
    Aldi: [
      { item: "Bacon", type: "refridge", amount: 1 },
      { item: "Broth", type: "dry-goods", amount: 1 },
      { item: "Onions", type: "produce", amount: 1 },
      { item: "Garlic", type: "produce", amount: 1 },
    ],
  },
  Hummus: {
    Aldi: [
      { item: "Olive Oil", type: "dry-goods", amount: 1 },
      { item: "Lemon Juice", type: "dry-goods", amount: 1 },
      { item: "Garlic", type: "produce", amount: 1 },
      { item: "Chickpeas", type: "dry-goods", amount: 2 },
    ],
    "Mediterranean Market": [
      { item: "Tahini", type: "dry-goods", amount: 1 }
    ],
  },
  "Nola Shrimp Boil": {
    Aldi: [
      { item: "Mushrooms", type: "produce", amount: 2 },
      { item: "Onions", type: "produce", amount: 1 },
      { item: "Garlic", type: "produce", amount: 1 },
      { item: "Potatoes", type: "produce", amount: 1 },
      { item: "Garlic Powder", type: "dry-goods", amount: 1 },
      { item: "Onion Powder", type: "dry-goods", amount: 1 },
      { item: "Red Pepper Flakes", type: "dry-goods", amount: 1 },
      { item: "Seasoning Salt", type: "dry-goods", amount: 1 },
      { item: "Butter", type: "refridge", amount: 1 },
      { item: "Sausage", type: "refridge", amount: 2 },
      { item: "Corn on Cob", type: "frozen", amount: 1 },
    ],
    "Mediterranean Market": [
      { item: "Paprika", type: "dry-goods", amount: 1 },
      { item: "Black Pepper", type: "dry-goods", amount: 1 },
      { item: "Oregano", type: "dry-goods", amount: 1 },
      { item: "Thyme", type: "dry-goods", amount: 1 },
      { item: "Cayenne Pepper", type: "dry-goods", amount: 1 },
    ],
    "Saraga": [
      { item: "Lemons", type: "produce", amount: 3 },
      { item: "Oranges", type: "produce", amount: 3 },
      { item: "Shrimp", type: "refridge", amount: 2 },
    ],
  },
  "Peanut Sauce": {
    Aldi: [
      { item: "Ginger", type: "produce", amount: 1 },
      { item: "Garlic", type: "produce", amount: 1 },
      { item: "Peanut Butter", type: "dry-goods", amount: 1 },
      { item: "Brown Sugar", type: "dry-goods", amount: 1 },
    ],
    Saraga: [
      { item: "Soy Sauce", type: "dry-goods", amount: 1 },
      { item: "Lime Juice", type: "dry-goods", amount: 1 },
    ],
  },
  "Persian Crusted Rice": {
    Aldi: [
      { item: "Rice", type: "dry-goods", amount: 1 },
      { item: "Canola Oil", type: "dry-goods", amount: 1 },
      { item: "Butter", type: "refridge", amount: 1 },
      { item: "Greek Yogurt", type: "refridge", amount: 1 },
    ],
  },
  "Pesto": {
    Aldi: [
      { item: "Basil", type: "produce", amount: 1 },
      { item: "Garlic", type: "produce", amount: 1 },
      { item: "Cashews", type: "dry-goods", amount: 1 },
      { item: "Olive Oil", type: "dry-goods", amount: 1 },
      { item: "Lemon Juice", type: "dry-goods", amount: 1 },
      { item: "Noodles", type: "dry-goods", amount: 1 },
      { item: "Parmesan Cheese", type: "refridge", amount: 1 },
    ],
  },
  "Protein Oatmeal": {
    Aldi: [
      { item: "Traditional Oats", type: "dry-goods", amount: 1 },
      { item: "Eggs", type: "refridge", amount: 1 },
      { item: "Egg Whites", type: "refridge", amount: 1 },
      { item: "Bananas", type: "produce", amount: 2 },
    ],
  },
  "Salsa": {
    Aldi: [
      { item: "Tomatoes", type: "produce", amount: 1 },
      { item: "Onions", type: "produce", amount: 1 },
      { item: "Garlic", type: "produce", amount: 1 },
      { item: "Peppers", type: "produce", amount: 1 },
    ],
    "Saraga": [
      { item: "Cilantro", type: "produce", amount: 1 },
      { item: "Lemon Juice", type: "dry-goods", amount: 1 },
    ],
  },
  "Standard Veggies": {
    Aldi: [
      { item: "Celery", type: "produce", amount: 1 },
      { item: "Onions", type: "produce", amount: 1 },
      { item: "Carrots", type: "produce", amount: 1 },
      { item: "Cabbage", type: "produce", amount: 1 },
    ],
  },
  "Taco Bowl": {
    Aldi: [
      { item: "Rice", type: "dry-goods", amount: 1 },
      { item: "Tortillas", type: "dry-goods", amount: 1 },
      { item: "Jalepenos", type: "produce", amount: 1 },
      { item: "Ground Turkey", type: "refridge", amount: 1 },
      { item: "Sour Cream", type: "refridge", amount: 1 },
      { item: "Shredded Cheese", type: "refridge", amount: 1 },
    ],
  },
  "Turkey Chili": {
    Aldi: [
      { item: "Chili Beans", type: "dry-goods", amount: 4 },
      { item: "Diced Tomatoes", type: "dry-goods", amount: 2 },
      { item: "Chili Spices", type: "dry-goods", amount: 1 },
      { item: "Zucchini", type: "produce", amount: 1 },
      { item: "Carrots", type: "produce", amount: 1 },
      { item: "Spinach", type: "produce", amount: 1 },
      { item: "Butternut Squash", type: "produce", amount: 1 },
      { item: "Ground Turkey", type: "refridge", amount: 1 },
    ],
  },
  "Yogurt Goo Bowl": {
    Aldi: [
      { item: "Greek Yogurt", type: "refridge", amount: 2 },
      { item: "Frozen Berries", type: "frozen", amount: 3 },
      { item: "Granola", type: "dry-goods", amount: 1 },
      { item: "Peanut Butter", type: "dry-goods", amount: 1 },
    ],
  },
};

export default recipeObj;
