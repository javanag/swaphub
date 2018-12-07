'use strict';
// const listingsContainer = document.querySelector('#listingsContainer');
// const listingBreadcrumb = document.querySelector('#listingBreadcrumb');
// const listingNavLink = document.querySelector('#listingNavLink');
// const categoryDropDown = document.querySelector('#categoryDropDown');
// const searchBar = document.querySelector('#searchBar');
// const searchSubmit = document.querySelector('#searchSubmit');
let currentListing;
let usernameDOM;
let priceDOM;
let dateDOM;
let titleDOM;
let descDOM;
let ppDOM;
let ppTextDOM;
let conditionDOM;
let listingInfo;
let deletedListing;


let admin = false;

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
    //Following just a UI placeholder listing for deleting items
    deletedListing = (new Listing('DELETED', 'travis_pp.jpg', 'DELETED', 'Oct 31, 2018', '0', 'DELETED', 'DELETED', 'yeezy750feet.jpg', 'THIS ITEM HAS BEEN DELETED', 0));
    //Render recent listings pulled from server;
    ppDOM = document.querySelector('#listingProfilePic');
    priceDOM = document.querySelector('#priceTag');
    dateDOM = document.querySelector('#dateText');
    titleDOM = document.querySelector('#itemTitle');
    descDOM = document.querySelector('#itemDescription');
    ppTextDOM = document.querySelector('#profileText');
    conditionDOM = document.querySelector('#itemCondText');
    listingInfo = document.querySelector('#listingInfo');

    let carousel = document.querySelector('#carouselImageArray');
    carousel.querySelectorAll('div')[0].classList.add('active');

    setCondition();
});

// function setDOMListingValues(currentListing) {
//     // setItemDOM(listing)
//     setItemDescriptionDOM(currentListing)
// }

// function setItemDOM(listing) {
// }

/*
function setItemDescriptionDOM() {
    var filepath = "img/"
    profileText.innerText = currentListing.username
    ppDOM.setAttribute("src", filepath + currentListing.profilePicture)
    priceDOM.innerText = '$' + currentListing.price
    dateDOM.innerText = currentListing.date
    descDOM.innerText = currentListing.description
    titleDOM.innerText = currentListing.title

    if(admin){
        const deleteButton = document.createElement('button');
        deleteButton.className = "btn btn-outline-danger w-100";
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", deleteListing);
        listingInfo.appendChild(deleteButton);
    }
    setCondition()
}

function deleteListing(){
    //In this function the client should tell the server which listing
    //to delete from the server side listings database, only when the
    //user has the correct credentials: eg when admin, or the user who
    //oriinally posted the listing.
    const oldTitle = currentListing.title;
    currentListing = deletedListing;
    setItemDescriptionDOM();
    window.alert("Listing: " + oldTitle + " has been deleted.");
    window.location.href = "listings_admin.html";
}
*/

function setCondition(){
    if (conditionDOM.innerText == 'NEW') {
        conditionDOM.setAttribute("class", 'text-success');
    } else if (conditionDOM.innerText == 'USED') {
        conditionDOM.setAttribute("class", 'text-warning');
    } else if (conditionDOM.innerText == 'DAMAGED') {
        conditionDOM.setAttribute("class", 'text-danger');
    }
}
