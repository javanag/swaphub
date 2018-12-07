'use strict';
const listingsContainer = document.querySelector('#listingsContainer');
const listingBreadcrumb = document.querySelector('#listingBreadcrumb');
const listingNavLink = document.querySelector('#listingNavLink');
const categoryDropDown = document.querySelector('#categoryDropDown');
const searchBar = document.querySelector('#searchBar');
const searchSubmit = document.querySelector('#searchSubmit');

let adminMode = false;

function setAdminMode(mode) {
    adminMode = mode;
}

//Represents the database of all listings on the server
//Pared down for simplicity


let allListings = []

const fetchAllListings = () => {
    return fetch("/api/listings").then(res => res.json())
        .then(obj => {
            allListings = obj;
            return obj;
        })
}

document.addEventListener('DOMContentLoaded', function () {
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
    fetchAllListings().then((allList) => {
        for (let i = 0; i < allList.length; i++) {
            const element = createListingDOM(allList[i]);
            listingsContainer.appendChild(element);
        }
    })

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
    listingElement.id = listing._id;
    listingElement.classList.add('col-6');
    listingElement.classList.add('col-md-4');
    listingElement.classList.add('col-lg-3');
    listingElement.classList.add('listing');
    listingElement.classList.add('rounded');

    const profilePictureContainer = document.createElement('div');
    profilePictureContainer.classList.add('d-inline-block');
    //Find listing's user:
    fetch("/users/" + listing.username).then(res => res.json())
        .then(user => {
            profilePicture.setAttribute('src', user.profilePic);
        })
    const profilePicture = document.createElement('img');
    profilePicture.setAttribute('width', '32');

    profilePicture.classList.add('profilePic');

    profilePictureContainer.appendChild(profilePicture);
    listingElement.appendChild(profilePictureContainer);

    const profileInfo = document.createElement('div');
    profileInfo.classList.add('d-inline-block');
    profileInfo.classList.add('align-middle');

    const profileLink = document.createElement('a');
    listingElement.classList.add('profileLink');
    if (adminMode) {
        profileLink.setAttribute('href', 'profile_admin.html#' + listing.username);//TODO:
    } else {
        profileLink.setAttribute('href', 'profile.html#' + listing.username);//TODO:
    }
    profileLink.appendChild(document.createTextNode(listing.username));

    const date = document.createElement('div');
    date.classList.add('text-muted');
    date.appendChild(document.createTextNode(new Date(listing.date).toDateString()));

    profileInfo.appendChild(profileLink);
    profileInfo.appendChild(date);
    listingElement.appendChild(profileInfo);

    const title = document.createElement('div');
    title.classList.add('text-center');

    const titleLink = document.createElement('a');
    titleLink.setAttribute('href', '/listings/' + listing._id);//TODO:
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
    image.setAttribute('src', listing.thumbnail);

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

    if (adminMode) {
        listingElement.appendChild(deleteButton);
    }

    return listingElement;
}

function deleteListing(e) {
    const listingEle = e.target.parentNode;
    fetch("/api/listings/" + listingEle.id,
        {method: 'delete'})
        .then(listing => {
            console.log("Deleted: " + listingEle.id);
            fetchAllListings();
            listingsContainer.removeChild(e.target.parentNode);
        })
        .catch((error) => {
            res.status(400).send(error)
        })
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
    if (resultCount <= 0) {
        resultString = ' (' + 'No results' + ')';
    } else if (resultCount == 1) {
        resultString = ' (' + resultCount + ' result' + ')';
    } else if (resultCount > 1) {
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
