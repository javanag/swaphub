'use strict';

//The current user session will be kept track of on the server
let currentUserName = '';
let currentUserImage = '';
let index = false;

function setupNavbarUser(userName, userImage) {
    currentUserName = userName;
    // currentUserImage = userImage;
}

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
        itemsArray[0].firstChild.setAttribute("href", "/listings/");
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
        itemsArray[1].appendChild(dropdownContainer);
        // Sell
        itemsArray[2].firstChild.innerText = "Sell";
        itemsArray[2].firstChild.setAttribute("href", "/sell/");
        // About
        itemsArray[3].firstChild.innerText = "About";
    },
    "profile": function (ulContainer) {
        const itemsArray = [];
        for (let i = 0; i < 3; i++) {
            itemsArray.push(document.createElement('li'));
            itemsArray[i].className = "nav-item";
            itemsArray[i].innerHTML = '<a class="nav-link" href="#"></a>';
        }
        const currView = document.createElement('span');
        currView.className = "sr-only";
        currView.innerText = "(current)";
        // Listings
        itemsArray[0].firstChild.innerText = "Listings";
        itemsArray[0].setAttribute("id", "listingNavLink");
        itemsArray[0].firstChild.setAttribute("href", "/listings/");

        // Sell
        itemsArray[1].firstChild.innerText = "Sell";
        itemsArray[1].firstChild.setAttribute("href", "/sell/");
        // About
        itemsArray[2].firstChild.innerText = "About";
        if (index) {
            itemsArray.splice(1, 1);
        }

        for (let i = 0; i < itemsArray.length; i++) {
            ulContainer.appendChild(itemsArray[i]);
        }
    },
};

function createNavbar(siteView, loggedIn = true) {
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
    if (loggedIn) {
        //profile picture Container
        const profilePicContainer = document.createElement("span");
        profilePicContainer.className = "profilePicContainer";
        const profilePic = document.createElement("a");
        profilePic.className = "profileLink text-light";
        profilePic.setAttribute("href", "/users/" + currentUserName);
        profilePicContainer.appendChild(profilePic);
        const profileImg = document.createElement('img');
        profileImg.className = "profilePic";
        profileImg.setAttribute("width", "40");
        //fetch userImage:
        fetch("/api/users/" + currentUserName).then(res => res.json())
            .then(user => {
                profileImg.setAttribute("src", user.profilePic);
            })

        profilePic.appendChild(profileImg);//todo: load from user object
        profilePic.appendChild(document.createTextNode("@" + currentUserName));
        endContainer.appendChild(profilePicContainer);

        const logoutButton = document.createElement('a');
        logoutButton.className = "btn btn-outline-danger my-2 my-sm-0 ml-3";
        logoutButton.setAttribute("role", "button");
        logoutButton.setAttribute("href", "/users/logout");
        logoutButton.setAttribute("id", "logoutButton");
        logoutButton.innerText = "Logout";
        endContainer.appendChild(logoutButton);
    } else {
        const loginButton = document.createElement('a');
        loginButton.className = "btn btn-warning my-2 my-sm-0 ml-3";
        loginButton.setAttribute("role", "button");
        loginButton.setAttribute("href", "/login");
        loginButton.setAttribute("id", "loginButton");
        loginButton.innerText = "Login / Signup";
        endContainer.appendChild(loginButton);
    }

    navContainer.appendChild(endContainer);
    // justify to end ends

    document.body.prepend(navContainer, document.body.firstChild);
}
