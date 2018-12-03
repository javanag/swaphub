'use strict';
let admin = false;

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


//dummy data, which represents the user database on the server.
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

//represents the database of listings on the server
const allListings = [
    new Listing('laflame92cactus', 'travis_pp.jpg', 'Adidas Yeezy 750 Boost', 'Oct 31, 2018', '2560.56', 'NEW', 'Fashion', 'yeezy750feet.jpg', 'New Yeezy 750 Boost signed by Kanye West. Size 13, comes in box, can provide receipt upon request.', 0),
    //new Listing('gaspump2000', 'lilpump_pp.jpg', '(Very Rare) Basketball', 'Oct 27, 2018', '1000000', 'USED', 'Sports', 'basketball.jpeg', 'Ultra rare basketball used and signed by DROSE himself (not pictured). Willing to exchange for another Iced Out Rolex.', 0),
    //new Listing('bobbyandnotor', 'logic_pp.jpeg', 'Minecraft PS3 Edition', 'Oct 15, 2018', '12', 'DAMAGED', 'Games', 'minecraft.jpg', 'Minecraft PS3 edition in case. Mild scratches on disk but fully functional.', 0),
    //new Listing('bobbyandnotor', 'logic_pp.jpeg', 'Vintage Crime and Punishment', 'Oct 25, 2018', '40', 'USED', 'Books', 'dosto.png', 'My grandma gave me this ultra rare masterpiece.', 0),
    //new Listing('laflame92cactus', 'travis_pp.jpg', '[SALE] My Mixtape', 'Oct 24, 2018', '10', 'NEW', 'Music', 'astroworld.jpg', 'Please everybody buy my tape I swear it\'s fire.', 0),
    //new Listing('gaspump2000', 'lilpump_pp.jpg', 'BEST Aloe Plant', 'Oct 15, 2018', '5', 'USED', 'Plants & Animals', 'aloe.jpg', 'I usually only grow other types of plants, I\'ll let this go cheap.', 0),
    //new Listing('bobbyandnotor', 'logic_pp.jpeg', '(Almost) New Ferrari!', 'Oct 10, 2018', '97000', 'USED', 'Vehicles', 'whip.jpeg', 'This is the fastest on the track hands down!', 0),
    //new Listing('laflame92cactus', 'travis_pp.jpg', 'Broken Sunbeam Toaster', 'Sep 29, 2018', '2', 'DAMAGED', 'Furniture & Appliance', 'toaster.jpeg', 'For parts (bread not included, stop asking)', 0),
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

const addContainer = document.querySelector("#addContainer");

function displayAddDOM(username) {
    console.log("Displaying add form...");
    const addForm = document.createElement("form");
    addForm.id = "addForm";
    addForm.addEventListener("submit", addItem);
    addContainer.appendChild(addForm);

    const formTitle = document.createElement("h3");
    formTitle.innerText = "Add listing:";
    formTitle.className = "mb-4 font-weight-bold";
    addForm.appendChild(formTitle);

    const titleContainer = document.createElement("div");
    titleContainer.className = "form-group";
    addForm.appendChild(titleContainer);

    const listingTitle = document.createElement("input");
    listingTitle.id = "listingTitle";
    listingTitle.className = "form-control";
    listingTitle.setAttribute("type", "text");
    listingTitle.setAttribute("placeholder", "Listing title");
    titleContainer.appendChild(listingTitle);

    const priceContainer = document.createElement("div");
    priceContainer.className = "form-group";
    addForm.appendChild(priceContainer);

    const listingPrice = document.createElement("input");
    listingPrice.id = "listingPrice";
    listingPrice.className = "form-control";
    listingPrice.setAttribute("type", "text");
    listingPrice.setAttribute("placeholder", "Listing price");
    priceContainer.appendChild(listingPrice);

    const conditionContainer = document.createElement("div");
    conditionContainer.className = "form-group";
    addForm.appendChild(conditionContainer);

    const listingCondition = document.createElement("input");
    listingCondition.id = "listingCondition";
    listingCondition.className = "form-control";
    listingCondition.setAttribute("type", "text");
    listingCondition.setAttribute("placeholder", "Listing condition");
    conditionContainer.appendChild(listingCondition);

    const descriptionContainer = document.createElement("div");
    descriptionContainer.className = "form-group";
    addForm.appendChild(descriptionContainer);

    const listingDescription = document.createElement("textarea");
    listingDescription.id = "listingDescription";
    listingDescription.className = "form-control";
    listingDescription.setAttribute("rows", "3");
    listingDescription.setAttribute("placeholder", "Listing description");
    descriptionContainer.appendChild(listingDescription);

    const uploadContainer = document.createElement("div");
    uploadContainer.className = "form-group row mt-4";
    addForm.appendChild(uploadContainer);

    const listingLabel = document.createElement("label");
    listingLabel.innerText = "Listing image:";
    listingLabel.className = "col-sm-4 col-form-label font-weight-bold"
    listingLabel.setAttribute("for", "listingImage");
    uploadContainer.appendChild(listingLabel);

    const tempDiv = document.createElement("div");
    tempDiv.className = "col-sm-7";
    uploadContainer.appendChild(tempDiv)
    const listingImage = document.createElement("input");
    listingImage.id = "listingImage";
    listingImage.className = "form-control-file";
    listingImage.setAttribute("type", "file");
    // listingImage.setAttribute("placeholder", "Listing image");
    tempDiv.appendChild(listingImage);

    const addButton = document.createElement("button");
    addButton.className = "btn btn-success btn-block btn-lg mt-3";
    addButton.setAttribute("type", "submit");
    addButton.innerText = "Add!";
    addForm.appendChild(addButton);

}

function addItem(e) {
    e.preventDefault();
    /*
    const myForm = document.forms["addForm"].elements;
    for (let i = 0; i < myForm.length; i++){
        if (myForm[i].value == "")
            alert("All fields required!");
    }
    */
    const myForm = document.forms["addForm"];
    const fields = myForm.querySelectorAll('input');
    const textArea = myForm.querySelector('textarea');
    let filled = true;
    if (textArea.value == ""){
            alert("All fields required!");
            filled = false;
    }else{
        for (let i = 0; i < fields.length; i++){
            if (fields[i].value == ""){
                alert("All fields required!");
                filled = false;
                break;
            }
        }
    }
    if(filled){
        alert("Successfully added new listing.");
        //At this point the client will send the info for the new listing
        //to the server, and when redirected to listings.html they should see it.
        if(admin){
            window.location.href = "listings_admin.html";
        }else{
            window.location.href = "listings.html";
        }
    }
}