'use strict';
// const listingsContainer = document.querySelector('#listingsContainer');
// const listingBreadcrumb = document.querySelector('#listingBreadcrumb');
// const listingNavLink = document.querySelector('#listingNavLink');
// const categoryDropDown = document.querySelector('#categoryDropDown');
// const searchBar = document.querySelector('#searchBar');
// const searchSubmit = document.querySelector('#searchSubmit');
// let priceDOM;
// let dateDOM;
// let titleDOM;
// let descDOM;
// let ppDOM;
// let ppTextDOM;
let conditionDOM;
let offerButton;
let finalOfferAcceptButton;


document.addEventListener('DOMContentLoaded', function () {
    //This loading of recent listings will be drawn from the server in the future.
    //So pretend allListings is the server I suppose.
    //Render recent listings pulled from server;
    conditionDOM = document.querySelector('#itemCondText');
    offerButton = document.getElementById("offerBttn");
    finalOfferAcceptButton = document.getElementById("finalOfferAcceptButton");

    const acceptOfferButtons = document.querySelectorAll(".acceptOffer");
    for(let i = 0; i < acceptOfferButtons.length; i++){
        acceptOfferButtons[i].addEventListener("click", updateOfferAcceptModal);
    }

    const modalBody = document.getElementById("modalBody");
    const modalFooter = document.querySelector(".modal-footer");
    const bidForm = document.createElement("form");
    bidForm.id = "bidForm";
    // region bidForm
    const formGrp = document.createElement("div");
    formGrp.className = "form-group row";
    bidForm.appendChild(formGrp);
    const inputLabel = document.createElement("label");
    inputLabel.className = "col-5 ol-form-label";
    inputLabel.innerText = "Enter your bid:";
    formGrp.appendChild(inputLabel);

    const inputBid = document.createElement("input");
    inputBid.className = "col-6 form-control";
    inputBid.setAttribute("type", "number");
    inputBid.setAttribute("step", "0.01");
    inputBid.required = true;
    formGrp.appendChild(inputBid)
    // endregion bidForm
    const successMsg = document.createElement("div");
    successMsg.className = "alert alert-success";
    successMsg.setAttribute("role", "alert");
    successMsg.innerText = "Successfully placed a bid!";

    const failMsg = document.createElement("div");
    failMsg.className = "alert alert-danger";
    failMsg.setAttribute("role", "alert");
    failMsg.innerText = "Failed placing a bid!";

    const bidSubmit = document.createElement("button");
    bidSubmit.className = "btn btn-primary";
    bidSubmit.setAttribute("type", "submit");
    bidSubmit.setAttribute("form", "bidForm")
    bidSubmit.innerText = "Submit"

    let carousel = document.querySelector('#carouselImageArray');
    carousel.querySelectorAll('div')[0].classList.add('active');

    setCondition();
    offerButton.addEventListener("click", (e) =>
        showBidPopup(e, modalBody, modalFooter, bidForm, bidSubmit));
    bidForm.addEventListener("submit", (e) =>
        submitBid(e, modalBody, modalFooter, bidForm, bidSubmit, inputBid, successMsg, failMsg))
});

function updateOfferAcceptModal(e){
    console.log(e.target);
    const bidder = e.target.getAttribute('bidder');
    console.log(bidder);
    const listing = e.target.getAttribute('listing');
    const acceptModalTitle = document.querySelector("#acceptModalLabel");
    acceptModalTitle.innerHTML = "Accept offer by " + bidder + "?";
    const acceptModalBody = document.querySelector("#acceptModalBody");
    acceptModalBody.innerHTML = "This will send an automated message notifying " + bidder +
     " that their offer was accepted.";
    finalOfferAcceptButton.addEventListener("click", (e) => {
        sendAutomatedMessage(e, bidder, listing);
    });
}

async function sendAutomatedMessage(e, bidder, listing){
    const data = {content: "[AUTO] Hello, " + bidder + "! Your offer for listing: \"" + listing + "\" has been accepted."};
    await fetch("/api/messages/" + bidder, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    }).then(res => {
            if (res.status === 200)
                return res.json()
            else
                console.log("ERROR")
        })
}

function setCondition() {
    if (conditionDOM.innerText == 'NEW') {
        conditionDOM.setAttribute("class", 'text-success');
    } else if (conditionDOM.innerText == 'USED') {
        conditionDOM.setAttribute("class", 'text-warning');
    } else if (conditionDOM.innerText == 'DAMAGED') {
        conditionDOM.setAttribute("class", 'text-danger');
    }
}

function deleteListing(e) {
    fetch("/api/listings/" + listingId,
        {method: 'delete'}).then(result => result.json())
        .then(listing => {
            alert("Deleted: " + listing.title);
            window.location.replace('/listings')
        })
        .catch((error) => {
            res.status(400).send(error)
        })
}

function showBidPopup(e, modalBody, modalFooter, bidForm, bidSubmit) {
    e.target.blur();
    while (modalBody.firstChild)
        modalBody.removeChild(modalBody.firstChild);
    modalBody.appendChild(bidForm)
    modalFooter.appendChild(bidSubmit)
}

function submitBid(e, modalBody, modalFooter, bidForm, bidSubmit, inputBid, successMsg, failMsg) {
    e.preventDefault();
    modalBody.removeChild(bidForm)
    modalFooter.removeChild(bidSubmit)
    const data = {
        offerBid: inputBid.value
    }
    fetch('/api/offer/' + listingId, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "cors", // no-cors, cors, *same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        // redirect: "error", // manual, *follow, error
        // referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
        .then((res) => {
            if (res.status === 200) {
                console.log("placed a bid!");
                modalBody.appendChild(successMsg)
            } else {
                // alert('Could not place bid')
                modalBody.appendChild(failMsg)
            }
        })
        .catch((error) => console.log(error));
    e.target.blur()
}
