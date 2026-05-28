const chatLog = document.getElementById('chatLog');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const activeStatus = document.getElementById('activeStatus');

const STORAGE_KEY = 'lora-disaster-offline-chat';
const partnerReplies = [
  'Roger that. I am ready to coordinate.',
  'Understood. I will keep this line open.',
  'Copy that. I am on the same offline channel.',
  'Noted. I will respond as soon as I can.'
];

let messages = [];

function setStatus(text) {
  if (activeStatus) {
    activeStatus.innerHTML = '<span class="status-dot"></span><span>' + text + '</span>';
  }
}

function appendMessage(type, text, author = 'SYSTEM') {
  const msg = document.createElement('div');
  msg.className = `chat-message ${type}`;

  const sender = document.createElement('div');
  sender.className = 'chat-sender';
  sender.textContent = type === 'me' ? 'You' : type === 'remote' ? author || 'Partner' : 'SYSTEM';

  const body = document.createElement('div');
  body.className = 'chat-body';
  body.textContent = text;

  msg.appendChild(sender);
  msg.appendChild(body);
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function renderMessages() {
  if (!chatLog) return;

  chatLog.innerHTML = '';
  messages.forEach((entry) => appendMessage(entry.type, entry.text, entry.author));
}

function saveMessages() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function loadMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved) && saved.length > 0) {
      messages = saved;
    } else {
      messages = [
        {
          type: 'system',
          author: 'SYSTEM',
          text: 'Offline chat ready. Messages stay on this device only.'
        }
      ];
    }
  } catch (error) {
    messages = [
      {
        type: 'system',
        author: 'SYSTEM',
        text: 'Offline chat ready. Messages stay on this device only.'
      }
    ];
  }

  renderMessages();
}

function addMessage(type, text, author) {
  messages.push({ type, text, author });
  saveMessages();
  renderMessages();
}

function replyToPartner(text) {
  const reply = partnerReplies[Math.floor(Math.random() * partnerReplies.length)];
  window.setTimeout(() => {
    addMessage('remote', reply, 'Partner');
    setStatus('Offline • 2-user chat');
  }, 700);
}

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = messageInput.value.trim();

  if (!value) return;

  addMessage('me', value, 'You');
  messageInput.value = '';
  setStatus('Offline • 2-user chat');
  replyToPartner(value);
});

window.addEventListener('DOMContentLoaded', () => {
  loadMessages();
  setStatus('Offline • 2-user chat');
});
