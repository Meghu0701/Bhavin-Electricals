/* ---------------- helpers ---------------- */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu"); // only declare ONCE

// Toggle menu on hamburger click
hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Auto-close menu on link click
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ---------- element refs ---------- */
const burger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks"); // desktop flex
const darkBtn = document.getElementById("darkToggle");
const root = document.documentElement;

/* ---------- dark‑mode init ---------- */
const saved = localStorage.getItem("dark") === "true";
root.classList.toggle("dark", saved);

/* ---------- hamburger toggle ---------- */
burger.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  // swap Font‑Awesome icon
  burger.innerHTML = mobileMenu.classList.contains("hidden")
    ? '<i class="fas fa-bars"></i>'
    : '<i class="fas fa-times"></i>';
});

// close drawer when a mobile link is tapped
document.querySelectorAll(".mobile-link").forEach((link) =>
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    burger.innerHTML = '<i class="fas fa-bars"></i>';
  })
);

/* ---------- dark‑mode button ---------- */
darkBtn.addEventListener("click", () => {
  const next = !root.classList.contains("dark");
  root.classList.toggle("dark", next);
  localStorage.setItem("dark", String(next));
});

/* ---------------- dark‑mode ---------------- */
if (localStorage.getItem("bhavin-dark") === "true")
  document.documentElement.classList.add("dark");
$("#darkToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "bhavin-dark",
    document.documentElement.classList.contains("dark")
  );
});

/* ---------------- popup ---------------- */
function showPopup(msg, error = false) {
  const pop = $("#popup");
  pop.textContent = msg;
  pop.classList.toggle("error", error);
  pop.style.display = "block";
  setTimeout(() => (pop.style.display = "none"), 3000);
}

/* ---------------- local‑storage products ---------------- */
const LS_KEY = "bhavin-products";
const getProducts = () => JSON.parse(localStorage.getItem(LS_KEY) || "[]");
const saveProducts = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

/* ---------------- render products ---------------- */
function renderProducts(filter = "all") {
  const grid = $("#productGrid");
  grid.innerHTML = "";
  getProducts().forEach((p, idx) => {
    if (filter !== "all" && filter.toLowerCase() !== p.category.toLowerCase())
      return;

    const card = document.createElement("div");
    card.className =
      "product-card rounded-lg shadow bg-white dark:bg-gray-700 overflow-hidden hover:-translate-y-1 transition";
    card.dataset.category = p.category;
    card.innerHTML = `
      <img src="${p.img || "https://via.placeholder.com/240"}"
           alt="${p.name}" class="w-full h-40 object-cover">
      <div class="p-4 space-y-1">
        <h3 class="font-semibold text-lg">${p.name}</h3>
        <p><strong>Category:</strong> ${p.category}</p>
        <p><strong>Price:</strong> ₹${p.price}</p>
        ${p.desc ? `<p>${p.desc}</p>` : ""}
        <button class="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded delete-btn">Delete</button>
      </div>`;
    card.querySelector(".delete-btn").onclick = () => {
      const arr = getProducts();
      arr.splice(idx, 1);
      saveProducts(arr);
      showPopup("🗑️ Product deleted!", true);
      renderProducts(filter);
    };
    grid.appendChild(card);

    /* staggered reveal */
    setTimeout(() => card.classList.add("show"), 50);
  });
}

/* ---------------- add product ---------------- */
$("#productForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#productName").value.trim();
  const category = $("#productCategory").value.trim();
  const price = $("#productPrice").value.trim();
  const img = $("#productImg").value.trim();
  const desc = $("#productDesc").value.trim();

  if (!name || !category || !price) {
    showPopup("❌ Please fill all required fields", true);
    return;
  }

  const arr = getProducts();
  arr.push({ name, category, price, img, desc });
  saveProducts(arr);
  e.target.reset();
  showPopup("✅ Product added!");
  renderProducts($(".filter-btn.active")?.dataset.filter || "all");
});

/* ---------------- filter buttons ---------------- */
$$(".filter-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter || "all");
  })
);

/* ---------------- inquiry form ---------------- */
$("#inquiryForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  $("#inquirySuccess").classList.remove("hidden");
  showPopup("✅ Inquiry submitted!");
  setTimeout(() => $("#inquirySuccess").classList.add("hidden"), 3500);
});

/* ---------------- misc init ---------------- */
AOS.init({ once: true, duration: 700, easing: "ease-in-out" });
$("#year").textContent = new Date().getFullYear();

/* pause / resume carousel on hover */
const carousel = $("#carouselInner");
carousel.addEventListener(
  "mouseover",
  () => (carousel.style.animationPlayState = "paused")
);
carousel.addEventListener(
  "mouseleave",
  () => (carousel.style.animationPlayState = "running")
);

/* initial render */
renderProducts();
