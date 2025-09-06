const button = document.querySelector('.btn');
const icon1 = document.querySelector('.icon-btn');
const icon2 = document.querySelector('.icon-btn2');

button.addEventListener('click', () => {
  icon1.classList.toggle('active');  // Переключаем активный класс
  icon2.classList.toggle('active');  // Переключаем активный класс
});