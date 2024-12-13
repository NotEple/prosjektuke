async function data() {
  try {
    const response = await fetch("families.json");
    const families = await response.json();

    families.forEach((family) => {
      const familyContainer = document.createElement("div");
      familyContainer.classList.add("family-info-container");

      const familyTitle = document.createElement("h3");
      familyTitle.innerHTML = `Family Title: <span id="family-title">${family.title}</span>`;
      familyContainer.appendChild(familyTitle);

      const preferencesContainer = document.createElement("div");
      preferencesContainer.classList.add("preferences-results");

      const preferences = [
        { label: "Pets Allowed", value: family.petsAllowed },
        { label: "Smoking Allowed", value: family.smokingAllowed },
        { label: "Vegan Friendly", value: family.veganFriendly },
        { label: "Overnight Stay", value: family.overnightStay },
      ];

      preferences.forEach((pref) => {
        const p = document.createElement("p");
        p.textContent = `${pref.label}: ${pref.value}`;
        preferencesContainer.appendChild(p);
      });

      familyContainer.appendChild(preferencesContainer);

      const familyImage = document.createElement("img");
      familyImage.src = family.image;

      familyContainer.appendChild(familyImage);

      document
        .getElementById("families-container")
        .appendChild(familyContainer);
    });
  } catch (error) {
    console.error("Error loading families data:", error);
  }
}

window.onload = data;
