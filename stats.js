const historyList = document.getElementById('history-list');
const history = JSON.parse(localStorage.getItem('pomodoroHistory')) || [];

history.reverse().forEach(session => {
  const li = document.createElement('li');
  li.textContent = `${session.type} - ${Math.round(session.duration / 60)} min - ${new Date(session.date).toLocaleString()}`;
  historyList.appendChild(li);
});
