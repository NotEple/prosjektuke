let familiesArray = [];

async function getFamilies() {
  try {
    const req = await fetch("http://localhost:3000/families");
    const res = await req.json();
    familiesArray = res;

    displayFamilies(familiesArray);
  } catch (error) {
    console.log(error);
  } finally {
    console.log(familiesArray);
  }
}

function displayFamilies(families) {
  const familyInfoContainer = document.getElementById("family-info-container");

  if (!Array.isArray(families)) {
    familyInfoContainer.innerHTML = "<p>No families to show.</p>";
    return;
  }

  if (families.length === 0) {
    familyInfoContainer.innerHTML =
      "<p>No families match your preferences.</p>";
  } else {
    familyInfoContainer.innerHTML = families
      .map((family) => {
        return `
            <div id="family-info-container-small" data-family-id="${
              family.family_id
            }">
        <h3>Family Title: <span id="family-title">${
          family.family_title
        }</span></h3>
        <div id="preferances-results">
          <p>Pets Allowed: ${
            family.family_properties.petsAllowed ? "Yes" : "No"
          }</p>
          <p>Smoking Allowed: ${
            family.family_properties.smokingAllowed ? "Yes" : "No"
          }</p>
          <p>Vegan Friendly: ${
            family.family_properties.veganFriendly ? "Yes" : "No"
          }</p>
          <p>Overnight Stay: ${
            family.family_properties.overnightStay ? "Yes" : "No"
          }</p>
        </div>
        <img id="family-picture" src="${
          family.family_picture
        }" alt="family picture" />
        <button class="view-details-btn">View Details</button>
        </div>
      `;
      })
      .join("");
  }
}

document.addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("view-details-btn")) {
    const familyId = event.target.closest("#family-info-container-small")
      .dataset.familyId;
    openFamilyDetails(familyId);
  }
});

function openFamilyDetails(familyId) {
  const family = familiesArray.find((fam) => fam.family_id == familyId);

  if (!family) return;

  const dialog = document.createElement("dialog");
  dialog.innerHTML = `
   <h3 id="family-title-dialog">${family.family_title}</h3>
    <p id="family-name-dialog">${family.family_name}</p>
    <p id="family-description-dialog">${family.family_description}</p>
    <p class="p-dialog"id="pets-allowed-dialog">${
      family.family_properties.petsAllowed ? "Pets allowed" : "Pets not allowed"
    }</p>
    <p class="p-dialog" id="smoking-allowed-dialog">${
      family.family_properties.smokingAllowed
        ? "Smoking allowed"
        : "Smoking not allowed"
    }</p>
    <p class="p-dialog" id="vegan-friendly-dialog">${
      family.family_properties.veganFriendly
        ? "Vegan Friendly"
        : "Not vegan friendly"
    }</p>
    <p class="p-dialog" id="overnight-stay-dialog">${
      family.family_properties.overnightStay
        ? "Possible to stay overnight"
        : "Not possible to stay overnight"
    }</p>
    <img id="family-picture-dialog" src="${
      family.family_picture
    }" alt="family picture" />
<div id="message-form">
       
<h2>Send a message directly to the family <h2>
      <textarea id="message" placeholder="Write your message here..." required></textarea>
      <button type="submit" id="send-message-btn">Send Message</button> 
 <input id="date-dialog" type="date" />
    <button id="book-btn" >Book here</button>
     
</div>
    <button id="close-dialog-btn" class="close-dialog-btn">Close</button>
  `;
  document.body.appendChild(dialog);
  dialog.showModal();

  document
    .getElementById("send-message-btn")
    .addEventListener("click", function () {
      const messageField = document.getElementById("message");

      messageField.value = "";
    });

  dialog.querySelector(".close-dialog-btn").addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });

  const familyPicture = document.getElementById("family-picture-dialog");
  familyPicture.addEventListener("click", function () {
    familyPicture.classList.toggle("zoomed");
  });
}

document.getElementById("search-btn").addEventListener("click", (event) => {
  event.preventDefault();
  filteredFamilies(filterParams);
});

let filterParams = {};

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach((checkbox) => {
  let name = checkbox.name;
  filterParams[name] = checkbox.checked;

  checkbox.addEventListener("change", () => {
    filterParams[name] = checkbox.checked;
  });
});

function getQueryparamsFromFilter(object) {
  let params = [];
  Object.entries(object).forEach(([key, value]) => {
    if (value === true) {
      params.push(key);
    }
  });

  return params.length > 0 ? params.join("&") : "";
}

const searchArea = document.getElementById("search");
let searchValue = "";

searchArea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    filteredFamilies(filterParams);
  }
  searchValue = e.target.value.toLowerCase();
});

function returnSearchParams(searchValue, filterParams) {
  const searchParamString = getQueryparamsFromFilter(filterParams);
  let queryString = "";

  if (searchValue && searchParamString) {
    queryString = `value=${searchValue}&${searchParamString}`;
  } else if (searchValue) {
    queryString = `value=${searchValue}`;
  } else if (searchParamString) {
    queryString = searchParamString;
  }

  return queryString;
}

async function filteredFamilies() {
  const search = returnSearchParams(searchValue, filterParams);

  try {
    const request = await fetch(`http://localhost:3000/families?${search}`);
    const response = await request.json();
    const familiesArray = response;
    displayFamilies(familiesArray);
    console.log(familiesArray);
  } catch (error) {
    console.error("There was an error:", error);
  }
}

window.onload = getFamilies;
