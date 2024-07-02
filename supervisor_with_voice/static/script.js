// const synth = window.speechSynthesis;

// const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
// recognition.continuous = false;
// recognition.lang = "en-US";
// recognition.interimResults = false;
// recognition.maxAlternatives = 1;

// const diagnostic = document.querySelector(".output");
// const log = document.querySelector(".log");
// const startButton = document.getElementById("startButton");

// let voices = [];

// function populateVoiceList() {
//     voices = synth.getVoices().sort((a, b) => a.name.localeCompare(b.name));
//     // Optional: handle voice selection if needed
// }

// populateVoiceList();

// if (speechSynthesis.onvoiceschanged !== undefined) {
//     speechSynthesis.onvoiceschanged = populateVoiceList;
// }

// function speak(text) {
//     console.log('speakTheText' + text)
//     if (synth.speaking) {
//         console.error("speechSynthesis.speaking");
//         return;
//     }

//     if (text !== "") {
//         const utterThis = new SpeechSynthesisUtterance(text);

//         utterThis.onend = function (event) {
//             console.log("SpeechSynthesisUtterance.onend");
//         };

//         utterThis.onerror = function (event) {
//             console.error("SpeechSynthesisUtterance.onerror");
//         };

//         // Optional: handle selected voice
//         if (voices.length > 0) {
//             utterThis.voice = voices[0]; // Default to first voice
//         }

//         synth.speak(utterThis);
//     }
// }

// startButton.onclick = () => {
//     startListening();
// };

// function startListening() {
//     try {
//         recognition.start();
//         diagnostic.textContent = "Listening...";
//         console.log("Ready to receive a speech command.");
//     } catch (error) {
//         console.log("Error starting recognition: ", error);
//     }
// }

// recognition.onresult = (event) => {
//     const transcript = event.results[0][0].transcript;
//     diagnostic.textContent = `Result received: ${transcript}`;
//     const logEntry = document.createElement("p");
//     logEntry.textContent = transcript;
//     logEntry.classList.add("log-entry");
//     log.appendChild(logEntry);
//     sendTranscript(transcript);
// };

// recognition.onspeechend = () => {
//     recognition.stop();
//     diagnostic.textContent = "Speech recognition has stopped.";
// };

// recognition.onerror = (event) => {
//     diagnostic.textContent = `Error occurred in recognition: ${event.error}`;
// };

// function sendTranscript(transcript) {
//     fetch('/process_speech', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ transcript })
//     })
//     .then(response => response.json())
//     .then(data => {
//         const logEntry = document.createElement("p");
//         logEntry.textContent = `Response: ${data.response}`;
//         logEntry.classList.add("log-entry");
//         log.appendChild(logEntry);
//         speak(data.response);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }
// ========================
const synth = window.speechSynthesis;

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// const diagnostic = document.querySelector(".output");
// const log = document.querySelector(".log");
const transcriptDiv = document.getElementById('transcript');
const startButton = document.getElementById("startButton");
const listenChip = document.getElementById('listening-chip');
const body = document.querySelector('body');

listenChip.style.display = 'none';

let voices = [];
let speechQueue = [];
let isSpeaking = false;
let listening = false;
var speechStarted = false;
let finalTranscript = '';

function populateVoiceList() {
    voices = synth.getVoices().sort((a, b) => a.name.localeCompare(b.name));
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(text) {
    console.log('speakTheText: ' + text);
    if (text !== "") {
        const utterThis = new SpeechSynthesisUtterance(text);
        console.log('utterThis obj: '+ utterThis)

        utterThis.onend = function (event) {
            console.log("SpeechSynthesisUtterance.onend");
            isSpeaking = false;
            if (speechQueue.length > 0) {
                speak(speechQueue.shift());
            }
        };

        utterThis.onerror = function (event) {
            console.error("SpeechSynthesisUtterance.onerror");
            isSpeaking = false;
        };

        // Optional: handle selected voice
        if (voices.length > 0) {
            utterThis.voice = voices[4]; 
        }

        isSpeaking = true;
        synth.speak(utterThis);
    }
}

startButton.onclick = () => {
    startListening();
};

function startListening() {
    try {
        if (listening) {
            recognition.stop();
            listening = false;
        } else {
            recognition.start();
            listening = true;
        }
        // recognition.start();
        // diagnostic.textContent = "Listening...";
        console.log("Ready to receive a speech command.");
    } catch (error) {
        console.log("Error starting recognition: ", error);
    }
}

recognition.onresult = (event) => {
    // const transcript = event.results[0][0].transcript;
    // diagnostic.textContent = `Result received: ${transcript}`;
    // const logEntry = document.createElement("p");
    // logEntry.textContent = transcript;
    // logEntry.classList.add("log-entry");
    // log.appendChild(logEntry);
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            finalTranscript += formatTranscript(transcript);
            startButton.click();
            sendTranscript(transcript);
        } else {
                interimTranscript += transcript;
        }
        updateContainerMesages();
    }
    transcriptDiv.innerHTML = `<i style="color:${body.className == 'dark' ? '#efeaea': '#616161'};">` + finalTranscript + interimTranscript + '</i>';
};

recognition.onstart = () => {
    listenChip.style.display = '';
    transcriptDiv.textContent = '';
    finalTranscript = '';
};

recognition.onspeechstart = (event) => {
    speechStarted = true;
    console.log(event)
}
recognition.onspeechend = () => {
    recognition.stop();
    speechStarted = false;
    listenChip.style.display = 'none';
    // diagnostic.textContent = "Speech recognition has stopped.";
};

recognition.onerror = (event) => {
    // diagnostic.textContent = `Error occurred in recognition: ${event.error}`;
};

function sendTranscript(transcript) {
    fetch('/process_speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transcript })
    })
    .then(response => response.json())
    .then(data => {
        // const logEntry = document.createElement("p");
        // logEntry.textContent = `Response: ${data.response}`;
        // logEntry.classList.add("log-entry");
        // log.appendChild(logEntry);
        // speak(data.response);
        const url = '/audio/' + data.file;
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => {
            startButton.click();
        };
        addMessage([ [ "system", data.response] ]);
        transcriptDiv.textContent = '';
        transcriptDiv.style.transform = `translateY(0px)`;
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage(dummymessages);
        transcriptDiv.textContent = '';
        transcriptDiv.style.transform = `translateY(0px)`;
    });
}
function formatTranscript(text) {
    const time = new Date();
    return text + '\n';
}

function showMic() {
    document.getElementById('home-screen').classList.add('hide');
    document.getElementById('chat-screen').classList.add('show');
}
const dummymessages = [
    [
        "system",
        "Sorry! unable to proceed your request now, Please try again."
    ],
];
function addMessage(messages) {
    const conversation = document.getElementById('conversation');
    conversation.appendChild(createMessageElement('human', transcriptDiv.textContent));
    messages.slice(-1).map(([role, text]) => {
        const newMessage = createMessageElement(role, text);
        conversation.appendChild(newMessage);
        updateContainerMesages();
    });
}

function createMessageElement(role, text) {
    const message = document.createElement('div');
    message.className = `message  ${role === 'human' ? 'secondary-text-color' : 'primary-text-color'}`;
    message.textContent = text;
    message.animate([{ opacity: '0' }, { opacity: '1' }], { duration: 600 });
    return message;
}

// Check for overflow and adjust visibility to prevent scroll
function updateContainerMesages() {
    const chatContainer = document.getElementById('chat-screen__content');
    const conversationMessages = document.getElementById('conversation').childNodes;
    if ((chatContainer.scrollHeight > chatContainer.clientHeight) && conversationMessages.length > 1) {
        for (var i = 0; i < conversationMessages.length - 1; i++) {
            if ((chatContainer.scrollHeight > chatContainer.clientHeight) && !conversationMessages[i].classList.contains('hidden')) {
                conversationMessages[i].className = "hidden";
            }
        }
    }
}
