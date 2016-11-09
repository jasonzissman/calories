window.onload = function () { 
    var input = document.getElementById("food-text-box");
    new Awesomplete(input, {
        list: ["Pizza", "Apple", "Banana", "Pear", "Burger", "Coffee"]
    });
}
