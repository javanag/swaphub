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

function displaySignUpDOM() {

    while (loginContainer.hasChildNodes()) {
        loginContainer.removeChild(loginContainer.lastChild);
    }

    const signupForm = document.createElement("form");
    signupForm.id = "signupForm";
    signupForm.setAttribute("method", "post");
    signupForm.setAttribute("enctype", "multipart/form-data");
    signupForm.setAttribute("action", "/users/signup");
    signupForm.addEventListener("submit", signupForm.submit);

    const firstNameInputContainer = document.createElement("div");
    firstNameInputContainer.className = "form-group";
    signupForm.appendChild(firstNameInputContainer);

    const firstNameInput = document.createElement("input");
    firstNameInput.id = "firstNameInput";
    firstNameInput.required = true;
    firstNameInput.setAttribute("name", "firstName");
    firstNameInput.className = "form-control";
    firstNameInput.setAttribute("type", "text");
    firstNameInput.setAttribute("placeholder", "First name");
    firstNameInputContainer.appendChild(firstNameInput);

    const lastNameInputContainer = document.createElement("div");
    lastNameInputContainer.className = "form-group";
    signupForm.appendChild(lastNameInputContainer);

    const lastNameInput = document.createElement("input");
    lastNameInput.id = "lastNameInput";
    lastNameInput.required = true;
    lastNameInput.setAttribute("name", "lastName");
    lastNameInput.className = "form-control";
    lastNameInput.setAttribute("type", "text");
    lastNameInput.setAttribute("placeholder", "Last name");
    lastNameInputContainer.appendChild(lastNameInput);

    const emailInputContainer = document.createElement("div");
    emailInputContainer.className = "form-group";
    signupForm.appendChild(emailInputContainer);

    const emailInput = document.createElement("input");
    emailInput.id = "emailInput";
    emailInput.required = true;
    emailInput.setAttribute("name", "email");
    emailInput.className = "form-control";
    emailInput.setAttribute("type", "email");
    emailInput.setAttribute("placeholder", "Email");
    emailInputContainer.appendChild(emailInput);

    const usernameInputContainer = document.createElement("div");
    usernameInputContainer.className = "form-group";
    signupForm.appendChild(usernameInputContainer);

    const usernameInput = document.createElement("input");
    usernameInput.id = "usernameInput";
    usernameInput.setAttribute("name", "username");
    usernameInput.className = "form-control";
    usernameInput.setAttribute("type", "text");
    usernameInput.setAttribute("placeholder", "Username");
    usernameInput.required = true;
    usernameInputContainer.appendChild(usernameInput);

    const passwordInputContainer = document.createElement("div");
    passwordInputContainer.className = "form-group";
    signupForm.appendChild(passwordInputContainer);

    const passwordInput = document.createElement("input");
    passwordInput.id = "passwordInput";
    passwordInput.required = true;
    passwordInput.setAttribute("title", "Password length must be above 6 characters!")
    passwordInput.setAttribute("pattern", ".{6,}");
    passwordInput.setAttribute("name", "password");
    passwordInput.className = "form-control";
    passwordInput.setAttribute("type", "password");
    passwordInput.setAttribute("placeholder", "Password");
    passwordInputContainer.appendChild(passwordInput);

    const uploadContainer = document.createElement("div");
    uploadContainer.className = "form-group row mt-4";
    signupForm.appendChild(uploadContainer);

    const profilePicLabel = document.createElement("label");
    profilePicLabel.innerText = "Profile picture:";
    profilePicLabel.className = "col-sm-4 col-form-label font-weight-bold"
    profilePicLabel.setAttribute("for", "profilePic");
    uploadContainer.appendChild(profilePicLabel);

    const tempDiv = document.createElement("div");
    tempDiv.className = "col-sm-7";
    uploadContainer.appendChild(tempDiv)
    const profilePic = document.createElement("input");
    profilePic.id = "profilePic";
    profilePic.required = true;
    profilePic.setAttribute("name", "profilePic");
    profilePic.className = "form-control-file";
    profilePic.setAttribute("type", "file");
    tempDiv.appendChild(profilePic);

    const loginButton = document.createElement("button");
    loginButton.className = "btn btn-primary mt-3";
    loginButton.setAttribute("type", "submit");
    loginButton.innerText = "Sign Up";
    signupForm.appendChild(loginButton);

    const switchToLogin = document.createElement('button');
    switchToLogin.className = "btn btn btn-link mt-5";
    switchToLogin.setAttribute("type", "button");
    switchToLogin.innerText = "Already have an account? Log in";
    switchToLogin.addEventListener("click", displayLoginDOM);

    loginContainer.appendChild(signupForm);
    loginContainer.appendChild(switchToLogin);
}

function displayLoginDOM() {
    while (loginContainer.hasChildNodes()) {
        loginContainer.removeChild(loginContainer.lastChild);
    }

    const loginForm = document.createElement("form");
    loginForm.id = "login";
    loginForm.setAttribute("method", "post");
    loginForm.setAttribute("action", "/users/login");
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

    const switchToSignUp = document.createElement('button');
    switchToSignUp.className = "btn btn btn-link mt-5";
    switchToSignUp.setAttribute("type", "button");
    switchToSignUp.innerText = "Don't have an account? Sign up";
    switchToSignUp.addEventListener("click", displaySignUpDOM);

    loginContainer.appendChild(loginForm);
    loginContainer.appendChild(switchToSignUp);
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
        } else {
            if (userMap[usernameVal].isAdmin)
                window.location.href = "listings_admin.html#" + usernameVal;
            else
                window.location.href = "listings.html#" + usernameVal;
        }
    }
}
