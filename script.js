const testUser = {
  email: "24pa1a05j7@vishnu.edu.in",
  password: "1234",
};

const state = {
  items: JSON.parse(localStorage.getItem("items")) || [],
  selectedIndex: null,
};

const ui = {
  welcome: document.getElementById("welcome"),
  loginPage: document.getElementById("login-page"),
  dashboard: document.getElementById("dashboard"),
  addSection: document.getElementById("add-section"),
  itemsList: document.getElementById("items-list"),
  itemsEmpty: document.getElementById("items-empty"),
  itemsCount: document.getElementById("items-count"),
  claimModal: document.getElementById("claim-modal"),
  inputs: {
    loginEmail: document.getElementById("login-email"),
    loginPassword: document.getElementById("login-password"),
    itemName: document.getElementById("item-name"),
    itemDesc: document.getElementById("item-desc"),
    itemLocation: document.getElementById("item-location"),
    itemContact: document.getElementById("item-contact"),
    claimerName: document.getElementById("claimer-name"),
    claimerContact: document.getElementById("claimer-contact"),
  },
  buttons: {
    getStarted: document.getElementById("get-started"),
    login: document.getElementById("login-btn"),
    toggleAdd: document.getElementById("create-item-btn"),
    submitItem: document.getElementById("submit-item-btn"),
    logout: document.getElementById("logout-btn"),
    claimConfirm: document.getElementById("claim-confirm-btn"),
    claimCancel: document.getElementById("claim-cancel-btn"),
  },
};

function setView({ showWelcome, showLogin, showDashboard }) {
  ui.welcome.classList.toggle("is-hidden", !showWelcome);
  ui.loginPage.classList.toggle("is-hidden", !showLogin);
  ui.dashboard.classList.toggle("is-hidden", !showDashboard);
}

function saveItems() {
  localStorage.setItem("items", JSON.stringify(state.items));
}

function showLogin() {
  setView({ showWelcome: false, showLogin: true, showDashboard: false });
}

function login() {
  const email = ui.inputs.loginEmail.value.trim();
  const pass = ui.inputs.loginPassword.value.trim();

  if (!email || !pass) {
    alert("Enter your email and password.");
    return;
  }

  if (email === testUser.email && pass === testUser.password) {
    setView({ showWelcome: false, showLogin: false, showDashboard: true });
    loadItems();
    ui.inputs.loginPassword.value = "";
  } else {
    alert("Invalid credentials.");
  }
}

function logout() {
  location.reload();
}

function toggleAddSection() {
  ui.addSection.classList.toggle("is-hidden");
}

function clearAddForm() {
  ui.inputs.itemName.value = "";
  ui.inputs.itemDesc.value = "";
  ui.inputs.itemLocation.value = "";
  ui.inputs.itemContact.value = "";
}

function addItem() {
  const name = ui.inputs.itemName.value.trim();
  const desc = ui.inputs.itemDesc.value.trim();
  const location = ui.inputs.itemLocation.value.trim();
  const contact = ui.inputs.itemContact.value.trim();

  if (!name || !desc || !location || !contact) {
    alert("All fields are required.");
    return;
  }

  state.items.unshift({
    name,
    desc,
    location,
    contact,
    claimed: false,
  });

  saveItems();
  loadItems();
  clearAddForm();
  ui.addSection.classList.add("is-hidden");
}

function createItemElement(item, index) {
  const li = document.createElement("li");
  li.className = "item-card";

  const content = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = item.name;

  const meta = document.createElement("div");
  meta.className = "item-meta";
  meta.appendChild(document.createTextNode(item.desc));
  meta.appendChild(document.createElement("br"));
  meta.appendChild(document.createTextNode(`Location: ${item.location}`));
  meta.appendChild(document.createElement("br"));
  meta.appendChild(document.createTextNode(`Contact: ${item.contact}`));

  content.appendChild(title);
  content.appendChild(meta);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.innerText = "Claim";
  btn.className = "claim-btn";
  btn.addEventListener("click", () => openModal(index));

  li.appendChild(content);
  li.appendChild(btn);

  return li;
}

function updateEmptyState(visibleCount) {
  const label = visibleCount === 1 ? "1 item" : `${visibleCount} items`;
  ui.itemsCount.textContent = label;
  ui.itemsEmpty.classList.toggle("is-hidden", visibleCount !== 0);
}

function loadItems() {
  ui.itemsList.innerHTML = "";
  let visibleCount = 0;

  state.items.forEach((item, index) => {
    if (!item.claimed) {
      ui.itemsList.appendChild(createItemElement(item, index));
      visibleCount += 1;
    }
  });

  updateEmptyState(visibleCount);
}

function openModal(index) {
  state.selectedIndex = index;
  ui.claimModal.classList.remove("is-hidden");
  ui.inputs.claimerName.value = "";
  ui.inputs.claimerContact.value = "";
}

function closeModal() {
  ui.claimModal.classList.add("is-hidden");
  state.selectedIndex = null;
}

function claimItem() {
  const name = ui.inputs.claimerName.value.trim();
  const contact = ui.inputs.claimerContact.value.trim();

  if (!name || !contact) {
    alert("Enter your details.");
    return;
  }

  if (state.selectedIndex === null || !state.items[state.selectedIndex]) {
    alert("That item is no longer available.");
    closeModal();
    loadItems();
    return;
  }

  state.items[state.selectedIndex].claimed = true;
  saveItems();
  closeModal();
  loadItems();
  alert("Item marked as claimed.");
}

document.addEventListener("DOMContentLoaded", () => {
  ui.buttons.getStarted.addEventListener("click", showLogin);
  ui.buttons.login.addEventListener("click", login);
  ui.buttons.toggleAdd.addEventListener("click", toggleAddSection);
  ui.buttons.submitItem.addEventListener("click", addItem);
  ui.buttons.logout.addEventListener("click", logout);
  ui.buttons.claimConfirm.addEventListener("click", claimItem);
  ui.buttons.claimCancel.addEventListener("click", closeModal);

  ui.claimModal.addEventListener("click", (event) => {
    if (event.target === ui.claimModal) {
      closeModal();
    }
  });
});
