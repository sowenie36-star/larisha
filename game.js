'use strict';
const $ = id => document.getElementById(id);
const bank = window.LOVE_QUESTIONS;
let questions = [], index = 0, score = 0, hits = 0, ammo = 0, state = 'welcome', deadline = 0, ticker;
function shuffle(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }
function paint() {
  $('score').textContent = `${score} / 5`;
  $('hearts').textContent = Array.from({length: 5}, (_, i) => i < score ? '●' : '○').join(' ');
  $('hearts').setAttribute('aria-label', `${score} of 5 correct answers`);
  $('ammo').textContent = `${ammo} SHOT${ammo === 1 ? '' : 'S'}`;
  $('hits').textContent = String(hits).padStart(2, '0');
  $('target').disabled = state !== 'shoot';
  $('target').textContent = state === 'shoot' ? 'SHOOT! [SPACE]' : 'SHOT LOCKED';
}
function start() {
  clearInterval(ticker);
  if (!Array.isArray(bank) || bank.length < 5 || bank.some(q => !q.question || !Array.isArray(q.options) || q.options.length < 2 || !Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length)) {
    $('welcome').textContent = 'Please add at least five valid questions in questions.js.'; return;
  }
  questions = shuffle(bank.map(q => ({...q}))); index = score = hits = ammo = 0;
  if (window.resetCourt) window.resetCourt();
  $('welcome').hidden = true; $('end').hidden = true; $('questionPanel').hidden = false;
  paint(); showQuestion();
}
function showQuestion() {
  if (index >= questions.length) { finish(); return; }
  state = 'question'; paint();
  $('round').textContent = `QUESTION ${index + 1} / ${questions.length}`;
  $('question').textContent = questions[index].question;
  $('feedback').textContent = ''; $('next').hidden = true;
  $('rangeMessage').textContent = 'Answer correctly to unlock the ball.';
  $('answers').replaceChildren();
  questions[index].options.forEach((text, i) => {
    const button = document.createElement('button'); button.className = 'answer';
    const letter = document.createElement('span'); letter.textContent = String.fromCharCode(65 + i);
    button.append(letter, document.createTextNode(text)); button.onclick = () => answer(i); $('answers').append(button);
  });
  deadline = performance.now() + 10000; tick(); ticker = setInterval(tick, 50);
  $('answers').firstElementChild.focus({preventScroll: true});
}
function tick() {
  if (state !== 'question') return;
  const remaining = Math.max(0, deadline - performance.now());
  $('timer').textContent = `${Math.ceil(remaining / 1000)}s`;
  $('timeBar').style.width = `${remaining / 100}%`;
  $('timer').classList.toggle('urgent', remaining <= 3000);
  if (remaining === 0) answer(null);
}
function answer(choice) {
  if (state !== 'question') return;
  if (performance.now() >= deadline) choice = null;
  clearInterval(ticker);
  const right = questions[index].correct;
  [...$('answers').children].forEach((b, i) => { b.disabled = true; if (i === right) b.classList.add('correct'); else if (i === choice) b.classList.add('wrong'); });
  if (choice === right) {
    score++; ammo = 1; state = 'shoot';
    $('feedback').textContent = score === 5 ? 'Five correct! Take your victory shot to reveal your voucher.' : 'Correct! Ball is yours. Hit SHOOT when the meter turns green.';
    $('rangeMessage').textContent = 'BALL UNLOCKED · TIME YOUR SHOT';
    paint(); $('target').focus({preventScroll: true});
  } else {
    state = 'feedback';
    $('feedback').textContent = choice === null ? 'Time’s up! The correct answer is highlighted.' : 'Off the mark. The correct answer is highlighted.';
    $('next').hidden = false; $('next').textContent = index + 1 === questions.length ? 'See result' : 'Next question';
    paint(); $('next').focus({preventScroll: true});
  }
}
function shoot() {
  if (state !== 'shoot' || ammo !== 1) return;
  ammo = 0; hits++; state = 'shot'; paint();
  if (window.takeBasketballShot) window.takeBasketballShot();
  $('range').classList.add('fired'); $('rangeMessage').textContent = 'BUCKET! NOTHING BUT NET.';
  $('feedback').textContent = score === 5 ? 'MVP STATUS. Your escape is approved.' : 'Nice bucket. Keep your streak alive.';
  setTimeout(() => {
    $('range').classList.remove('fired');
    if (score >= 5) { state = 'won'; $('prize').showModal(); }
    else { $('next').hidden = false; $('next').textContent = index + 1 === questions.length ? 'See result' : 'Next question'; $('next').focus({preventScroll: true}); }
  }, 1250);
}
function finish() {
  clearInterval(ticker); state = 'ended'; $('questionPanel').hidden = true; $('end').hidden = false;
  $('endMessage').textContent = `You got ${score} correct out of ${questions.length}. Get five in one round to claim your escape. Another try?`;
  $('round').textContent = 'ROUND COMPLETE'; paint();
}
$('start').onclick = start; $('retry').onclick = start;
$('next').onclick = () => { if (state !== 'feedback' && state !== 'shot') return; index++; showQuestion(); };
$('target').onclick = shoot;
$('again').onclick = () => { $('prize').close(); start(); };
$('print').onclick = () => window.print();
$('prize').addEventListener('cancel', e => e.preventDefault());
$('music').onclick = async () => {
  const audio = $('audio'); audio.volume = 0.35;
  if (!audio.paused) { audio.pause(); $('music').textContent = '♫ Music off'; $('music').setAttribute('aria-pressed', 'false'); return; }
  try { await audio.play(); $('music').textContent = '♫ Music on'; $('music').setAttribute('aria-pressed', 'true'); }
  catch { $('music').textContent = '♫ Tap to retry music'; }
};
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });

document.addEventListener('keydown', e => { if (e.code === 'Space' && state === 'shoot' && e.target.id !== 'target') { e.preventDefault(); shoot(); } });
