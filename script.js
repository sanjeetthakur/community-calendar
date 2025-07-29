const calendar = document.getElementById('calendar');
const monthDisplay = document.getElementById('monthDisplay');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const jumpTodayBtn = document.getElementById('jumpToday');
const viewBtns = document.querySelectorAll('.view-btn');
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const saveBtn = document.getElementById('saveEvent');
const closeModal = document.getElementById('closeModal');

// Form inputs
const eventTitleInput = document.getElementById('eventTitle');
const eventTimeInput = document.getElementById('eventTime');
const eventDescInput = document.getElementById('eventDescription');
const eventColorInput = document.getElementById('eventColor');

let current = new Date();
let view = 'month';
let selectedDate = null;

const events = {
  '2023-11-01': [
    { title: '🧠 AI Class', time: '10:00', desc: 'Neural Networks', color: 'orange' }
  ]
};

function renderCalendar() {
  calendar.innerHTML = '';
  const today = new Date();
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthDisplay.innerText = current.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekDays.slice(1).concat(weekDays[0]).forEach(day => {
    const label = document.createElement('div');
    label.className = 'day-label';
    label.innerText = day;
    calendar.appendChild(label);
  });

  if (view === 'month') {
    const emptyCells = (startDay + 6) % 7;
    for (let i = 0; i < emptyCells; i++) {
      calendar.appendChild(document.createElement('div'));
    }
    for (let day = 1; day <= daysInMonth; day++) {
      createDayCell(year, month, day, today);
    }
  } else if (view === 'week') {
    const start = new Date(current);
    const dayOfWeek = start.getDay();
    start.setDate(start.getDate() - ((dayOfWeek + 6) % 7));
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      createDayCell(date.getFullYear(), date.getMonth(), date.getDate(), today);
    }
  } else if (view === 'day') {
    createDayCell(current.getFullYear(), current.getMonth(), current.getDate(), today);
  }
}

function createDayCell(year, month, day, today) {
  const cell = document.createElement('div');
  cell.className = 'day-cell';
  const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const dayNumber = document.createElement('div');
  dayNumber.innerText = day;
  dayNumber.style.fontWeight = 'bold';
  cell.appendChild(dayNumber);

  if (
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year
  ) {
    cell.classList.add('today');
  }

  if (events[dateKey]) {
    events[dateKey].forEach(event => {
      const ev = document.createElement('div');
      ev.className = `event ${event.color}`;
      ev.innerText = `${event.title} (${event.time})`;
      ev.title = event.desc || '';
      cell.appendChild(ev);
    });
  }

  cell.onclick = () => {
    selectedDate = dateKey;
    openModal();
  };

  calendar.appendChild(cell);
}

// Navigation
prevMonthBtn.onclick = () => {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
};
nextMonthBtn.onclick = () => {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
};
jumpTodayBtn.onclick = () => {
  current = new Date();
  renderCalendar();
};

// View toggling
viewBtns.forEach(btn => {
  btn.onclick = () => {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (btn.dataset.view) view = btn.dataset.view;
    renderCalendar();
  };
});

// Modal handlers
function openModal() {
  modalOverlay.style.display = 'flex';
  modalTitle.innerText = `New Event on ${selectedDate}`;
  eventTitleInput.value = '';
  eventTimeInput.value = '';
  eventDescInput.value = '';
  eventColorInput.value = 'blue';
}
function closeModalFn() {
  modalOverlay.style.display = 'none';
}
saveBtn.onclick = () => {
  const title = eventTitleInput.value.trim();
  const time = eventTimeInput.value.trim();
  const desc = eventDescInput.value.trim();
  const color = eventColorInput.value;

  if (!title || !time) {
    alert("Please enter event title and time.");
    return;
  }

  if (!events[selectedDate]) events[selectedDate] = [];
  events[selectedDate].push({ title, time, desc, color });
  closeModalFn();
  renderCalendar();
};
closeModal.onclick = closeModalFn;

// Initial render
renderCalendar();
