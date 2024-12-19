document.addEventListener('DOMContentLoaded', () => {
  const formContainer = document.getElementById('form-container');
  const notificationContainer = document.getElementById('notification-container');
  let timeouts = [];

  const showNotification = (type, message, autoDismiss = true) => {
    notificationContainer.innerHTML = '';
    
    const notification = document.createElement('div');
    notification.className = `notification is-${type}`;
    notification.innerHTML = `<button class="delete"></button>${message}`;
    notificationContainer.appendChild(notification);

    notification.querySelector('.delete').addEventListener('click', () => notification.remove());

    if (autoDismiss) {
      setTimeout(() => notification.remove(), 2000);
    }
  };

  async function handleAddStatus() {
    const text = document.getElementById('statusText').value.trim();
    const author = document.getElementById('statusAuthor').value.trim() || 'Anonymous';

    if (!text) {
      showNotification('danger', 'Status text cannot be empty.');
      return;
    }
    if (text.length > 500) {
      showNotification('warning', 'Status text is too long (maximum 500 characters).');
      return;
    }

    try {
      const response = await fetch('/api/Status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author }),
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      showNotification('info', `Status added: "${data.status}" by ${data.author}`);
      document.getElementById('statusText').value = '';
      document.getElementById('statusAuthor').value = '';
    } catch (error) {
      showNotification('danger', `Failed to add status: ${error.message}`);
    }
  }

  async function handleGetStatusById() {
    const id = document.getElementById('statusId').value.trim();

    if (!id) {
      showNotification('danger', 'Status ID cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`/api/Status/${id}`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      showNotification('info', `"${data.status}" <br><br>by ${data.author}`, false);
    } catch (error) {
      showNotification('danger', `Failed to fetch status: ${error.message}`, false);
    }
  }

  function getCurrentDateTime() {
    const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };
  
    const now = new Date();
    const date = now.toLocaleDateString("en-US", options);
  
    return `${date}`;
  }

  async function handleGetAllStatus() {
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];

    try {
      const response = await fetch('/api/Status');
      const CurrrentTime = getCurrentDateTime();
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();

      data.forEach((status, index) => {
        const timeout = setTimeout(() => {
          showNotification('info', `<small>Logged at: ${CurrrentTime}</small><br><br>ID: ${status.id}<br><br>${status.status}"`, false);
        }, index * 2000);
        timeouts.push(timeout);
      });
    } catch (error) {
      showNotification('danger', `Failed to fetch status: ${error.message}`, false);
    }
  }

  function renderForm(action) {
    formContainer.innerHTML = '';
    notificationContainer.innerHTML = '';

    if (action === 'add') {
      formContainer.innerHTML = `
        <div class="field">
          <label class="label text-all">Write Status</label>
          <div class="control">
            <textarea id="statusText" class="textarea is-warning" placeholder="Type Here..."></textarea>
          </div>
        </div>
        <div class="field">
          <label class="label text-all">Author</label>
          <div class="control">
            <input id="statusAuthor" class="input is-warning" type="text" placeholder="author (optional)">
          </div>
        </div>
        <button id="submitAdd" class="button is-success">Post Status</button>
      `;
      document.getElementById('submitAdd').addEventListener('click', handleAddStatus);
    } else if (action === 'getById') {
      formContainer.innerHTML = `
        <div class="field">
          <label class="label text-all">Status ID</label>
          <div class="control">
            <input id="statusId" class="input is-warning" type="number" placeholder="Enter status ID">
          </div>
        </div>
        <button id="submitGetById" class="button is-success">Get Status</button>
      `;
      document.getElementById('submitGetById').addEventListener('click', handleGetStatusById);
    } else if (action === 'getAll') {
      formContainer.innerHTML = `
        <button id="submitGetAll" class="button is-success">Get All Status</button>
      `;
      document.getElementById('submitGetAll').addEventListener('click', handleGetAllStatus);
    }
  }

  if (!localStorage.getItem('selectedAction')) {
    showNotification('info', 'Choose an option from the dropdown to start.');
  }

  const savedAction = localStorage.getItem('selectedAction') || 'add';
  renderForm(savedAction);

  document.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const action = e.target.dataset.action;
      localStorage.setItem('selectedAction', action);
      renderForm(action);
      notificationContainer.innerHTML = '';
      timeouts.forEach(timeout => clearTimeout(timeout));
      timeouts = [];
    });
  });
});