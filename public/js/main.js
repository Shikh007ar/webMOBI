const chatForm  = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const userList = document.getElementById("users");


const {username} =Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username);

const socket = io();

socket.emit('joinRoom', {username});
socket.on('roomUsers', ({users}) => {
    outputUsers(users);
})

socket.on("message", message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener("submit", e => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;
    socket.emit("chatMessage", msg);

    e.target.elements.msg.value = " ";
    // e.target.elements.msg.value.focus();
});


function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text"> ${message.text}</p>`;
    document.querySelector(".chat-messages").appendChild(div);
}

function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}