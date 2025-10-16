const add = document.getElementById("addProductBtn");
const modal = document.getElementById("productModal");
const close = document.querySelector('.close-btn');

addProductBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

close.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});