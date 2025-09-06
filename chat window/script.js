const input = document.querySelector('.chat-winow__input-message');
const sendBtn = document.querySelector('.chat-winow__send-message');
const geoBtn = document.querySelector('.chat-winow__send-location');
const chatBox = document.querySelector('.chat-winow__correspondence');

const ws = new WebSocket('wss://echo.websocket.events');

function appendMessage(text, className = 'message server') {
  const msg = document.createElement('div');
  msg.className = className;
  msg.innerHTML = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

ws.addEventListener('open', () => {
  console.log('WS open');
  sendBtn.disabled = false;
});

ws.addEventListener('message', (evt) => {
  handleIncoming(evt.data);
});

ws.addEventListener('error', (error) => {
  console.log('WS error', error.message);
})

ws.addEventListener('close', () => {
  console.log('WS close');
  sendBtn.disabled = true;
});

sendBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if(!text) return;
  appendMessage(escapeHTML(text), 'message user');

  const payload = JSON.stringify({type: 'message', text});
  ws.send(payload);

  input.value = '';
});

input.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') sendBtn.click();
});

function handleIncoming(raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    appendMessage(escapeHTML(raw), 'message server');
    return;
  }

  if(data.type === 'geo') {
    return;
  }

  if(data.type === 'message') {
    appendMessage(escapeHTML(data.text), 'message server');
  }
};

geoBtn.addEventListener('click', () => {
  if(!navigator.geolocation) {
    appendMessage('Геолокация не поддерживается', 'message server');
    return;
  }

  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const url = `https://www.openstreetmap.org/#map=18/${lat}/${lon}`;

    appendMessage(`<a href='${url}' target = '_blank'>Моя геолокация</a>`, 'message server');
    ws.send(JSON.stringify({type: 'geo', lat, lon, url}));
  }, (error) => {
    appendMessage('Ошибка геолокации: ' + error.message, 'message server');
  });
});

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

