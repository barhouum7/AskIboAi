import bot from './assets/bot.png'
import users from './assets/user.png'


const form =  document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}


function typeText (element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.interval += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId () {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
  return (
  `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img 
            src="${isAi ? bot : users}"
            alt="${isAi ? 'bot' : 'user'}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
  `
  )
}


const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // User's ChatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // Bot's ChatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyup === 13) {
    handleSubmit(e);
  }
});