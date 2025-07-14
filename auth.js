// auth.js
import { supabase } from './supabase.js';

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');

const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupBtn = document.getElementById('signup-btn');

const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

loginBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: loginEmail.value,
    password: loginPassword.value
  });

  if (error) {
    loginError.textContent = error.message;
  } else {
    window.location.href = 'index.html'; // Redirection après connexion réussie
  }
});

signupBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signUp({
    email: signupEmail.value,
    password: signupPassword.value
  });

  if (error) {
    signupError.textContent = error.message;
  } else {
    alert("Un email de confirmation a été envoyé.");
  }
});
// 👁️ Affichage/masquage du mot de passe
document.querySelectorAll('.toggle-password').forEach(icon => {
  icon.addEventListener('click', () => {
    const targetId = icon.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = '🙈';
    } else {
      input.type = 'password';
      icon.textContent = '👁️';
    }
  });
});
