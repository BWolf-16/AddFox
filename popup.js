const contactForm = document.getElementById("contact-form");
const toggleFormButton = document.getElementById("toggle-form");
const saveContactButton = document.getElementById("save-contact");
const removeContactButton = document.getElementById("remove-contact");
const contactsContainer = document.getElementById("contacts");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const exportContactsButton = document.getElementById("export-contacts");
const importContactsInput = document.getElementById("import-contacts");

let isEditing = false;
let editingIndex = -1;

// Load contacts and apply theme on popup open
document.addEventListener("DOMContentLoaded", () => {
  loadContacts();
  loadTheme();
});

// Toggle form visibility
toggleFormButton.addEventListener("click", () => {
  contactForm.style.display = contactForm.style.display === "none" ? "block" : "none";
  toggleFormButton.textContent = contactForm.style.display === "none" ? "+" : "-";
  resetForm();
});

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  saveTheme();
});

// Save or update contact
saveContactButton.addEventListener("click", saveOrUpdateContact);

// Remove contact
removeContactButton.addEventListener("click", removeContact);

// Export contacts
exportContactsButton.addEventListener("click", exportContacts);

// Import contacts
importContactsInput.addEventListener("change", importContacts);

async function saveOrUpdateContact() {
  const email = document.getElementById("email").value;
  const street = document.getElementById("street").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const country = document.getElementById("country").value;
  const phone = document.getElementById("phone").value;
  const description = document.getElementById("description").value;

  if (!email || !street || !city || !state || !country || !phone) {
    alert("Please fill out all required fields.");
    return;
  }

  const contact = {
    email,
    address: `${street}, ${city}, ${state}, ${country}`,
    phone: `${phone} (${description})`
  };

  let { contacts = [] } = await browser.storage.local.get("contacts");

  if (isEditing) {
    contacts[editingIndex] = contact;
    isEditing = false;
    editingIndex = -1;
  } else {
    contacts.unshift(contact);  // Add new contact to the beginning
  }

  await browser.storage.local.set({ contacts });
  loadContacts();
  contactForm.reset();
  contactForm.style.display = "none";
  toggleFormButton.textContent = "+";
}

async function loadContacts() {
  contactsContainer.innerHTML = "";
  const { contacts = [] } = await browser.storage.local.get("contacts");

  contacts.forEach((contact, index) => {
    const contactCard = document.createElement("div");
    contactCard.className = "contact-card";

    contactCard.innerHTML = `
      <p><strong>Email:</strong> ${contact.email} 
         <button class="copy-button" data-clipboard="${contact.email}">Copy</button>
         <button class="edit-button" data-index="${index}">Edit</button>
      </p>
      <p><strong>Address:</strong> ${contact.address} 
         <button class="copy-button" data-clipboard="${contact.address}">Copy</button>
      </p>
      <p><strong>Phone:</strong> ${contact.phone} 
         <button class="copy-button" data-clipboard="${contact.phone}">Copy</button>
      </p>
    `;

    contactsContainer.appendChild(contactCard);
  });

  addCopyListeners();
  addEditListeners();
}

function addCopyListeners() {
  document.querySelectorAll(".copy-button").forEach(button => {
    button.addEventListener("click", copyToClipboard);
  });
}

function copyToClipboard(event) {
  const textToCopy = event.target.getAttribute("data-clipboard");
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert("Copied to clipboard");
  });
}

function addEditListeners() {
  document.querySelectorAll(".edit-button").forEach(button => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      startEditing(index);
    });
  });
}

async function startEditing(index) {
  const { contacts } = await browser.storage.local.get("contacts");
  const contact = contacts[index];

  document.getElementById("email").value = contact.email;
  const [street, city, state, country] = contact.address.split(", ");
  document.getElementById("street").value = street;
  document.getElementById("city").value = city;
  document.getElementById("state").value = state;
  document.getElementById("country").value = country;

  const [phone, description] = contact.phone.match(/(.*)\s\((.*)\)/).slice(1);
  document.getElementById("phone").value = phone;
  document.getElementById("description").value = description;

  contactForm.style.display = "block";
  toggleFormButton.textContent = "-";
  removeContactButton.style.display = "inline";
  
  isEditing = true;
  editingIndex = index;
}

async function removeContact() {
  let { contacts = [] } = await browser.storage.local.get("contacts");
  contacts.splice(editingIndex, 1);
  await browser.storage.local.set({ contacts });
  
  loadContacts();
  contactForm.reset();
  contactForm.style.display = "none";
  toggleFormButton.textContent = "+";
  removeContactButton.style.display = "none";
}

// Export contacts as JSON file
async function exportContacts() {
  const { contacts = [] } = await browser.storage.local.get("contacts");
  const dataStr = JSON.stringify(contacts, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = "address_book.json";
  link.click();
  
  URL.revokeObjectURL(url);
}

// Import contacts from JSON file
async function importContacts(event) {
  const file = event.target.files[0];
  if (file) {
    const text = await file.text();
    try {
      const importedContacts = JSON.parse(text);
      if (Array.isArray(importedContacts)) {
        await browser.storage.local.set({ contacts: importedContacts });
        loadContacts();
        alert("Contacts imported successfully.");
      } else {
        alert("Invalid file format.");
      }
    } catch (e) {
      alert("Failed to parse the file. Make sure it's a valid JSON.");
    }
  }
}

function resetForm() {
  contactForm.reset();
  isEditing = false;
  editingIndex = -1;
  removeContactButton.style.display = "none";
}

// Load the theme preference from storage
async function loadTheme() {
  const { darkMode } = await browser.storage.local.get("darkMode");
  if (darkMode) {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️";
  }
}

// Save the current theme preference
async function saveTheme() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  await browser.storage.local.set({ darkMode: isDarkMode });
}
