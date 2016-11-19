var itemNameInput;
var itemCaloriesInput;
var itemsTable;
var totalAmountSpan;
var dateBox;
var body;
var allItems = {};

generateGuid = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

getLocalStorageKey = function() {
    return "jz-calories-counter";
};

getTodaysMapKey = function() {
    var today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
};

saveUpdatedItemsToLocalStorage = function() {
    var localStorageKey = getLocalStorageKey();
    var allItemsAsJsonString = JSON.stringify(allItems);
    localStorage.setItem(localStorageKey, allItemsAsJsonString);
};

deleteItem = function(itemId) {
    var todaysMapKey = getTodaysMapKey();
    for(var j=0; j<allItems[todaysMapKey].length; j++) {
        if (allItems[todaysMapKey][j].id === itemId) {
            allItems[todaysMapKey].splice(j, 1);
            saveUpdatedItemsToLocalStorage();
            drawTodaysItemsToScreen();
            loadAutocompleteLibrary();
            break;
        }
    }
};

createListItemHtml = function(item) {
    return '<tr id="' + item.id + '" title="Click to remove item">' + 
        '<td class="item-name">' + item.name + '</td>' + 
        '<td class="item-calories">' + item.calories + '</td>' +
        '</tr>';
};

updateBackgroundImage = function(totalCalories) {
    if (totalCalories < 400) {
        body.style.backgroundImage = "url('images/status-1.jpg')";
    } else if (totalCalories < 800) {
        body.style.backgroundImage = "url('images/status-2.jpg')";
    } else if (totalCalories < 1200) {
        body.style.backgroundImage = "url('images/status-3.jpg')";
    } else if (totalCalories < 1600) {
        body.style.backgroundImage = "url('images/status-4.jpg')";
    } else if (totalCalories < 2000) {
        body.style.backgroundImage = "url('images/status-5.jpg')";
    } else {
        body.style.backgroundImage = "url('images/status-6.jpg')";
    }
};

drawTodaysItemsToScreen = function() {

    itemsTable.innerHTML = "";
    var totalCalories = 0;
    var todaysItems = allItems[getTodaysMapKey()];

    if(todaysItems && todaysItems.length > 0) {
        for(var i=0; i<todaysItems.length; i++) {

            itemsTable.innerHTML += createListItemHtml(todaysItems[i]);

            // Set up click handler to delete when pressed
            (function (itemId) {
                setTimeout(function(){
                    document.getElementById(itemId).onclick = function() {
                        deleteItem(itemId);
                    };
                }, 100);
            })(todaysItems[i].id);

            totalCalories += Number(todaysItems[i].calories);
        }
    }

    totalAmountSpan.innerHTML = totalCalories;
    dateBox.innerHTML = new Date().toDateString();
    updateBackgroundImage(totalCalories);
};

loadAutocompleteLibrary = function() {
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
};

removeItemsOlderThanOneMonth = function(items) {
    var todayInMs = Date.now();
    var oneMonthInMs = 31 * 24 * 60 * 60 * 1000;
    var keysToDelete = [];

    Object.keys(allItems).forEach(function(key,index) {
        var dateInMs = Number(key);
        if (todayInMs - oneMonthInMs > dateInMs) {
            keysToDelete.push(key);
        }
    });

    for(var i=0; i<keysToDelete.length; i++) {
        delete allItems[keysToDelete[i]];
    }

    saveUpdatedItemsToLocalStorage();
};

window.onload = function () { 

    if (typeof (Storage) === "undefined") {
        alert("This website requires HTML5 Local storage to work.  Your browser does not appear to support it.");
        return;
    } 

    // Get hooks into DOM elements
    itemNameInput = document.getElementById("food-text-box");
    itemCaloriesInput = document.getElementById("calorie-drop-down");
    itemsTable = document.getElementById("calories-list");
    totalAmountSpan = document.getElementById("total-amount");
    dateBox = document.getElementById("date-box");
    body = document.body;

    // Read all items from local storage
    var localStorageKey = getLocalStorageKey();
    var itemsFromLocalStorage = localStorage.getItem(localStorageKey);
    if(itemsFromLocalStorage) {
        allItems = JSON.parse(itemsFromLocalStorage);
        removeItemsOlderThanOneMonth();
    }
    
    drawTodaysItemsToScreen();
    loadAutocompleteLibrary();

    // Set up click handler for add button
    var addButton = document.getElementById("add-button");
    addButton.onclick = function() {
        var itemName = itemNameInput.value;
        var itemCalories = itemCaloriesInput.value;

        var mapKeyForToday = getTodaysMapKey();
        if (!allItems[mapKeyForToday]) {
            allItems[mapKeyForToday] = [];
        }
        allItems[mapKeyForToday].unshift({
            "id": generateGuid(),
            "name": itemName,
            "calories": itemCalories
        });

        saveUpdatedItemsToLocalStorage();
        drawTodaysItemsToScreen();
        loadAutocompleteLibrary();
        itemNameInput.value = '';
        itemCaloriesInput.selectedIndex = 0;
    };
};