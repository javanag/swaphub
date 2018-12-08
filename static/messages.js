let messages = [];
// const currentUser = 'moomi'; //current username of session

const usersList = document.querySelector('#userContainer');
const messagesContainer = document.querySelector('#conversationContainer');
const convoPartnerTitle = document.querySelector('#convoPartnerTitle');

document.addEventListener('DOMContentLoaded', function () {
    loadConversationData();
});

async function loadConversationData() {
    console.log('ESKETIT');
    await makeUpMessages() //Represents getting messages from the server where current user is one of the sender/recipient
    const users = [];

    for (let i = 0; i < messages.length; i++) {
        if (messages[i].sender.username === currentUser) {
            users.push(messages[i].receiver);
        } else if (messages[i].receiver.username === currentUser) {
            users.push(messages[i].sender);
        }
    }
    const uniqueUsers = removeDuplicates(users, "_id")
    console.log(uniqueUsers)
    for (let i = 0; i < uniqueUsers.length; i++) {
        const user = uniqueUsers[i]
        renderConversation(user);
    }
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

async function makeUpMessages() {
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'Hi can I please get one boneless pizza?', new Date()));
    // messages.push(new Message('laflame92cactus', 'moomi', 'false', 'Yeah sure, would you like a 2L coke to go with your pizza?', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'Yes please. Where should I meet you?', new Date()));
    // messages.push(new Message('moomi', 'gaspump2000', 'false', 'Hey can I see some more pictures of your yeezys?', new Date()));
    // messages.push(new Message('moomi', 'gaspump2000', 'false', 'I kinda just wanted some closeups of the soles', new Date()));
    // messages.push(new Message('gaspump2000', 'moomi', 'true', 'Alright but I\'m in the studio rn, dm you back later', new Date()));
    // messages.push(new Message('laflame92cactus', 'moomi', 'false', 'Uhhh, come to the third floor bahen men\'s washroom. Do you know where that is?', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'yep, be there in 20 mins', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    // messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    const response = await fetch('/api/messages');
    messages = await response.json();
    console.log(messages)
}

function Message(sender, receiver, read, content, date) {
    this.sender = sender;
    this.receiver = receiver;
    this.read = read;
    this.content = content;
    this.date = date;
}

function renderConversation(user) {
    const container = document.createElement('button');
    container.className = 'w-100 p-3 border-bottom btn btn-light text-left';
    container.appendChild(document.createTextNode(user.username));
    container.addEventListener("click", renderConversationMessages);
    container.otherUser = user.username;
    container.otherUserID = user._id;
    usersList.appendChild(container);
}

function renderConversationMessages(event) {
    //remove all mesages already loaded
    while (messagesContainer.childElementCount > 1) {
        messagesContainer.removeChild(messagesContainer.lastChild);
    }
    const otherUser = event.target.otherUser
    const otherUserID = event.target.otherUserID
    console.log('Loading messages with ' + otherUser);
    convoPartnerTitle.querySelector('h4').innerHTML = otherUser;
    conversation = [];
    // let otherUserObj;
    messages.forEach(msg => {
        if (msg.sender.username == currentUser
            && msg.receiver.username == otherUser) {
            conversation.push(msg);
        } else if (msg.receiver.username == currentUser
            && msg.sender.username == otherUser) {
            conversation.push(msg);
        }
    })
    for (let i = 0; i < messages.length; i++) {

    }
    conversation.sort(function (a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a > b ? 1 : a < b ? -1 : 0;
    });

    for (let i = 0; i < conversation.length; i++) {
        const message = renderMessage(conversation[i]);
        if (i == conversation.length - 1) {
            message.id = "lastMsg"
            message.classList.add('mb-5');
        }
        messagesContainer.appendChild(message);
    }

    const chatForm = document.createElement("form");
    chatForm.id = "sendMessage";
    chatForm.className = "form-inline chatForm w-100"
    // chatForm.setAttribute("method", "post");
    // chatForm.setAttribute("action", "/api/messages/" + otherUserObj._id);
    chatForm.addEventListener("submit", chatForm.submit);

    const formContainer = document.createElement("div");
    formContainer.className = "form-group w-100";
    chatForm.appendChild(formContainer);

    const messageInput = document.createElement("input");
    messageInput.id = "messageInput";
    messageInput.setAttribute("name", "content");
    messageInput.className = "form-control w-100";
    messageInput.setAttribute("type", "text");
    messageInput.required = true;
    messageInput.setAttribute("placeholder", "Write something to " + event.target.otherUser + '...');
    formContainer.appendChild(messageInput);

    const sendButton = document.createElement("button");
    sendButton.className = "btn btn-warning invisible";
    sendButton.setAttribute("type", "submit");
    sendButton.innerText = "Send";
    chatForm.appendChild(sendButton);

    messagesContainer.appendChild(chatForm);
    // sendButton.addEventListener("click", (e)=> e.preventDefault())
    sendButton.addEventListener("click", (e) =>
        sendMessage(e, messageInput, otherUserID)
    )
}

async function sendMessage(e, messageInput, otherUserID) {
    e.preventDefault();
    // const msgContent = messageInput.value
    // console.log(msgContent)
    const data = {content: messageInput.value};
    await fetch("/api/messages/" + otherUserID, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    })
        .then(res => {
            if (res.status === 200)
                return res.json()
            else
                console.log("ERROR")
        })
        .then(msg => {
            console.log("Appending new msg..", msg)
            const message = renderMessage(msg);
            const oldLastMsg = document.getElementById("lastMsg")
            oldLastMsg.id = ""
            oldLastMsg.classList.remove("mb-5")
            message.classList.add("mb-5");
            message.id = "lastMsg"
            messagesContainer.insertBefore(message, messagesContainer.lastChild)
            message.scrollIntoView()
            messageInput.value = "" //submit listener fix
        })
        .catch((error) => {
            console.log(otherUserID)
            console.log("ERROR ", error)
        })

}

function renderMessage(message) {
    const container = document.createElement('div');
    console.log(message.sender.username, "=", currentUser)
    if (message.sender.username === currentUser) {
        container.className = 'w-50 rounded mb-1 mt-1 mr-2 p-1 bg-warning text-left chatIndent';
    } else {
        container.className = 'w-50 rounded m-2 mt-1 mb-1 p-1 bg-dark text-white text-left';
    }
    container.setAttribute('data-toggle', 'tooltip');
    container.setAttribute('title', message.date.toLocaleString());
    container.appendChild(document.createTextNode(message.content));

    return container;
}
