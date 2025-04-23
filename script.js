import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

// створюємо базу
const db = await openDB('habit-tracker', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('user')) {
      db.createObjectStore('user');
    }
    if (!db.objectStoreNames.contains('track')) {
      const store = db.createObjectStore('track', { keyPath: 'id' });
      store.createIndex('by-date', 'date');
    }
  }
});

// тест: виводимо базу в консоль
console.log('[✅ DB ready]', db);

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