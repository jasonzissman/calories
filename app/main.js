var itemNameInput;
var itemCaloriesInput;
var itemsTable;
var totalAmountSpan;
var currentItems = [];

generateGuid = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

getTodaysLocalStorageKey = function() {
    var today = new Date();
    var key = today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
    return key;
}

deleteItem = function(itemId) {
    for(var j=0; j<currentItems.length; j++) {
        if (currentItems[j].id === itemId) {
            currentItems.splice(j, 1);
            var currentDayString = getTodaysLocalStorageKey();
            localStorage.setItem(currentDayString, JSON.stringify(currentItems));
            drawCurrentItemsToScreen();
            break;
        }
    }
};

drawCurrentItemsToScreen = function() {

    itemsTable.innerHTML = "";
    var totalCalories = 0;
    if(currentItems && currentItems.length > 0) {
        for(var i=0; i<currentItems.length; i++) {

            var htmlToAdd = '<tr id="' + currentItems[i].id + '" title="Click to remove item">' + 
            '<td class="item-name">' + currentItems[i].name + '</td>' + 
            '<td class="item-calories">' + currentItems[i].calories + '</td>' +
            '</tr>';
            itemsTable.innerHTML += htmlToAdd;

            // Set up click handler to delete when pressed
            (function (itemId) {
                setTimeout(function() {
                    document.getElementById(itemId).onclick = function() {
                        deleteItem(itemId);
                    };
                }, 250);
            })(currentItems[i].id);

            totalCalories += Number(currentItems[i].calories);
        }
    }
    totalAmountSpan.innerHTML = totalCalories;
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
            "id": generateGuid(),
            "name": itemName,
            "calories": itemCalories
        });
        var currentDayString = getTodaysLocalStorageKey();
        localStorage.setItem(currentDayString, JSON.stringify(currentItems));
        drawCurrentItemsToScreen();
    };
}
