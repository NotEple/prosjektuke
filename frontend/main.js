const searchInput = document.getElementById("experience");
const familiesContainer = document.getElementById("families-container");

let families = [];

let searchValue;

let searchProperties = {};

async function getFamilies() {
  try {
    const response = await fetch("http://localhost:3000/families");
    const familiesData = await response.json();
    families = familiesData;
    displayFamilies(families);
  } catch (error) {
    console.error("Error loading families data:", error);
  }
}

async function getSearchResult() {
  try {
    const response = await fetch(
      `http://localhost:3000/families${searchFamilies(
        searchValue,
        searchProperties
      )}`
    );
    console.log(response);
    const filteredFamiliesData = await response.json();
    families = filteredFamiliesData;
    displayFamilies(families);
  } catch (error) {
    console.error("Error loading families data:", error);
  }
}

function displayFamilies(familiesToDisplay) {
  familiesContainer.innerHTML = "";

  familiesToDisplay.forEach((family) => {
    const familyContainer = document.createElement("div");
    familyContainer.classList.add("family-info-container");

    const familyTitle = document.createElement("h3");
    familyTitle.innerHTML = `Family Title: <span id="family-title">${family.family_title}</span>`;
    familyContainer.appendChild(familyTitle);

    const preferencesContainer = document.createElement("div");
    preferencesContainer.classList.add("preferences-results");

    const preferences = [
      { label: "Pets Allowed", value: family.family_properties["petsAllowed"] },
      {
        label: "Smoking Allowed",
        value: family.family_properties["smokingAllowed"],
      },
      {
        label: "Vegan Friendly",
        value: family.family_properties["veganFriendly"],
      },
      {
        label: "Overnight Stay",
        value: family.family_properties["overnightStay"],
      },
    ];

    preferences.forEach((pref) => {
      const p = document.createElement("p");
      p.textContent = `${pref.label}: ${pref.value}`;
      preferencesContainer.appendChild(p);
    });

    familyContainer.appendChild(preferencesContainer);

    const familyImage = document.createElement("img");
    familyImage.src = family.family_picture;
    familyImage.classList.add("family-picture");
    familyImage.alt = family.family_name;

    familyContainer.appendChild(familyImage);

    familiesContainer.appendChild(familyContainer);
  });
}

function createQueryString(searchProperties) {
  // Convert object to a query string
  const queryString = Object.entries(searchProperties)
    .filter(([key, value]) => value === true) // Only include keys with a `true` value
    .map(([key]) => key) // Keep only the key names
    .join("&"); // Join them with `&`

  return queryString;
}

const checkboxes = document.querySelectorAll(".checkbox");

const backendMapping = {
  IHavepet: "petsAllowed",
  IAmsmoking: "smokingAllowed",
  IAmvegan: "veganFriendly",
  IWantovernightStay: "overnightStay",
};

function getCheckboxState() {
  checkboxes.forEach((checkbox) => {
    const checkboxName = checkbox.getAttribute("name");
    const isChecked = checkbox.checked;

    const backendKey = backendMapping[checkboxName];
    if (backendKey) {
      searchProperties[backendKey] = isChecked;
    } else {
      searchProperties[checkboxName] = isChecked;
    }
  });
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", getCheckboxState);
});

// Functional searching for now
searchInput.addEventListener("keyup", (e) => {
  searchValue = e.target.value;
});

function searchFamilies(value, filter) {
  if (value && filter) {
    return `?value=${value}&${createQueryString(filter)}`;
  } else if (value) {
    return `?value=${value}`;
  } else if (filter) {
    return `?${createQueryString(filter)}`;
  }
  return "";
}

const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
  if (!searchValue) {
    getFamilies();
  }
  getSearchResult();
});

document
  .getElementById("form")
  .addEventListener("submit", (e) => e.preventDefault());

window.onload = getFamilies;
