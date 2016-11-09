var itemNameInput;
var itemCaloriesInput;
var itemsTable;
var totalAmountSpan;
var allItems = {};

generateGuid = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

getLocalStorageKey = function() {
    return "jz-calories-counter";
}

getTodaysValuesKey = function() {
    var today = new Date();
    var key = today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
    return key;
}

deleteItem = function(itemId) {
    for(var j=0; j<allItems[getTodaysValuesKey()].length; j++) {
        if (allItems[getTodaysValuesKey()][j].id === itemId) {
            allItems[getTodaysValuesKey()].splice(j, 1);
            var localStorageKey = getLocalStorageKey();
            localStorage.setItem(localStorageKey, JSON.stringify(allItems));
            drawTodaysItemsToScreen();
            break;
        }
    }
};

drawTodaysItemsToScreen = function() {

    itemsTable.innerHTML = "";
    var totalCalories = 0;
    var todaysItems = allItems[getTodaysValuesKey()];

    if(todaysItems && todaysItems.length > 0) {
        for(var i=0; i<todaysItems.length; i++) {

            var htmlToAdd = '<tr id="' + todaysItems[i].id + '" title="Click to remove item">' + 
            '<td class="item-name">' + todaysItems[i].name + '</td>' + 
            '<td class="item-calories">' + todaysItems[i].calories + '</td>' +
            '</tr>';
            itemsTable.innerHTML += htmlToAdd;

            // Set up click handler to delete when pressed
            (function (itemId) {
                setTimeout(function() {
                    document.getElementById(itemId).onclick = function() {
                        deleteItem(itemId);
                    };
                }, 250);
            })(todaysItems[i].id);

            totalCalories += Number(todaysItems[i].calories);
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

    // Read all items from local storage
    var localStorageKey = getLocalStorageKey();
    var itemsFromLocalStorage = localStorage.getItem(localStorageKey);
    if(itemsFromLocalStorage) {
        allItems = JSON.parse(itemsFromLocalStorage);
    }
    
    drawTodaysItemsToScreen();

    // Load auto-complete library
    var mapOfItemsToCalories = {};
    Object.keys(allItems).forEach(function(key,index) {
        var thatDaysItems = allItems[key];
        if (thatDaysItems){
            for(var i=0; i<thatDaysItems.length; i++) {
                mapOfItemsToCalories[thatDaysItems[i].name] = thatDaysItems[i].calories;
            }
        }
    });
    new Awesomplete(itemNameInput, {
        list: Object.keys(mapOfItemsToCalories)
    });

    // Auto-populate the 'calories' drop down if they choose an auto-completed item.
    itemNameInput.addEventListener('awesomplete-selectcomplete', function(e){
        var currentItemName = itemNameInput.value;
        var caloriesForCurrentItem = mapOfItemsToCalories[currentItemName];
        if(caloriesForCurrentItem) {
            for (var i=0; i<itemCaloriesInput.length; i++){
                if(itemCaloriesInput.options[i].value === caloriesForCurrentItem) {
                    itemCaloriesInput.selectedIndex = i;
                    break;
                }
            }
        }
    });

    // Set up click handler for button
    var addButton = document.getElementById("add-button");
    addButton.onclick = function() {
        var itemName = itemNameInput.value;
        var itemCalories = itemCaloriesInput.value;
        if (!allItems[getTodaysValuesKey()]) {
            allItems[getTodaysValuesKey()] = [];
        }
        allItems[getTodaysValuesKey()].push({
            "id": generateGuid(),
            "name": itemName,
            "calories": itemCalories
        });
        var localStorageKey = getLocalStorageKey();
        var allItemsJsonString = JSON.stringify(allItems);
        debugger;
        localStorage.setItem(localStorageKey, allItemsJsonString);
        drawTodaysItemsToScreen();
    };
}
