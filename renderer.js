import { supabase } from './supabase.js';

console.log("renderer.js chargé");

window.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'auth.html';
    return;
  }

  let timer;
  let remainingTime = 1500;
  let isRunning = false;
  let currentMode = 'pomodoro';
  let sessionCount = 0;

  const defaultDurations = {
    pomodoro: 1500,
    short: 300,
    long: 900
  };

  const modes = {
    ...defaultDurations,
    custom: 1500
  };

  // Charger les durées personnalisées
  const saved = localStorage.getItem('pomodoroCustom');
  if (saved) {
    const { work, short, long } = JSON.parse(saved);
    modes.custom = work * 60;
    modes.short = short * 60;
    modes.long = long * 60;
  }

  // Charger le fond d'écran
  const userSettings = JSON.parse(localStorage.getItem('userSettings'));
  if (userSettings?.background) {
    document.body.style.backgroundImage = `url(${userSettings.background})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }

  // Charger le son
  const audio = new Audio(userSettings?.sound || 'ding.mp3');

  // Éléments DOM
  const timerDisplay = document.getElementById('timer');
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  const resetBtn = document.getElementById('reset');
  const modeButtons = document.querySelectorAll('.mode');
  const counterDisplay = document.getElementById('counter');
  const historyBtn = document.getElementById('history');
  const logoutBtn = document.getElementById('logout');
  const customBtn = document.getElementById('custom-mode');

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(remainingTime);
  }

  function switchMode(mode) {
    currentMode = mode;
    clearInterval(timer);
    isRunning = false;

    // Réinitialiser aux durées par défaut si on revient au mode standard
    if (['pomodoro', 'short', 'long'].includes(mode)) {
      modes.pomodoro = defaultDurations.pomodoro;
      modes.short = defaultDurations.short;
      modes.long = defaultDurations.long;
    }

    remainingTime = modes[mode];
    updateDisplay();

    modeButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.mode[data-mode="${mode}"]`);
    if (activeBtn) activeBtn.classList.add('active');
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;

    timer = setInterval(() => {
      remainingTime--;
      updateDisplay();

      if (remainingTime <= 0) {
        clearInterval(timer);
        remainingTime = 0;
        updateDisplay();
        isRunning = false;
        audio.play();

        new Notification('Temps écoulé', {
          body: `Session ${currentMode} terminée`
        });

        if (currentMode === 'pomodoro' || currentMode === 'custom') {
          sessionCount++;
          counterDisplay.textContent = `Sessions terminées : ${sessionCount}`;
        }

        const sessionData = {
          type: currentMode,
          date: new Date().toISOString(),
          duration: modes[currentMode]
        };

        let history = JSON.parse(localStorage.getItem('pomodoroHistory')) || [];
        history.push(sessionData);
        localStorage.setItem('pomodoroHistory', JSON.stringify(history));
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
  }

  function resetTimer() {
    clearInterval(timer);
    remainingTime = modes[currentMode];
    isRunning = false;
    updateDisplay();
  }

  // Bouton mode personnalisé
  customBtn?.addEventListener('click', () => {
    const saved = localStorage.getItem('pomodoroCustom');
    if (saved) {
      const { work, short, long } = JSON.parse(saved);
      modes.custom = work * 60;
      modes.short = short * 60;
      modes.long = long * 60;
      switchMode('custom');
    } else {
      alert("Aucun paramètre personnalisé trouvé.");
    }
  });

  // Événements UI
  startBtn?.addEventListener('click', startTimer);
  pauseBtn?.addEventListener('click', pauseTimer);
  resetBtn?.addEventListener('click', resetTimer);

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchMode(btn.dataset.mode);
    });
  });

  historyBtn?.addEventListener('click', () => {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.send('open-history-window');
  });

  logoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'auth.html';
  });

  updateDisplay();
  counterDisplay.textContent = `Sessions terminées : ${sessionCount}`;
});
