'use strict';


const navItems = {
    "listings": function (ulContainer) {
        const itemsArray = [];
        const categories = ["Books", "Electronics", "Fashion", "Films/Photography", "Furniture/Appliance", "Games", "Music", "Plants and Animals", "Sports", "Vehicles"];
        for (let i = 0; i < 4; i++) {
            itemsArray.push(document.createElement('li'));
            itemsArray[i].className = "nav-item";
            itemsArray[i].innerHTML = '<a class="nav-link" href="#"></a>';

            ulContainer.appendChild(itemsArray[i]);
        }
        const currView = document.createElement('span');
        currView.className = "sr-only";
        currView.innerText = "(current)";
        // Listings
        itemsArray[0].className += " active";
        itemsArray[0].firstChild.innerText = "Listings";
        itemsArray[0].firstChild.appendChild(currView);
        // Categories
        itemsArray[1].className += " dropdown";
        itemsArray[1].firstChild.className += " dropdown-toggle";
        itemsArray[1].firstChild.setAttribute("data-toggle", "dropdown");
        itemsArray[1].firstChild.setAttribute("role", "button");
        itemsArray[1].firstChild.innerText = "Categories";
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = "dropdown-menu";
        dropdownContainer.setAttribute("aria-labelledby", "navbarDropdown");
        for (let i = 0; i < categories.length; i++) {
            let catergory = document.createElement('a');
            catergory.className = "dropdown-item";
            catergory.setAttribute("href", "#");
            catergory.innerText = categories[i];
            dropdownContainer.appendChild(catergory);
        }
        const miscCategory = document.createElement('a');
        miscCategory.className = "dropdown-item";
        miscCategory.setAttribute("href", "#");
        miscCategory.innerText = "Miscellaneous";
        const dropdownDivider = document.createElement('div');
        dropdownDivider.className = "dropdown-divider";
        dropdownContainer.appendChild(dropdownDivider);
        dropdownContainer.appendChild(miscCategory);
        itemsArray[1].appendChild(dropdownContainer)
        // Sell
        itemsArray[2].firstChild.innerText = "Sell";
        // About
        itemsArray[3].firstChild.innerText = "About";
    },
};

function createNavbar(siteView) {
    console.log("Making navbar...");
    const navContainer = document.createElement('nav');
    navContainer.className = "navbar navbar-expand-lg navbar-dark bg-dark navbar-fixed-top";

    const logoText = document.createElement('a');
    logoText.className = "navbar-brand text-white";
    logoText.setAttribute('href', '#');
    logoText.innerHTML = 'Swap <span class="orange">Hub';
    navContainer.appendChild(logoText);

    const navButton = document.createElement('button');
    navButton.className = "navbar-toggler";
    navButton.setAttribute('type', 'button');
    navButton.setAttribute('data-toggle', 'collapse');
    navButton.setAttribute('data-target', '#navbarNav');
    navButton.setAttribute('aria-controls', 'navbarNav');
    navButton.setAttribute('aria-expanded', 'false');
    navButton.setAttribute('aria-labeal', 'Toggle navigation');
    navButton.innerHTML = '<span class="navbar-toggler-icon"></span>';
    navContainer.appendChild(navButton);

    const navListContainer = document.createElement('div');
    navListContainer.className = "collapse navbar-collapse";
    navListContainer.id = "navebarNav";
    const navList = document.createElement('ul');
    navList.className = "navbar-nav";
    navListContainer.appendChild(navList);

    navItems[siteView](navList);


    navContainer.appendChild(navListContainer);


    document.body.insertBefore(navContainer, document.body.firstChild);


}