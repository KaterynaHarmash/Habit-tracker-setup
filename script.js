import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

const dbPromise = openDB('habit-tracker', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('user')) {
      db.createObjectStore('user');
    }
    if (!db.objectStoreNames.contains('track')) {
      const store = db.createObjectStore('track', { keyPath: 'id' });
      store.createIndex('by-date', 'date');
    }
  },
});

let habits = [];

const setupList = document.querySelector('#habit-setup-list');
const addBtn = document.querySelector('#add-habit');
const input = document.querySelector('#new-habit');

function renderHabits() {
  setupList.innerHTML = '';
  habits.forEach((habit, index) => {
    const item = document.createElement('div');
    item.className = 'flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md';
    item.innerHTML = `
      <span>${habit}</span>
      <button class="text-red-500 text-sm" data-index="${index}">Remove</button>
    `;
    setupList.appendChild(item);
  });
}

addBtn.addEventListener('click', () => {
  const value = input.value.trim();
  if (!value) return;

  habits.push(value);
  input.value = '';
  renderHabits();
});

setupList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const index = e.target.dataset.index;
    habits.splice(index, 1);
    renderHabits();
  }
});

const startBtn = document.querySelector('#start-tracking');
const nameInput = document.querySelector('#username');
const setupSection = document.querySelector('#setup');
const trackerSection = document.querySelector('#tracker');
const nameDisplay = document.querySelector('#user-name');
const dateDisplay = document.querySelector('#today-date');

startBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  if (!name || habits.length === 0) {
    showToast('Please enter your name and at least one habit.');
    return;
  }

  try {
    const db = await dbPromise;
    await db.put('user', { name, habits }, 'profile');

    nameDisplay.textContent = name;
    dateDisplay.textContent = new Date().toLocaleDateString('en-GB');
    setupSection.classList.add('hidden');
    trackerSection.classList.remove('hidden');
  } catch (error) {
    showToast('Error saving data to the database.');
    console.error('DB Error:', error);
  }
});

function showToast(message, duration = 3000) {
  const toast = document.querySelector('#toast');
  const msg = document.querySelector('#toast-message');

  msg.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('opacity-100');

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, duration);
}
