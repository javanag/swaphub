'use strict';

const userInfoContainer = document.querySelector('#userInfoContainer');

//Review Object
function Review(writerUser, subjectUser, subjectListing, overallRating, text) {
    this.writer = writerUser;
    this.reviewedUser = subjectUser;
    this.reviewedListing = subjectListing;
    this.overallRating = overallRating;
    this.reviewText = text;
}

// User Info. object
function UserInfo(firstName, lastName, email, userName,
                  password, profilePic) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.userName = userName;
    this.password = password;
    this.profilePic = profilePic;
    this.userListings = [];
    this.userReviews = [];
}

// UserInfo default functions:
UserInfo.prototype.addReview =
    function (writerUser, subjectListing, overallRating, text) {
        const newReview = new Review(writerUser, this,
            subjectListing, overallRating, text);
        this.userReviews.push(newReview);
        return newReview;
    };

UserInfo.prototype.addListing =
    function (title, date, price, condition, category,
              thumbnail, description, likes) {
        const newListing = new Listing(
            this.userName, this.profilePic, title, date,
            price, condition, category,
            thumbnail, description, likes);
        this.userListings.push(newListing);
        return newListing;
    };

UserInfo.prototype.userRate =
    function () {
        let sum = 0;
        for (let i = 0; i < this.userReviews.length; i++) {
            sum += this.userReviews[i].overallRating;
        }
        return sum / (this.userReviews.length);
    };

UserInfo.prototype.isPasswordMatch =
    function (inputPwd) {
        return inputPwd == this.password;
    };
// end of UserInfo default functions.


//copied from script.js
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
};

//dummy data
const userArray = [
    new UserInfo('Chris P.', 'Bacon', 'smokyChris@yomamail.com', 'laflame92cactus', '1234321', 'travis_pp.jpg',),
    new UserInfo('Mike', 'Litoris', 'cameltoe13@zee.com', 'gaspump2000', '1234321', 'lilpump_pp.jpg'),
    new UserInfo('Ben', 'Dover', 'nosoap69@nohomo.com', 'bobbyandnotor', '1234321', 'logic_pp.jpeg',),
];

const allListings = [
    new Listing('laflame92cactus', 'travis_pp.jpg', 'Adidas Yeezy 750 Boost', 'Oct 31, 2018', '2560.56', 'NEW', 'Fashion', 'yeezy750feet.jpg', 'New Yeezy 750 Boost signed by Kanye West. Size 13, comes in box, can provide receipt upon request.', 0),
    new Listing('gaspump2000', 'lilpump_pp.jpg', '(Very Rare) Basketball', 'Oct 27, 2018', '1000000', 'USED', 'Sports', 'basketball.jpeg', 'Ultra rare basketball used and signed by DROSE himself (not pictured). Willing to exchange for another Iced Out Rolex.', 0),
    new Listing('bobbyandnotor', 'logic_pp.jpeg', 'Minecraft PS3 Edition', 'Oct 15, 2018', '12', 'DAMAGED', 'Games', 'minecraft.jpg', 'Minecraft PS3 edition in case. Mild scratches on disk but fully functional.', 0),
    new Listing('bobbyandnotor', 'logic_pp.jpeg', 'Vintage Crime and Punishment', 'Oct 25, 2018', '40', 'USED', 'Books', 'dosto.png', 'My grandma gave me this ultra rare masterpiece.', 0),
    new Listing('laflame92cactus', 'travis_pp.jpg', '[SALE] My Mixtape', 'Oct 24, 2018', '10', 'NEW', 'Music', 'astroworld.jpg', 'Please everybody buy my tape I swear it\'s fire.', 0),
    new Listing('gaspump2000', 'lilpump_pp.jpg', 'BEST Aloe Plant', 'Oct 15, 2018', '5', 'USED', 'Plants & Animals', 'aloe.jpg', 'I usually only grow other types of plants, I\'ll let this go cheap.', 0),
    new Listing('bobbyandnotor', 'logic_pp.jpeg', '(Almost) New Ferrari!', 'Oct 10, 2018', '97000', 'USED', 'Vehicles', 'whip.jpeg', 'This is the fastest on the track hands down!', 0),
    new Listing('laflame92cactus', 'travis_pp.jpg', 'Broken Sunbeam Toaster', 'Sep 29, 2018', '2', 'DAMAGED', 'Furniture & Appliance', 'toaster.jpeg', 'For parts (bread not included, stop asking)', 0),
];

//each listing to its owner
for (let i = 0; i < allListings.length; i++) {
    let tempItem = allListings[i];
    for (let j = 0; j < userArray.length; j++) {
        if (tempItem.username == userArray[j].userName) {
            userArray[j].userListings.push(tempItem);
        }
    }
}

//create random reviews
for (let j = 0; j < 2; j++) {
    for (let i = 0; i < userArray.length; i++) {
        let randWriter = userArray[Math.floor(Math.random() * 3)];
        let randItem = Math.floor(Math.random() * userArray[i].userListings.length);
        let randRate = Math.floor(Math.random() * 11) / 2.0;
        userArray[i].addReview(randWriter, userArray[i].userListings[randItem], randRate,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
    }
}
// end of dummy data

//creates user's profile
function createProfileView(userInfo) {
    const profileElement = document.createElement('div');
    profileElement.className = "row";
    userInfoContainer.appendChild(profileElement);

    const profilePictureContainer = document.createElement('div');
    profilePictureContainer.className = 'd-inline-block';
    profileElement.appendChild(profilePictureContainer);

    const profilePicture = document.createElement('img');
    profilePicture.setAttribute('width', '150');
    profilePicture.setAttribute('src', 'img/' + userInfo.profilePic);
    profilePicture.classList.add('profilePic');
    profilePictureContainer.appendChild(profilePicture);

    const userName = document.createElement('div');
    userName.className = "text-muted text-center ";
    userName.appendChild(document.createTextNode(userInfo.userName));
    profilePictureContainer.appendChild(userName);

    const profileInfo = document.createElement('div');
    profileInfo.className = 'd-inline-block align-self-center ml-5';
    profileElement.appendChild(profileInfo);

    const fieldKeys = document.createElement('div');
    fieldKeys.className = 'd-inline-block align-middle text-right font-weight-bold';
    profileInfo.appendChild(fieldKeys);

    const fieldValues = document.createElement('div');
    fieldValues.className = 'd-inline-block align-middle ml-3';
    profileInfo.appendChild(fieldValues);

    const firstName = document.createElement('div');
    firstName.innerText = "First Name:";
    fieldKeys.appendChild(firstName);

    const firstNameVal = document.createElement('div');
    firstNameVal.innerText = userInfo.firstName;
    fieldValues.appendChild(firstNameVal);

    const lastName = document.createElement('div');
    lastName.innerText = "Last Name:";
    fieldKeys.appendChild(lastName);

    const lastNameVal = document.createElement('div');
    lastNameVal.innerText = userInfo.lastName;
    fieldValues.appendChild(lastNameVal);

    const email = document.createElement('div');
    email.innerText = "E-mail:";
    fieldKeys.appendChild(email);

    const emailVal = document.createElement('div');
    emailVal.innerText = userInfo.email;
    fieldValues.appendChild(emailVal);

    const rating = document.createElement('div');
    rating.innerText = "Rating:";
    fieldKeys.appendChild(rating);

    const ratingVal = document.createElement('div');
    ratingVal.innerText = userInfo.userRate();
    fieldValues.appendChild(ratingVal);

}


//display user's listings
function displayUserListings(userListings) {
    const listingsElement = document.createElement('div');
    listingsElement.className = "row";
    const listingTextNode = document.createElement('div');
    listingTextNode.className = "row mt-5";
    listingTextNode.innerHTML = "<h3>Listings:</h3>";
    userInfoContainer.appendChild(listingTextNode);
    userInfoContainer.appendChild(listingsElement);

    for (let i = 0; i < userListings.length; i++) {
        const element = createListingDOM(userListings[i]);
        listingsElement.appendChild(element);
    }
}

//copied from script.js
function createListingDOM(listing) {
    const listingElement = document.createElement('div');
    listingElement.classList.add('col-6');
    listingElement.classList.add('col-md-4');
    listingElement.classList.add('col-lg-3');
    listingElement.classList.add('listing');
    listingElement.classList.add('rounded');
    
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
    image.setAttribute('src', 'img/' + listing.thumbnail);

    const imageLinkToListing = document.createElement('a');
    imageLinkToListing.setAttribute('href', '#');//TODO:
    imageLinkToListing.appendChild(image);

    imageContainer.appendChild(imageLinkToListing);
    listingElement.appendChild(imageContainer);

    const description = document.createElement('div');
    description.classList.add('text-truncate');
    description.appendChild(document.createTextNode(listing.description));

    listingElement.appendChild(description);
    return listingElement;
}


//display user's Reviews:
function displayUserReviews(userReviews) {
    const reviewsElement = document.createElement('div');
    reviewsElement.className = "row";
    const reviewTextNode = document.createElement('div');
    reviewTextNode.className = "row mt-3";
    reviewTextNode.innerHTML = "<h3>Reviews:</h3>";
    userInfoContainer.appendChild(reviewTextNode);
    userInfoContainer.appendChild(reviewsElement);

    for (let i = 0; i < userReviews.length; i++) {
        const element = createReviewDOM(userReviews[i]);
        reviewsElement.appendChild(element);
        console.log(i, userReviews[i]);
    }
}

function createReviewDOM(review) {
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('col-6');
    reviewElement.classList.add('col-md-4');
    reviewElement.classList.add('col-lg-3');
    reviewElement.classList.add('listing');
    reviewElement.classList.add('rounded');

    const profilePictureContainer = document.createElement('div');
    profilePictureContainer.classList.add('d-inline-block');

    const profilePicture = document.createElement('img');
    profilePicture.setAttribute('width', '32');
    profilePicture.setAttribute('src', 'img/' + review.writer.profilePic);
    profilePicture.classList.add('profilePic');

    profilePictureContainer.appendChild(profilePicture);
    reviewElement.appendChild(profilePictureContainer);

    const profileInfo = document.createElement('div');
    profileInfo.classList.add('d-inline-block');
    profileInfo.classList.add('align-middle');

    const profileLink = document.createElement('a');
    reviewElement.classList.add('profileLink');
    profileLink.setAttribute('href', '#');//TODO:
    profileLink.appendChild(document.createTextNode(review.writer.userName));
    profileInfo.appendChild(profileLink);
    reviewElement.appendChild(profileInfo);

    const reviewText = document.createElement('div');
    reviewText.classList.add('text-truncate');
    reviewText.appendChild(document.createTextNode(review.reviewText));
    reviewElement.appendChild(reviewText);

    const reviewRank = document.createElement('div');
    const rankText = document.createElement("span");
    rankText.className = "font-weight-bold";
    rankText.innerText = "Overall rating: ";
    reviewRank.appendChild(rankText);
    reviewRank.appendChild(document.createTextNode(review.overallRating));
    reviewElement.appendChild(reviewRank)

    return reviewElement;
}


//randomizing for fun
let randomUser = userArray[Math.floor(Math.random() * 3)];
createProfileView(randomUser);
displayUserListings(randomUser.userListings);
displayUserReviews(randomUser.userReviews);