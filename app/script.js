'use strict';
const listingsContainer = document.querySelector('#listingsContainer');
const displayedListings = [];
const allListings = [];

const Listing = function (username, profilePicture, title, date, price, condition, category, thumbnail, description, likes) {
    this.username = username;
    this.profilePicture = profilePicture;
    this.title = title;
    this.date = date;
    this.price = '$' + price;
    this.condition = condition;
    this.category = category;
    this.thumbnail = thumbnail;
    this.description = description;
    this.likes = likes;
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('HELLO');
    allListings.push(new Listing('laflame92cactus', 'travis_pp.jpg', 'Adidas Yeezy 750 Boost', 'Oct 31, 2018', '2560.56', 'NEW', 'Fashion', 'yeezy750feet.jpg', 'New Yeezy 750 Boost signed by Kanye West. Size 13, comes in box, can provide receipt upon request.', 0));
    allListings.push(new Listing('gaspump2000', 'lilpump_pp.jpg', '(Very Rare) Basketball', 'Oct 27, 2018', '1000000', 'USED', 'Sports', 'basketball.jpeg', 'Ultra rare basketball used and signed by DROSE himself (not pictured). Willing to exchange for another Iced Out Rolex.', 0));
    allListings.push(new Listing('bobbyandnotor', 'logic_pp.jpeg', 'Minecraft PS3 Edition', 'Oct 15, 2018', '12', 'DAMAGED', 'Games', 'minecraft.jpg', 'Minecraft PS3 edition in case. Mild scratches on disk but fully functional.', 0));
    allListings.push(new Listing('laflame92cactus', 'travis_pp.jpg', 'Adidas Yeezy 750 Boost', 'Oct 31, 2018', '2560.56', 'NEW', 'Fashion', 'yeezy750feet.jpg', 'New Yeezy 750 Boost signed by Kanye West. Size 13, comes in box, can provide receipt upon request.', 0));
    allListings.push(new Listing('gaspump2000', 'lilpump_pp.jpg', '(Very Rare) Basketball', 'Oct 27, 2018', '1000000', 'USED', 'Sports', 'basketball.jpeg', 'Ultra rare basketball used and signed by DROSE himself (not pictured). Willing to exchange for another Iced Out Rolex.', 0));
    allListings.push(new Listing('bobbyandnotor', 'logic_pp.jpeg', 'Minecraft PS3 Edition', 'Oct 15, 2018', '12', 'DAMAGED', 'Games', 'minecraft.jpg', 'Minecraft PS3 edition in case. Mild scratches on disk but fully functional.', 0));
    allListings.push(new Listing('laflame92cactus', 'travis_pp.jpg', 'Adidas Yeezy 750 Boost', 'Oct 31, 2018', '2560.56', 'NEW', 'Fashion', 'yeezy750feet.jpg', 'New Yeezy 750 Boost signed by Kanye West. Size 13, comes in box, can provide receipt upon request.', 0));
    allListings.push(new Listing('gaspump2000', 'lilpump_pp.jpg', '(Very Rare) Basketball', 'Oct 27, 2018', '1000000', 'USED', 'Sports', 'basketball.jpeg', 'Ultra rare basketball used and signed by DROSE himself (not pictured). Willing to exchange for another Iced Out Rolex.', 0));
    allListings.push(new Listing('bobbyandnotor', 'logic_pp.jpeg', 'Minecraft PS3 Edition', 'Oct 15, 2018', '12', 'DAMAGED', 'Games', 'minecraft.jpg', 'Minecraft PS3 edition in case. Mild scratches on disk but fully functional.', 0));
    displayListings();
});

function displayListings() {
    for (let i = 0; i < allListings.length; i++) {
        createListingDOM(allListings[i]);
    }
}

function displayListingsQuery(query) {

}

function createListingDOM(listing) {
    const listingElement = document.createElement('div');
    listingElement.classList.add('col-6');
    listingElement.classList.add('col-md-4');
    listingElement.classList.add('col-lg-3');
    listingElement.classList.add('listing');

    const profilePictureContainer = document.createElement('div');
    profilePictureContainer.classList.add('d-inline-block');

    const profilePicture = document.createElement('img');
    profilePicture.setAttribute('width', '40');
    profilePicture.setAttribute('src', 'img/' + listing.profilePicture);
    profilePicture.classList.add('profilePic');

    profilePictureContainer.appendChild(profilePicture);
    listingElement.appendChild(profilePictureContainer);

    const profileInfo = document.createElement('div');
    profileInfo.classList.add('d-inline-block');
    profileInfo.classList.add('align-middle');

    const profileLink = document.createElement('a');
    listingElement.classList.add('profileLink');
    profileLink.setAttribute('href', '#');//TODO:
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
    titleLink.setAttribute('href', '#');//TODO:
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
    price.appendChild(document.createTextNode(listing.price));
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
    image.setAttribute('src', 'img/' + listing.thumbnail);

    imageContainer.appendChild(image);
    listingElement.appendChild(imageContainer);

    const description = document.createElement('div');
    description.classList.add('text-truncate');
    description.appendChild(document.createTextNode(listing.description));

    listingElement.appendChild(description);

    listingsContainer.appendChild(listingElement);
}