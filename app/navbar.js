'use strict';


const navItems = {
    "listings": function (ulContainer) {
        const itemsArray = [];
        const categories = ["Books", "Electronics", "Fashion", "Films & Photography", "Furniture & Appliance", "Games", "Music", "Plants & Animals", "Sports", "Vehicles"];
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
        itemsArray[0].setAttribute('id', 'listingNavLink');
        // Categories
        itemsArray[1].className += " dropdown";
        itemsArray[1].firstChild.className += " dropdown-toggle";
        itemsArray[1].firstChild.setAttribute("data-toggle", "dropdown");
        itemsArray[1].firstChild.setAttribute("role", "button");
        itemsArray[1].firstChild.innerText = "Categories";
        const dropdownContainer = document.createElement('div');
        dropdownContainer.className = "dropdown-menu";
        dropdownContainer.setAttribute("aria-labelledby", "navbarDropdown");
        dropdownContainer.setAttribute("id", "categoryDropDown");
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
    navContainer.className = "navbar navbar-expand-lg navbar-dark bg-dark sticky-top";

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
    navButton.setAttribute('aria-label', 'Toggle navigation');
    navButton.innerHTML = '<span class="navbar-toggler-icon"></span>';
    navContainer.appendChild(navButton);

    const navListContainer = document.createElement('div');
    navListContainer.className = "collapse navbar-collapse";
    navListContainer.id = "navbarNav";
    const navList = document.createElement('ul');
    navList.className = "navbar-nav";
    navListContainer.appendChild(navList);

    const formDiv = document.createElement('div');
    formDiv.classList.add('collapse');
    formDiv.classList.add('navbar-collapse');
    formDiv.classList.add('justify-content-end');

    const searchBar = document.createElement('input');
    searchBar.classList.add('form-control');
    searchBar.classList.add('mr-sm-2');
    searchBar.classList.add('text-light');
    searchBar.classList.add('bg-dark');
    searchBar.setAttribute('id', 'searchBar');
    searchBar.setAttribute('type', 'search');
    searchBar.setAttribute('placeHolder', 'Search');
    searchBar.setAttribute('aria-label', 'Search');

    const searchSubmit = document.createElement('button');
    searchSubmit.setAttribute('id', 'searchSubmit');
    searchSubmit.setAttribute('type', 'submit');
    searchSubmit.classList.add('btn');
    searchSubmit.classList.add('btn-outline-warning');
    searchSubmit.classList.add('my-2');
    searchSubmit.classList.add('my-sm-0');
    searchSubmit.classList.add('bg-dark');
    searchSubmit.appendChild(document.createTextNode('Search'));

    formDiv.appendChild(searchBar);
    formDiv.appendChild(searchSubmit);

    navItems[siteView](navList);
    navContainer.appendChild(navListContainer);
    navContainer.appendChild(formDiv);
    document.body.insertBefore(navContainer, document.body.firstChild);
}
