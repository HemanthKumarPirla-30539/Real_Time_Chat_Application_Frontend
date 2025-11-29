let currentUserEmail = localStorage.getItem('email');
let currentUsername = localStorage.getItem('username');
let currentUserPic = localStorage.getItem('profilePic');
let currentFriendEmail = null;

// Display user info
document.getElementById('usernameNav').innerText = currentUsername;
document.getElementById('usernameSidebar').innerText = currentUsername;
document.getElementById('profilePicNav').src = currentUserPic;
document.getElementById('profilePicSidebar').src = currentUserPic;

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Search friend by email or username
function searchFriend() {
    const query = document.getElementById('searchFriend').value.trim();
    const list = document.getElementById('friendList');
    list.innerHTML = '';

    if (!query) return;

    fetch('https://real-time-chat-application-hvln.onrender.com/api/users/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: query })
    })
    .then(res => res.json())
    .then(data => {
        if (data.length > 0) {
            data.forEach(f => {
                const div = document.createElement('div');
                div.className = 'friend';
                div.innerText = f.username + ' (' + f.email + ')';
                div.onclick = () => openChat(f.email, f.username, f.profilePic);
                list.appendChild(div);
            });
        } else {
            const div = document.createElement('div');
            div.innerText = 'No friends found';
            list.appendChild(div);
        }
    })
    .catch(err => console.error(err));
}

// Open chat and load old messages
function openChat(friendEmail, friendName, friendPic) {
    document.getElementById('chatHeader').innerText = friendName;
    currentFriendEmail = friendEmail;

    fetch(`https://real-time-chat-application-hvln.onrender.com/api/messages/chat?sender=${currentUserEmail}&receiver=${friendEmail}`)
        .then(res => res.json())
        .then(messages => {
            const chatBox = document.getElementById('chatBox');
            chatBox.innerHTML = "";
            messages.forEach(m => {
                const msgDiv = document.createElement('div');
                msgDiv.className = m.senderEmail === currentUserEmail ? 'message self' : 'message friend';
                msgDiv.innerText = m.message;
                chatBox.appendChild(msgDiv);
            });
            chatBox.scrollTop = chatBox.scrollHeight;
        });
}

// Send message to friend
function sendMessage() {
    if (!currentFriendEmail) {
        alert("Select a friend first");
        return;
    }

    const input = document.getElementById('messageInput');
    const msg = input.value.trim();
    if (!msg) return;

    fetch("https://real-time-chat-application-hvln.onrender.com/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            senderEmail: currentUserEmail,
            receiverEmail: currentFriendEmail,
            message: msg
        })
    })
    .then(res => res.text())
    .then(() => {
        const chatBox = document.getElementById('chatBox');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message self';
        msgDiv.innerText = msg;
        chatBox.appendChild(msgDiv);
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}
