'use strict';
const listingsContainer = document.querySelector('#listingsContainer');
const listingBreadcrumb = document.querySelector('#listingBreadcrumb');
const listingNavLink = document.querySelector('#listingNavLink');
const categoryDropDown = document.querySelector('#categoryDropDown');
const searchBar = document.querySelector('#searchBar');
const searchSubmit = document.querySelector('#searchSubmit');

let adminMode = false;

function setAdminMode(mode){
    adminMode = mode;
}

//Represents the database of all listings on the server
//Pared down for simplicity
const allListings = [];

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
    allListings.push(new Listing('laflame92cactus', 'travis_pp.jpg', 'Adidas Yeezy 750 Boost', 'Oct 31, 2018', '2560.56', 'NEW', 'Fashion', 'yeezy750feet.jpg', 'New Yeezy 750 Boost signed by Kanye West. Size 13, comes in box, can provide receipt upon request.', 0));
    //allListings.push(new Listing('gaspump2000', 'lilpump_pp.jpg', '(Very Rare) Basketball', 'Oct 27, 2018', '1000000', 'USED', 'Sports', 'basketball.jpeg', 'Ultra rare basketball used and signed by DROSE himself (not pictured). Willing to exchange for another Iced Out Rolex.', 0));
    //allListings.push(new Listing('bobbyandnotor', 'logic_pp.jpeg', 'Minecraft PS3 Edition', 'Oct 15, 2018', '12', 'DAMAGED', 'Games', 'minecraft.jpg', 'Minecraft PS3 edition in case. Mild scratches on disk but fully functional.', 0));
    //allListings.push(new Listing('bobbyandnotor', 'logic_pp.jpeg', 'Vintage Crime and Punishment', 'Oct 25, 2018', '40', 'USED', 'Books', 'dosto.png', 'My grandma gave me this ultra rare masterpiece.', 0));
    //allListings.push(new Listing('laflame92cactus', 'travis_pp.jpg', '[SALE] My Mixtape', 'Oct 24, 2018', '10', 'NEW', 'Music', 'astroworld.jpg', 'Please everybody buy my tape I swear it\'s fire.', 0));
    //allListings.push(new Listing('gaspump2000', 'lilpump_pp.jpg', 'BEST Aloe Plant', 'Oct 15, 2018', '5', 'USED', 'Plants & Animals', 'aloe.jpg', 'I usually only grow other types of plants, I\'ll let this go cheap.', 0));
    //allListings.push(new Listing('bobbyandnotor', 'logic_pp.jpeg', '(Almost) New Ferrari!', 'Oct 10, 2018', '97000', 'USED', 'Vehicles', 'whip.jpeg', 'This is the fastest on the track hands down!', 0));
    //allListings.push(new Listing('laflame92cactus', 'travis_pp.jpg', 'Broken Sunbeam Toaster', 'Sep 29, 2018', '2', 'DAMAGED', 'Furniture & Appliance', 'toaster.jpeg', 'For parts (bread not included, stop asking)', 0));
    //Render recent listings pulled from server;
    displayAllListings();
});

listingNavLink.addEventListener('click', resetListingView);
listingBreadcrumb.querySelector('#breadcrumbAnchor').addEventListener('click', resetListingView);

function resetListingView() {
    clearAllDisplayedListings();
    displayAllListings();
    popListingBreadCrumb();
}

function displayAllListings() {
    for (let i = 0; i < allListings.length; i++) {
        const element = createListingDOM(allListings[i]);
        listingsContainer.appendChild(element);
    }
}

searchSubmit.addEventListener('click', function () {
    event.preventDefault();
    const queryString = searchBar.value.toLowerCase().trim();
    if (queryString.length > 0) {
        searchBar.value = '';
        clearAllDisplayedListings();
        const resultCount = filterListingsByQuery(queryString);
        pushListingBreadCrumb('Searching for \"' + queryString + '\"', resultCount);
    }
});

categoryDropDown.addEventListener('click', filterListingsByCategory);

//This will behave like a select where statement from the server side
//listing database
function filterListingsByCategory(e) {
    const allCategories = categoryDropDown.querySelectorAll('.dropdown-item');
    const trigger = e.target;
    let category = undefined;
    let resultCount = 0;
    for (let i = 0; i < allCategories.length; i++) {
        if (trigger.textContent == allCategories[i].textContent) {
            category = trigger.textContent;
            break;
        }
    }
    if (category != undefined) {
        clearAllDisplayedListings();
        //This section represents loading all listings from "server" that match
        //the corresponding category type
        for (let i = 0; i < allListings.length; i++) {
            if (allListings[i].category == category) {
                resultCount++;
                const element = createListingDOM(allListings[i]);
                listingsContainer.appendChild(element);
            }
        }
        pushListingBreadCrumb(category, resultCount);
    }
}

function clearAllDisplayedListings() {
    while (listingsContainer.firstChild) {
        listingsContainer.removeChild(listingsContainer.firstChild);
    }
}

function filterListingsByQuery(queryString) {
    let resultCount = 0;
    for (let i = 0; i < allListings.length; i++) {
        //Very rudimentary search, just find at least one keyword in key strings.
        //This section represents loading all listings from "server" that match
        //the corresponding search query
        if (allListings[i].category.toLowerCase().indexOf(queryString) >= 0 || allListings[i].title.toLowerCase().indexOf(queryString) >= 0 || allListings[i].description.toLowerCase().indexOf(queryString) >= 0 || allListings[i].username.toLowerCase().indexOf(queryString) >= 0) {
            const element = createListingDOM(allListings[i]);
            resultCount++;
            listingsContainer.appendChild(element);
        }
    }
    return resultCount;
}

function createListingDOM(listing) {
    const listingElement = document.createElement('div');
    listingElement.classList.add('col-6');
    listingElement.classList.add('col-md-4');
    listingElement.classList.add('col-lg-3');
    listingElement.classList.add('listing');
    listingElement.classList.add('rounded');

    const profilePictureContainer = document.createElement('div');
    profilePictureContainer.classList.add('d-inline-block');

    const profilePicture = document.createElement('img');
    profilePicture.setAttribute('width', '32');
    profilePicture.setAttribute('src', '/public/app/img/' + listing.profilePicture);
    profilePicture.classList.add('profilePic');

    profilePictureContainer.appendChild(profilePicture);
    listingElement.appendChild(profilePictureContainer);

    const profileInfo = document.createElement('div');
    profileInfo.classList.add('d-inline-block');
    profileInfo.classList.add('align-middle');

    const profileLink = document.createElement('a');
    listingElement.classList.add('profileLink');
    if(adminMode){
        profileLink.setAttribute('href', 'profile_admin.html#'+listing.username);//TODO:
    }else{
        profileLink.setAttribute('href', 'profile.html#'+listing.username);//TODO:
    }
    profileLink.appendChild(document.createTextNode(listing.username));

    const date = document.createElement('div');
    date.classList.add('text-muted');
    date.appendChild(document.createTextNode(listing.date));

    profileInfo.appendChild(profileLink);
    profileInfo.appendChild(date);
    listingElement.appendChild(profileInfo);

    const title = document.createElement('div');
    title.classList.add('text-center');

    const titleLink = document.createElement('a');
    if(adminMode){
        titleLink.setAttribute('href', '/public/app/yeezyListing_admin.html');//TODO:
    }else{
        titleLink.setAttribute('href', '/public/app/yeezyListing.html');//TODO:
    }
    titleLink.classList.add('listingTitleLink');

    const titleLinkH5 = document.createElement('h5');
    titleLinkH5.classList.add('text-truncate');
    titleLinkH5.appendChild(document.createTextNode(listing.title));

    titleLink.appendChild(titleLinkH5);
    title.appendChild(titleLink);
    listingElement.appendChild(title);

    const details = document.createElement('div');
    details.classList.add('text-center');

    const detailsUl = document.createElement('ul');
    detailsUl.classList.add('listingDetails');

    const price = document.createElement('li');
    price.classList.add('font-weight-bold');
    price.appendChild(document.createTextNode('$' + listing.price));
    const condition = document.createElement('li');
    condition.appendChild(document.createTextNode(listing.condition));
    if (listing.condition == 'NEW') {
        condition.classList.add('text-success');
    } else if (listing.condition == 'USED') {
        condition.classList.add('text-warning');
    } else if (listing.condition == 'DAMAGED') {
        condition.classList.add('text-danger');
    }
    const category = document.createElement('li');
    category.appendChild(document.createTextNode('in '));
    const categoryLink = document.createElement('a');
    categoryLink.appendChild(document.createTextNode(listing.category));
    categoryLink.setAttribute('href', '#');//TODO:
    category.appendChild(categoryLink);

    detailsUl.appendChild(price);
    detailsUl.appendChild(condition);
    detailsUl.appendChild(category);

    details.appendChild(detailsUl);
    listingElement.appendChild(details);

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('text-center');
    imageContainer.classList.add('listingImageContainer');
    imageContainer.classList.add('align-middle');

    const image = document.createElement('img');
    image.classList.add('listingImage');
    image.setAttribute('src', '/public/app/img/' + listing.thumbnail);

    const imageLinkToListing = document.createElement('a');
    imageLinkToListing.setAttribute('href', '#');//TODO:
    imageLinkToListing.appendChild(image);

    imageContainer.appendChild(imageLinkToListing);
    listingElement.appendChild(imageContainer);

    const description = document.createElement('div');
    description.classList.add('text-truncate');
    description.appendChild(document.createTextNode(listing.description));

    listingElement.appendChild(description);

    const deleteButton = document.createElement('button');
    deleteButton.className = "btn btn-outline-danger w-100";
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", deleteListing);

    if(adminMode){
        listingElement.appendChild(deleteButton);
    }

    return listingElement;
}

function deleteListing(e){
    const listing = e.target.parentNode;
    for(let i = 0; i < allListings.length; i++){
        if(allListings[i].title == listing.querySelector('h5').textContent){
            allListings.splice(i);
            break;
        }
    }
    listingsContainer.removeChild(e.target.parentNode);
}

function pushListingBreadCrumb(navigationText, resultCount) {
    popListingBreadCrumb();
    const recentListings = listingBreadcrumb.querySelector('#breadcrumbAnchor');
    recentListings.classList.remove('active');
    recentListings.removeChild(recentListings.firstChild);
    const recentListingsLink = document.createElement('a');
    recentListingsLink.setAttribute('href', '#');//TODO:
    recentListingsLink.appendChild(document.createTextNode('Recent Listings'));

    recentListings.appendChild(recentListingsLink);

    const newBreadCrumb = document.createElement('li');
    newBreadCrumb.classList.add('breadcrumb-item');
    newBreadCrumb.classList.add('active');
    let resultString = '';
    if(resultCount <= 0){
        resultString = ' (' + 'No results' + ')';
    }else if(resultCount == 1){
        resultString = ' (' + resultCount + ' result' + ')';
    }else if(resultCount > 1){
        resultString = ' (' + resultCount + ' results' + ')';
    }
    newBreadCrumb.appendChild(document.createTextNode(navigationText + resultString));
    listingBreadcrumb.appendChild(newBreadCrumb);
}

function popListingBreadCrumb() {
    if (listingBreadcrumb.childNodes.length > 2) {
        listingBreadcrumb.removeChild(listingBreadcrumb.lastChild);

        const recentListings = listingBreadcrumb.querySelector('#breadcrumbAnchor');
        recentListings.classList.add('active');
        recentListings.removeChild(recentListings.firstChild);
        recentListings.appendChild(document.createTextNode('Recent Listings'));
    }
}
