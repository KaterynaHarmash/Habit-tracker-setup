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

const HabitSetup = {
  habits: [],

  init(habitArray) {
    this.habits = [...habitArray];
    this.render();
  },

  add(habit) {
    if (!habit.trim()) return;
    this.habits.push(habit);
    this.render();
  },

  remove(index) {
    this.habits.splice(index, 1);
    this.render();
  },

  render(target = '#habit-setup-list') {
    const list = document.querySelector(target);
    list.innerHTML = '';
    this.habits.forEach((habit, index) => {
      const item = document.createElement('div');
      item.className = 'flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md';
      item.innerHTML = `
        <span>${habit}</span>
        <button class="text-red-500 text-sm" data-index="${index}">Remove</button>
      `;
      list.appendChild(item);
    });
  },

  async save(name) {
    const db = await dbPromise;
    await db.put('user', { name, habits: [...this.habits] }, 'profile');
  },

  async updateStoredHabits() {
    const db = await dbPromise;
    const profile = await db.get('user', 'profile');
    profile.habits = [...this.habits];
    await db.put('user', profile, 'profile');
  }
};

const addBtn = document.querySelector('#add-habit');
const input = document.querySelector('#new-habit');
const setupList = document.querySelector('#habit-setup-list');
const startBtn = document.querySelector('#start-tracking');
const nameInput = document.querySelector('#username');
const setupSection = document.querySelector('#setup');
const trackerSection = document.querySelector('#tracker');
const nameDisplay = document.querySelector('#user-name');
const dateDisplay = document.querySelector('#today-date');
const habitListSection = document.querySelector('#habit-list');
const petReaction = document.querySelector('#pet-reaction');

const editBtn = document.querySelector('#edit-habits');
const editSection = document.querySelector('#edit');
const editList = document.querySelector('#edit-habit-list');
const editInput = document.querySelector('#edit-new-habit');
const editAddBtn = document.querySelector('#edit-add-habit');
const saveEditBtn = document.querySelector('#save-habits');

editBtn.addEventListener('click', async () => {
  const db = await dbPromise;
  const profile = await db.get('user', 'profile');
  HabitSetup.init(profile.habits);
  HabitSetup.render('#edit-habit-list');
  trackerSection.classList.add('hidden');
  editSection.classList.remove('hidden');
});

editAddBtn.addEventListener('click', () => {
  const value = editInput.value.trim();
  if (!value) return;
  HabitSetup.add(value);
  editInput.value = '';
  HabitSetup.render('#edit-habit-list');
});

editList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const index = e.target.dataset.index;
    HabitSetup.remove(index);
    HabitSetup.render('#edit-habit-list');
  }
});

saveEditBtn.addEventListener('click', async () => {
  await HabitSetup.updateStoredHabits();
  editSection.classList.add('hidden');
  trackerSection.classList.remove('hidden');
  await renderDailyHabits();
});

addBtn.addEventListener('click', () => {
  const value = input.value.trim();
  if (!value) return;
  HabitSetup.add(value);
  input.value = '';
});

setupList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const index = e.target.dataset.index;
    HabitSetup.remove(index);
  }
});

startBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  if (!name || HabitSetup.habits.length === 0) {
    showToast('Please enter your name and at least one habit.');
    return;
  }

  try {
    await HabitSetup.save(name);
    nameDisplay.textContent = name;
    dateDisplay.textContent = new Date().toLocaleDateString('en-GB');
    setupSection.classList.add('hidden');
    trackerSection.classList.remove('hidden');
    await renderDailyHabits();
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

async function renderDailyHabits() {
  const db = await dbPromise;
  const profile = await db.get('user', 'profile');
  const habits = profile?.habits || [];

  const dateStr = new Date().toISOString().split('T')[0];
  const completedToday = {};

  for (const habit of habits) {
    const id = `${dateStr}|${habit}`;
    const record = await db.get('track', id);
    if (record?.done) completedToday[habit] = true;
  }

  habitListSection.innerHTML = '';

  habits.forEach(habit => {
    const id = `habit-${habit.toLowerCase().replace(/\s+/g, '-')}`;
    const isDone = completedToday[habit] || false;

    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-3';
    wrapper.innerHTML = `
      <input type="checkbox" id="${id}" data-habit="${habit}" class="w-5 h-5 text-teal-500 rounded" ${isDone ? 'checked' : ''} />
      <label for="${id}" class="text-gray-700">${habit}</label>
    `;
    habitListSection.appendChild(wrapper);
  });

  const total = habits.length;
  const completed = Object.values(completedToday).filter(Boolean).length;
  petReaction.textContent = completed === 0 ? '😴' : completed < total ? '😺' : '🎉🐶';

  habitListSection.addEventListener('change', async () => {
    const checkboxes = habitListSection.querySelectorAll('input[type="checkbox"]');
    const doneCount = habitListSection.querySelectorAll('input:checked').length;
    petReaction.textContent = doneCount === 0 ? '😴' : doneCount < habits.length ? '😺' : '🎉🐶';

    const db = await dbPromise;
    checkboxes.forEach(async checkbox => {
      const habit = checkbox.dataset.habit;
      const done = checkbox.checked;
      const id = `${dateStr}|${habit}`;
      await db.put('track', { id, date: dateStr, habit, done });
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const db = await dbPromise;
  const profile = await db.get('user', 'profile');

  if (profile && profile.name && Array.isArray(profile.habits)) {
    setupSection.classList.add('hidden');
    trackerSection.classList.remove('hidden');
    nameDisplay.textContent = profile.name;
    dateDisplay.textContent = new Date().toLocaleDateString('en-GB');
    await renderDailyHabits();
  }
});
