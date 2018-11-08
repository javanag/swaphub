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
        return sum / (this.userReviews.length + 1);
    };

UserInfo.prototype.isPasswordMatch =
    function (inputPwd) {
        return inputPwd == this.password;
    };
// end of UserInfo default functions.

const userArray = [
    new UserInfo('Chris P.', 'Bacon', 'smokyChris@yomamail.com', 'laflame92cactus', '1234321', 'travis_pp.jpg',),
    new UserInfo('Mike', 'Litoris', 'cameltoe13@zee.com', 'gaspump2000', '1234321', 'lilpump_pp.jpg'),
    new UserInfo('Ben', 'Dover', 'nosoap69@nohomo.com', 'bobbyandnotor', '1234321', 'logic_pp.jpeg',),
];

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
    fieldKeys.className = 'd-inline-block align-middle font-weight-bold';
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



};


createProfileView(userArray[0]);