'use strict';
// const listingsContainer = document.querySelector('#listingsContainer');
// const listingBreadcrumb = document.querySelector('#listingBreadcrumb');
// const listingNavLink = document.querySelector('#listingNavLink');
// const categoryDropDown = document.querySelector('#categoryDropDown');
// const searchBar = document.querySelector('#searchBar');
// const searchSubmit = document.querySelector('#searchSubmit');
var currentListing;
var usernameDOM;
var priceDOM;
var dateDOM;
var titleDOM;
var descDOM;
var ppDOM;
var ppTextDOM;
var conditionDOM;

const Listing = function (username, profilePicture, title, date, price, condition, category, thumbnail, description, likes) {
    this.username = username;
    this.profilePicture = profilePicture;
    this.title = title;
    this.date = date;
    this.price = price;
    this.condition = condition;
    this.category = category;
    this.thumbnail = thumbnail;
    this.description = description;
    this.likes = likes;
}

document.addEventListener('DOMContentLoaded', function () {
    //This loading of recent listings will be drawn from the server in the future.
    //So pretend allListings is the server I suppose.
    currentListing = (new Listing('laflame92cactus', 'travis_pp.jpg', 'Adidas Yeezy 750 Boost', 'Oct 31, 2018', '2560.56', 'NEW', 'Fashion', 'yeezy750feet.jpg', 'New Yeezy 750 Boost signed by Kanye West. Size 13, comes in box, can provide receipt upon request.', 0));
    //Render recent listings pulled from server;
    ppDOM = document.querySelector('#listingProfilePic');
    priceDOM = document.querySelector('#priceTag');
    dateDOM = document.querySelector('#dateText');
    titleDOM = document.querySelector('#itemTitle');
    descDOM = document.querySelector('#itemDescription');
    ppTextDOM = document.querySelector('#profileText');
    conditionDOM = document.querySelector('#itemCondText');

    setItemDescriptionDOM();
});

// function setDOMListingValues(currentListing) {
//     // setItemDOM(listing)
//     setItemDescriptionDOM(currentListing)
// }

// function setItemDOM(listing) {
// }

function setItemDescriptionDOM() {
    var filepath = "img/"
    profileText.innerText = currentListing.username
    ppDOM.setAttribute("src", filepath + currentListing.profilePicture)
    priceDOM.innerText = '$' + currentListing.price
    dateDOM.innerText = currentListing.date
    descDOM.innerText = currentListing.description
    titleDOM.innerText = currentListing.title
    setCondition()
}   

function setCondition(){
    if (currentListing.condition == 'NEW') {
        conditionDOM.setAttribute("class", 'text-success');
        conditionDOM.innerText = 'NEW'
    } else if (currentListing.condition == 'USED') {
        conditionDOM.setAttribute("class", 'text-warning');
        conditionDOM.innerText = 'USED'
    } else if (currentListing.condition == 'DAMAGED') {
        conditionDOM.setAttribute("class", 'text-danger');
        conditionDOM.innerText = 'DAMAGED'
    }
}
