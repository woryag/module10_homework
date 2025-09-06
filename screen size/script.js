const btn = document.querySelector('.size');

btn.addEventListener('click', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  alert(`Ширина: ${width}px, Высота: ${height}px`);
});