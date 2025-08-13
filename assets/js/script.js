'use strict';
document.addEventListener("DOMContentLoaded", () => {
  const elementToggleFunc = function (elem) {
    requestAnimationFrame(() => {
      elem.classList.toggle("active");
    });
  }

  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const testimonialsItemLength = testimonialsItem.length;
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  const testimonialsModalFunc = function () {
    requestAnimationFrame(() => {
      modalContainer.classList.toggle("active");
      overlay.classList.toggle("active");
    });
  }

  for (const item of testimonialsItem) {
    item.addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    });
  }

  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);

  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterBtnLength = filterBtn.length;

  select.addEventListener("click", function () { elementToggleFunc(this); });

  for (const item of selectItems) {
    item.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  }

  const filterItems = document.querySelectorAll("[data-filter-item]");
  const filterItemsLength = filterItems.length;

  const filterFunc = function (selectedValue) {
    for (let i = 0; i < filterItemsLength; i++) {
      if (selectedValue === "all" || selectedValue === filterItems[i].dataset.category) {
        filterItems[i].classList.add("active");
      } else {
        filterItems[i].classList.remove("active");
      }
    }
  }

  let lastClickedBtn = filterBtn[0];
  for (let i = 0; i < filterBtnLength; i++) {
    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);
      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }

  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    }
  }

  const validateForm = debounce(function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  }, 300);

  for (const input of formInputs) {
    input.addEventListener("input", validateForm);
  }

  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const navigationLinksLength = navigationLinks.length;
  const pages = document.querySelectorAll("[data-page]");
  const pagesLength = pages.length;

  for (const navLink of navigationLinks) {
    navLink.addEventListener("click", function () {
      for (let i = 0; i < pagesLength; i++) {
        if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
          pages[i].classList.add("active");
          navigationLinks[i].classList.add("active");
          window.scrollTo(0, 0);
        } else {
          pages[i].classList.remove("active");
          navigationLinks[i].classList.remove("active");
        }
      }
    });
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const submitBtn = form.querySelector("button[type='submit']");
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      });
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      showToast("✅ Message sent successfully!");
      form.reset();
      setTimeout(() => {
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
      }, 3000);
    } catch (error) {
      submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
      showToast("🚫 Network error: " + (error?.message || "Unknown"));
      setTimeout(() => {
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
      }, 3000);
    }
  });

  function showToast(message) {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #111;
      color: #fff;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 0.95rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      z-index: 9999;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 4000);
  }
});