function startVoiceToText() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice recognition not supported in this browser.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("messageInput").value = transcript;
    };
    recognition.onerror = function(event) {
        console.error(event.error);
    };
}
