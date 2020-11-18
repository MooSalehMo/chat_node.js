window.addEventListener('load', ()=> {

  let socket;
  // html Element
  const loginForm = document.getElementById('loginForm');
  const nameInput = document.getElementById('nameInput')
  const messageInput = document.getElementById('messageInput');
  const form = document.getElementById('messageForm');
  const messagesContainer = document.getElementById('messagesContainer');
  const title = document.getElementById('title');
  

  loginForm.addEventListener('submit', event => {
    event.preventDefault()
    const name = nameInput.value 
    login(name)
  })

  login = name => {

    let url = location.pathname.split('/');
    let namespace = url[url.length - 1];
    title.innerText = `namespace: ${namespace}`;
    document.title = namespace

    socket = io('/' + namespace)
    socket.emit('login', name)
    socket.on('message', data => {
      if (data.from != name) {
        say(data.from, data.message);
      } else {
        say('me: ', data.message);
      } 
    })
    loginForm.remove()
    form.classList.remove('hidden')
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    let message = messageInput.value;
    messageInput.value = '';
    socket.emit('message', message);
  })

  

  say = (name, message) => {
    messagesContainer.innerHTML += 
    `<div class="chat-message">
        <span style="color: red; font-weight: bold">${name} </span>${message}
      </div>`
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
})
