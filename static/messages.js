
const messages = [];
const currentUser = 'moomi'; //current username of session

const usersList = document.querySelector('#userContainer');
const messagesContainer = document.querySelector('#conversationContainer');
const convoPartnerTitle = document.querySelector('#convoPartnerTitle');

document.addEventListener('DOMContentLoaded', function () {
    loadConversationData();
});

function loadConversationData(){
    console.log('ESKETIT');
    makeUpMessages() //Represents getting messages from the server where current user is one of the sender/recipient
    const users = [];

    for(let i = 0; i < messages.length; i++){
        if(messages[i].sender == currentUser){
            users.push(messages[i].receiver);
        }else if(messages[i].receiver == currentUser){
            users.push(messages[i].sender);
        }
    }

    var uniqueUsers = users.filter(onlyUnique);
    for(let i = 0; i < uniqueUsers.length; i++){
        const user = {username: uniqueUsers[i]}
        renderConversation(user);
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function makeUpMessages(){
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'Hi can I please get one boneless pizza?', new Date()));
    messages.push(new Message('laflame92cactus', 'moomi', 'false', 'Yeah sure, would you like a 2L coke to go with your pizza?', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'Yes please. Where should I meet you?', new Date()));
    messages.push(new Message('moomi', 'gaspump2000', 'false', 'Hey can I see some more pictures of your yeezys?', new Date()));
    messages.push(new Message('moomi', 'gaspump2000', 'false', 'I kinda just wanted some closeups of the soles', new Date()));
    messages.push(new Message('gaspump2000', 'moomi', 'true', 'Alright but I\'m in the studio rn, dm you back later', new Date()));
    messages.push(new Message('laflame92cactus', 'moomi', 'false', 'Uhhh, come to the third floor bahen men\'s washroom. Do you know where that is?', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'yep, be there in 20 mins', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));
    messages.push(new Message('moomi', 'laflame92cactus', 'true', 'by the way i wanna test what happens when you have a lot of texts that have a lot of text or at least a fair amount that will span many lines and take up a good portion of the screen real estate', new Date()));

}

function Message(sender, receiver, read, content, date) {
  this.sender = sender;
  this.receiver = receiver;
  this.read = read;
  this.content = content;
  this.date = date;
}

function renderConversation(user){
    const container = document.createElement('button');
    container.className = 'w-100 p-3 border-bottom btn btn-light text-left';
    container.appendChild(document.createTextNode(user.username));
    container.addEventListener("click", renderConversationMessages);
    container.otherUser = user.username;

    usersList.appendChild(container);
}

function renderConversationMessages(event){
    //remove all mesages already loaded
    while (messagesContainer.childElementCount > 1) {
        messagesContainer.removeChild(messagesContainer.lastChild);
    }

    console.log('Loading messages with ' + event.target.otherUser);
    convoPartnerTitle.querySelector('h4').innerHTML = event.target.otherUser;
    conversation = [];
    for(let i = 0; i < messages.length; i++){
        if(messages[i].sender == currentUser && messages[i].receiver == event.target.otherUser){
            conversation.push(messages[i]);
        }else if(messages[i].receiver == currentUser && messages[i].sender == event.target.otherUser){
            conversation.push(messages[i]);
        }
    }
    conversation.sort(function(a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a>b ? 1 : a<b ? -1 : 0;
    });

    for(let i = 0; i < conversation.length; i++){
        const message = renderMessage(conversation[i]);
        if(i == conversation.length - 1){
            message.classList.add('mb-4');
        }
        messagesContainer.appendChild(message);
    }

    const chatForm = document.createElement("form");
    chatForm.id = "sendMessage";
    chatForm.className = "form-inline chatForm w-100"
    chatForm.setAttribute("method", "post");
    chatForm.setAttribute("action", "api/sendmessage/");
    chatForm.addEventListener("submit", chatForm.submit);

    const formContainer = document.createElement("div");
    formContainer.className = "form-group w-100";
    chatForm.appendChild(formContainer);

    const messageInput = document.createElement("input");
    messageInput.id = "messageInput";
    messageInput.setAttribute("name", "message");
    messageInput.className = "form-control w-100";
    messageInput.setAttribute("type", "text");
    messageInput.setAttribute("placeholder", "Write something to " + event.target.otherUser + '...');
    formContainer.appendChild(messageInput);

    const sendButton = document.createElement("button");
    sendButton.className = "btn btn-warning invisible";
    sendButton.setAttribute("type", "submit");
    sendButton.innerText = "Send";
    chatForm.appendChild(sendButton);

    messagesContainer.appendChild(chatForm);
}

function renderMessage(message){
    const container = document.createElement('div');

    if(message.sender == currentUser){
        container.className = 'w-50 rounded mb-1 mt-1 mr-2 p-1 bg-warning text-left chatIndent';
    }else{
        container.className = 'w-50 rounded m-2 mt-1 mb-1 p-1 bg-dark text-white text-left';
    }
    container.setAttribute('data-toggle','tooltip');
    container.setAttribute('title', message.date.toLocaleString());
    container.appendChild(document.createTextNode(message.content));

    return container;
}
