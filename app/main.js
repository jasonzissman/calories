var itemNameInput;
var itemCaloriesInput;
var itemsTable;
var totalAmountSpan;
var currentItems = [];

getTodaysLocalStorageKey = function() {
    var today = new Date();
    var key = today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
    return key;
}

drawCurrentItemsToScreen = function() {

    itemsTable.innerHTML = "";
    var totalCalories = 0;
    if(currentItems && currentItems.length > 0) {
        for(var i=0; i<currentItems.length; i++) {
            var htmlToAdd = '<tr>' + 
            '<td class="item-name">' + currentItems[i].name + '</td>' + 
            '<td class="item-calories">' + currentItems[i].calories + '</td>' +
            '</tr>';
            itemsTable.innerHTML += htmlToAdd;
            totalCalories += Number(currentItems[i].calories);
        }
        totalAmountSpan.innerHTML = totalCalories;
    }
};

window.onload = function () { 
    if (typeof (Storage) === "undefined") {
        alert("This website requires HTML5 Local storage to work.  Your browser does not appear to support it.");
        return;
    } 

    itemNameInput = document.getElementById("food-text-box");
    itemCaloriesInput = document.getElementById("calorie-drop-down");
    itemsTable = document.getElementById("calories-list");
    totalAmountSpan = document.getElementById("total-amount");

    // Read current items for the day from local storage
    var currentDayString = getTodaysLocalStorageKey();
    var itemsFromLocalStorage = localStorage.getItem(currentDayString);
    if(itemsFromLocalStorage) {
        currentItems = JSON.parse(itemsFromLocalStorage);
    }
    
    drawCurrentItemsToScreen();

    // Load auto-complete library    
    new Awesomplete(itemNameInput, {
        list: ["Pizza", "Apple", "Banana", "Pear", "Burger", "Coffee", "Peach"]
    });

    // Set up click handler for button
    var addButton = document.getElementById("add-button");
    addButton.onclick = function() {
        var itemName = itemNameInput.value;
        var itemCalories = itemCaloriesInput.value;
        currentItems.push({
            "name": itemName,
            "calories": itemCalories
        });
        var currentDayString = getTodaysLocalStorageKey();
        localStorage.setItem(currentDayString, JSON.stringify(currentItems));
        drawCurrentItemsToScreen();
    };


}
