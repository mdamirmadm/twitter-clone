const socket = io();

async function loadMsgs(){
    const chats = await axios.get('/allmessages');

    for(let chat of chats.data){
        const timestamp = timeDifference(new Date(),new Date(chat.createdAt));
        $('#all-msg-container').append(`<li>
        <span class="msg-username">${chat.username}</span> 
        <div id="msg-content" class="alert alert-success" role="alert">${chat.content}</div>
        <span class="msg-time">${timestamp}</span>
        </li>`);
    }
}

loadMsgs();

$('#send-msg-btn').click(() => {
    
    const textMsg = $('#msg-text').val();

    socket.emit('send-msg',{ msg:textMsg, username: username});

    $('#msg-text').val("");
})

socket.on('received-msg',(data) => {
    const timestamp = timeDifference(new Date(),new Date(data.createdAt))
    $('#all-msg-container').append(`<li>
    <span class="msg-username">${data.username}</span> 
    <div id="msg-content" class="alert alert-success" role="alert">${data.msg}</div>
    <span class="msg-time">${timestamp}</span>
    </li>`);
})



function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;


    var elapsed = current - previous;

    if(elapsed/1000 < 30){
        return "Just now";
    }

    if (elapsed < msPerMinute) {
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}