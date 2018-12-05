'use strict';

const loginContainer = document.querySelector('#loginContainer');

//copied from userInfo.js:
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
    this.isAdmin = false;
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

//dummy data
//Represents the user database on the server
const userArray = [
    new UserInfo('Chris P.', 'Bacon', 'smokyChris@yomamail.com', 'laflame92cactus', '1234321', 'travis_pp.jpg',),
    new UserInfo('Mike', 'Litoris', 'cameltoe13@zee.com', 'gaspump2000', '1234321', 'lilpump_pp.jpg'),
    new UserInfo('Ben', 'Dover', 'nosoap69@nohomo.com', 'bobbyandnotor', '1234321', 'logic_pp.jpeg',),
];
userArray[1].isAdmin = true;

const userMap = {
    "laflame92cactus": userArray[0],
    "gaspump2000": userArray[1],
    "bobbyandnotor": userArray[2]
};

function displayLoginDOM() {
    const loginForm = document.createElement("form");
    loginForm.id = "login";
    loginForm.setAttribute("method", "post");
    loginForm.setAttribute("action","/users/login");
    loginForm.addEventListener("submit", loginForm.submit);

    const usernameInputContainer = document.createElement("div");
    usernameInputContainer.className = "form-group";
    loginForm.appendChild(usernameInputContainer);

    const usernameInput = document.createElement("input");
    usernameInput.id = "usernameInput";
    usernameInput.setAttribute("name", "username");
    usernameInput.className = "form-control";
    usernameInput.setAttribute("type", "text");
    usernameInput.setAttribute("placeholder", "Username");
    usernameInputContainer.appendChild(usernameInput);

    const passwordInputContainer = document.createElement("div");
    passwordInputContainer.className = "form-group";
    loginForm.appendChild(passwordInputContainer);

    const passwordInput = document.createElement("input");
    passwordInput.id = "passwordInput";
    passwordInput.setAttribute("name", "password");
    passwordInput.className = "form-control";
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("placeholder", "Password");
    passwordInputContainer.appendChild(passwordInput);

    const loginButton = document.createElement("button");
    loginButton.className = "btn btn-primary mt-3";
    loginButton.setAttribute("type", "submit");
    loginButton.innerText = "Login";
    loginForm.appendChild(loginButton);

    loginContainer.appendChild(loginForm);
}

function makeLogin(e) {
    e.preventDefault();
    console.log("Logging in...");

    //The following login an password verification will be done on the server
    const usernameVal = document.querySelector('#usernameInput').value;
    const passwordVal = document.querySelector('#passwordInput').value;
    if (!(usernameVal in userMap))
        window.alert("The entered username: '" + usernameVal + "' Doesn't exist!");
    else {
        if (!userMap[usernameVal].isPasswordMatch(passwordVal)) {
            window.alert("Wrong password!");
        }
        else {
            if (userMap[usernameVal].isAdmin)
                window.location.href = "listings_admin.html#" + usernameVal;
            else
                window.location.href = "listings.html#" + usernameVal;
        }
    }
}