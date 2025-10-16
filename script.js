const { ipcRenderer } = require("electron");


const addProductBtn = document.getElementById("addProductBtn");
const modal = document.getElementById("productModal");
const closeBtn = document.querySelector(".close-btn");
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const viewBtn = document.getElementById("viewBtn");

let products = [];


window.addEventListener("DOMContentLoaded", async () => {
  products = await ipcRenderer.invoke("load-products");
  products.forEach(addProductCard);
  updateViewButton();
});


addProductBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});


closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});


productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();

  if (name === "" || price === "") {
    alert("Please fill out all fields!");
    return;
  }

  const product = {
    id: Date.now(),
    name,
    price: parseFloat(price).toFixed(2),
  };

  products.push(product);
  addProductCard(product);
  saveData();

  productForm.reset();
  modal.style.display = "none";
  updateViewButton();
});

function addProductCard(product) {
  const card = document.createElement("div");
  card.classList.add("product-card");
  card.setAttribute("data-id", product.id);

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.textContent = `₱${product.price}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    deleteProduct(product.id);
  });

  card.appendChild(name);
  card.appendChild(price);
  card.appendChild(deleteBtn);
  productList.appendChild(card);
}


function deleteProduct(id) {
  products = products.filter((product) => product.id !== id);

  const cardToRemove = document.querySelector(`.product-card[data-id="${id}"]`);
  if (cardToRemove) cardToRemove.remove();

  saveData();
  updateViewButton();
}


function saveData() {
  ipcRenderer.send("save-products", products);
}


function updateViewButton() {
  let tooltip = document.getElementById("viewTooltip");

  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "viewTooltip";
    tooltip.textContent = "No products to view!";
    tooltip.style.position = "absolute";
    tooltip.style.background = "#df3a4b";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "6px 10px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.fontSize = "14px";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.style.display = "none";
    tooltip.style.zIndex = "999";
    tooltip.style.transition = "opacity 0.2s ease";
    document.body.appendChild(tooltip);
  }

  viewBtn.onmouseenter = null;
  viewBtn.onmouseleave = null;

  if (products.length === 0) {
    viewBtn.style.pointerEvents = "none";
    viewBtn.style.opacity = "0.5";

    
    viewBtn.onmouseenter = () => {
      tooltip.style.display = "block";
      tooltip.style.opacity = "1";
      const rect = viewBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${rect.top - 35}px`;
    };

    viewBtn.onmouseleave = () => {
      tooltip.style.display = "none";
      tooltip.style.opacity = "0";
    };
  } else {
    viewBtn.style.pointerEvents = "auto";
    viewBtn.style.opacity = "1";
  }
}


viewBtn.addEventListener("click", (e) => {
  if (products.length === 0) {
    e.preventDefault();
    alert("No products to view!");
  }
});


updateViewButton();
