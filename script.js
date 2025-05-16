const form = document.getElementById('examForm');
const examsDiv = document.getElementById('exams');
const yearSpan = document.getElementById('currentYear');

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

let storedExams = JSON.parse(localStorage.getItem('exams') || '[]');
storedExams.forEach((e, index) => addExam(e.subject, new Date(e.datetime), index));

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const subject = document.getElementById('subject').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const datetime = new Date(`${date}T${time}`);

  const newExam = { subject, datetime: datetime.toISOString() };
  storedExams.push(newExam);
  localStorage.setItem('exams', JSON.stringify(storedExams));
  addExam(subject, datetime, storedExams.length - 1);
  form.reset();
});

function addExam(subject, datetime, index) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('div');
  title.textContent = `📘 ${subject}`;

  const datetimeInfo = document.createElement('div');
  datetimeInfo.className = 'datetime-info';
  datetimeInfo.textContent = `📅 ${formatDate(datetime)}`;

  const countdown = document.createElement('div');
  countdown.className = 'countdown';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'حذف';
  deleteBtn.onclick = () => {
    storedExams.splice(index, 1);
    localStorage.setItem('exams', JSON.stringify(storedExams));
    location.reload();
  };

  card.appendChild(deleteBtn);
  card.appendChild(title);
  card.appendChild(datetimeInfo);
  card.appendChild(countdown);
  examsDiv.appendChild(card);

  function updateCountdown() {
    const now = new Date();
    const diff = datetime - now;

    if (diff <= 0) {
      countdown.textContent = '🟢 حان وقت الاختبار!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdown.textContent = `⏳ تبقى ${days} يوم، ${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function formatDate(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  return new Intl.DateTimeFormat('ar-SA', options).format(date);
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}