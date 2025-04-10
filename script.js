class APIViewer {
 constructor() {
  this.form = document.getElementById("api-form");
  this.apiUrlInput = document.getElementById("api-url");
  this.imagePathInput = document.getElementById("image-path");
  this.previewImageBtn = document.getElementById("preview-image");
  this.outputSection = document.getElementById("output-section");
  this.imageSection = document.getElementById("image-section");
  this.jsonOutput = document.getElementById("json-output");
  this.loader = document.querySelector(".loader");
  this.outputImage = document.getElementById("output-image");
  this.navList = document.querySelector(".nav__list");

  this.initEventListeners();
 }

 initEventListeners() {
  addEventListener("DOMContentLoaded", () => {
   const sections = ["image-section", "input-section", "json-section"];
   const [__, tag] = document.URL.split("#")
   if (sections.includes(tag)) {
    const allLinks = this.navList.querySelectorAll("a")
    allLinks.forEach((link)=>link.classList.remove("active"))
    for (const link of allLinks) {
     const [__, cleanHref] = link.href.split("#")
     if (sections.includes(cleanHref)) {
      link.classList.add("active")
     }
    }
   }

  });
  this.form.addEventListener("submit", this.handleSubmit.bind(this));
  this.previewImageBtn.addEventListener("click", this.previewImage.bind(this));
 }

 async handleSubmit(e) {
  e.preventDefault();
  const url = this.apiUrlInput.value.trim();

  if (!this.isValidUrl(url)) {
   this.showError("Please enter a valid HTTPS URL");
   return;
  }

  try {
   this.toggleLoader(true);
   const data = await this.fetchData(url);
   this.displayJSON(data);

   const imagePath = this.imagePathInput.value;
   if (imagePath)
    this.previewImage();

   this.outputSection.hidden = false;
   window.location.hash = "#output-section";
  } catch (error) {
   this.showError(`Failed to fetch data: ${error.message}`);
  } finally {
   this.toggleLoader(false);
  }
 }

 async previewImage() {
  const imagePath = this.imagePathInput.value.trim();
  if (!imagePath) {
   this.showError("Please enter image path in JSON");
   return;
  }

  try {
   const imageUrl = this.getNestedValue(JSON.parse(this.jsonOutput.textContent), imagePath);
   if (typeof imageUrl !== "string")
    throw new Error("Invalid image path");

   this.outputImage.src = imageUrl;
   this.outputImage.onload = () => {
    this.imageSection.hidden = false;
    window.location.hash = "#image-section";
   };
  } catch (error) {
   this.showError(`Image not found: ${error.message}`);
  }
 }

 async fetchData(url) {
  const response = await fetch(url, {
   headers: { "Content-Type": "application/json" }
  });

  if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
 }

 displayJSON(data) {
  this.jsonOutput.textContent = JSON.stringify(data, null, 2);
  Prism.highlightElement(this.jsonOutput);
 }

 getNestedValue(obj, path) {
  return path.split(".").reduce((o, p) => o?.[p], obj);
 }

 isValidUrl(url) {
  try {
   const urlObj = new URL(url);
   return urlObj.protocol === "https:";
  } catch {
   return false;
  }
 }

 toggleLoader(show) {
  this.loader.hidden = !show;
 }

 showError(message) {
  const errorEl = document.createElement("div");
  errorEl.className = "error-message";
  errorEl.textContent = message;
  errorEl.style.color = "var(--error-color)";
  this.form.insertAdjacentElement("afterend", errorEl);
  setTimeout(() => errorEl.remove(), 3000);
 }
}

// Initialize app
new APIViewer();
/**
 * Copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */