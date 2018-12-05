'use strict';

const addContainer = document.querySelector("#addContainer");

function displayAddDOM() {
    console.log("Displaying add form...");
    const addForm = document.createElement("form");
    addForm.id = "addForm";
    addForm.setAttribute("method", "post");
    addForm.setAttribute("action", "/listings");
    // addForm.setAttribute("onsubmit", "validateForm")
    // addForm.addEventListener("submit", addForm.submit);
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
    listingTitle.setAttribute("name", "title");
    listingTitle.className = "form-control";
    listingTitle.setAttribute("type", "text");
    listingTitle.setAttribute("placeholder", "Listing title");
    titleContainer.appendChild(listingTitle);

    const priceContainer = document.createElement("div");
    priceContainer.className = "form-group";
    addForm.appendChild(priceContainer);

    const listingPrice = document.createElement("input");
    listingPrice.id = "listingPrice";
    listingPrice.setAttribute("name", "price");
    listingPrice.className = "form-control";
    listingPrice.setAttribute("type", "number");
    listingPrice.setAttribute("step", "0.01");
    listingPrice.setAttribute("placeholder", "Listing price");
    priceContainer.appendChild(listingPrice);

    const conditionContainer = document.createElement("div");
    conditionContainer.className = "form-group";
    addForm.appendChild(conditionContainer);

    const listingCondition = document.createElement("input");
    listingCondition.id = "listingCondition";
    listingCondition.setAttribute("name", "condition");
    listingCondition.className = "form-control";
    listingCondition.setAttribute("type", "text");
    listingCondition.setAttribute("placeholder", "Listing condition");
    conditionContainer.appendChild(listingCondition);

    const categoryContainer = document.createElement("div");
    categoryContainer.className = "form-group";
    addForm.appendChild(categoryContainer);

    const listingCategory = document.createElement("select");
    listingCategory.id = "listingCategory";
    listingCategory.setAttribute("name", "category");
    listingCategory.className = "form-control";
    const categories = ["Books", "Electronics", "Fashion", "Films & Photography", "Furniture & Appliance", "Games", "Music", "Plants & Animals", "Sports", "Vehicles", "Miscellaneous"];
    categories.forEach((cat) => {
        const optionEle = document.createElement("option");
        optionEle.setAttribute("value", cat);
        optionEle.innerText = cat;
        listingCategory.appendChild(optionEle);
    })

    categoryContainer.appendChild(listingCategory);

    const descriptionContainer = document.createElement("div");
    descriptionContainer.className = "form-group";
    addForm.appendChild(descriptionContainer);

    const listingDescription = document.createElement("textarea");
    listingDescription.id = "listingDescription";
    listingDescription.setAttribute("name", "description");
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
    listingImage.setAttribute("name", "thumbnail");
    listingImage.className = "form-control-file";
    listingImage.setAttribute("type", "file");
    tempDiv.appendChild(listingImage);

    const addButton = document.createElement("button");
    addButton.className = "btn btn-success btn-block btn-lg mt-3";
    addButton.setAttribute("type", "submit");
    addButton.innerText = "Add!";
    addForm.appendChild(addButton);

}
//Waits for the DOM to be loaded and then add the attribute
document.addEventListener('DOMContentLoaded', function () {
    // document.forms["addForm"].setAttribute("onsubmit", "return validateForm()");
    document.forms["addForm"].onsubmit = validateForm;
});

function validateForm() {
    const myForm = document.forms["addForm"];
    const formEle = myForm.querySelectorAll('input');
    // console.log(formEle);
    // formEle.push(myForm.querySelector('textarea'));
    for (let i = 0; i < formEle.length; i++) {
        if (formEle[i].value == "") {
            alert("All fields required!");
            // console.log(formEle[i].id)
            formEle[i].focus();
            return false;
        }
    }
    return true;
}


