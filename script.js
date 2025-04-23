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