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
        itemsArray[0].setAttribute("id", "listingNavLink");
        // Categories
        itemsArray[1].className += " dropdown";
        itemsArray[1].firstChild.className += " dropdown-toggle";
        itemsArray[1].firstChild.setAttribute("data-toggle", "dropdown");
        itemsArray[1].firstChild.setAttribute("role", "button");
        itemsArray[1].firstChild.innerText = "Categories";
        const dropdownContainer = document.createElement('div');
        dropdownContainer.setAttribute("id", "categoryDropDown");
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
    "profile": function (ulContainer) {
        const itemsArray = [];
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
    },
};

function createNavbar(siteView) {
    console.log("Making navbar...");
    const navContainer = document.createElement('nav');
    navContainer.className = "navbar navbar-expand-lg navbar-dark bg-dark navbar-fixed-top";
    // Logo
    const logoText = document.createElement('a');
    logoText.className = "navbar-brand text-white";
    logoText.setAttribute('href', '#');
    logoText.innerHTML = 'Swap <span class="orange">Hub';
    navContainer.appendChild(logoText);
    // nav-item button
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
    // nav-items
    const navListContainer = document.createElement('div');
    navListContainer.className = "collapse navbar-collapse";
    navListContainer.id = "navebarNav";
    const navList = document.createElement('ul');
    navList.className = "navbar-nav";
    navListContainer.appendChild(navList);
    navItems[siteView](navList);
    navContainer.appendChild(navListContainer);
    // justify to end
    const endContainer = document.createElement('div');
    endContainer.className = "collapse navbar-collapse justify-content-end";
    // search form
    const searchForm = document.createElement('form');
    searchForm.className = "form-inline my-2 my-lg-0";
    const searchInput = document.createElement('input');
    searchInput.className = "form-control mr-sm-2 text-light bg-dark";
    searchInput.setAttribute("type", "search");
    searchInput.setAttribute("id", "searchBar");
    searchInput.setAttribute("placeholder", "Search");
    searchInput.setAttribute("aria-label", "Search");
    searchForm.appendChild(searchInput);
    const searchButton = document.createElement('button');
    searchButton.className = "btn btn-outline-warning my-2 my-sm-0";
    searchButton.setAttribute("type", "submit");
    searchButton.setAttribute("id", "searchSubmit");
    searchButton.innerText = "Search";
    searchForm.appendChild(searchButton);
    endContainer.appendChild(searchForm);
    //profile picture Container
    const profilePicContainer = document.createElement("span");
    profilePicContainer.className = "profilePicContainer";
    const profilePic = document.createElement("a");
    profilePic.className = "profileLink text-light";
    profilePic.setAttribute("href", "profile.html");
    profilePicContainer.appendChild(profilePic);
    const profileImg = document.createElement('img');
    profileImg.className = "profilePic";
    profileImg.setAttribute("width", "40");
    profileImg.setAttribute("src", "img/yeezy_pp.png");
    profilePic.appendChild(profileImg);
    profilePic.appendChild(document.createTextNode("@siiiiiiiiilver_surffffeeeeer"));
    endContainer.appendChild(profilePicContainer);






    navContainer.appendChild(endContainer);
    // justify to end ends


    document.body.insertBefore(navContainer, document.body.firstChild);


}