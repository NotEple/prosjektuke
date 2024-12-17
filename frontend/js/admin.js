const name = document.getElementById("name");
const title = document.getElementById("title");
const description = document.getElementById("description");
const properties = document.querySelectorAll(".properties");
const picture = document.getElementById("picture");
const newFamilyForm = document.getElementById("new-family-form");
const families = document.getElementById("families");

const editFamilyDialog = document.getElementById("edit-family");
const editForm = document.getElementById("edit-family-form");
const editProperties = document.querySelectorAll(".edit-family-properties");

let familiesArray = [];
let editFamilyProperties = {};
let familyId;

picture.addEventListener("change", (e) => {
  console.log(e.target.files[0]);
});

// ? Listens to the submit of the form.
newFamilyForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let familyProperties = {};
  properties.forEach((item) => {
    familyProperties[item.value] = item.checked;
  });

  const formData = new FormData();

  formData.append("family_name", name.value);
  formData.append("family_title", title.value);
  formData.append("family_description", description.value);

  if (picture.files && picture.files[0]) {
    formData.append("family_picture", picture.files[0]);
  } else {
    formData.append("family_picture", "https://thispersondoesnotexist.com");
  }

  formData.append("family_properties", JSON.stringify(familyProperties));

  newFamily(formData);
  newFamilyForm.reset();
});

// ? Creates a new family by taking a body as paremeter
async function newFamily(body) {
  const createFamilyRequest = "http://localhost:3000/families";
  try {
    await fetch(createFamilyRequest, {
      method: "POST",
      body: body,
    });
  } catch (error) {
    console.log(error);
  }
}

// ? Gets a list of all families
async function getFamilies() {
  try {
    const req = await fetch("http://localhost:3000/families");
    const res = await req.json();
    familiesArray = res;

    renderFamilies();
  } catch (error) {
    console.log(error);
  } finally {
    console.log(familiesArray);
  }
}

// ? Renders the families/Updates the families
function renderFamilies() {
  families.innerHTML = "";

  familiesArray.forEach(
    (family) =>
      (families.innerHTML += `<div class="family-${family.family_id} family-card">
                                <div>
                                  <p class="family-card" >${family.family_name}</p>
                                  <p class="family-card" id="onerem">${family.family_title}</p>
                                  <img class="family-card" style="width: 20%;" src="${family.family_picture}" />
                                </div>
                               
                                <button class="family-card grey-button" id="onerem" onclick="editFamilyById(${family.family_id})" type="button">Edit</button>
                             
                              <button class="family-card grey-button" id="onerem" onclick="deleteFamily(${family.family_id})" type="button">Delete</button>
                              </div>`)
  );
}

// ? Delete a family by id
async function deleteFamily(id) {
  editFamilyDialog.style.display = "none";
  try {
    const req = await fetch(`http://localhost:3000/families/${id}`, {
      method: "DELETE",
    });
    if (req.ok) {
      console.log(`Successfully deleted family! ID - ${id}`);
      const familyCard = document.querySelector(`.family-${id}`);
      if (familyCard) familyCard.remove();
    }
  } catch (error) {
    console.log(error);
  }
}

async function getFamilyById(id) {
  try {
    const req = await fetch(`http://localhost:3000/families/${id}`);
    const res = await req.json();
    return res;
  } catch (error) {
    console.log(error);
  }
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("family_id", familyId);
  formData.append("family_name", document.getElementById("family_name").value);
  formData.append(
    "family_title",
    document.getElementById("family_title").value
  );
  formData.append(
    "family_description",
    document.getElementById("family_description").value
  );

  if (
    document.getElementById("family_picture").files &&
    document.getElementById("family_picture").files[0]
  ) {
    formData.append(
      "family_picture",
      document.getElementById("family_picture").files[0]
    );
  } else {
    formData.append(
      "family_picture",
      document.getElementById("family_picture_url").src
    );
  }

  formData.append("family_properties", JSON.stringify(editFamilyProperties));

  editFamily(formData);
  editForm.reset();
});

// ?
async function editFamilyById(id) {
  familyId = id;
  const family = await getFamilyById(id);

  const familyPicture = document.getElementById("family_picture_url");
  familyPicture.src = family.family_picture;

  editFamilyDialog.showModal();

  document.getElementById("family_name").value = family.family_name;
  document.getElementById("family_title").value = family.family_title;
  document.getElementById("family_description").value =
    family.family_description;
  document.getElementById("family_picture").filename = family.family_picture;

  const checkboxes = document.querySelectorAll(".edit-family-properties");

  checkboxes.forEach((checkbox) => {
    const propertyName = checkbox.getAttribute("name");

    checkbox.checked = family.family_properties[propertyName] || false;

    editFamilyProperties[propertyName] = checkbox.checked;

    checkbox.addEventListener("change", () => {
      editFamilyProperties[propertyName] = checkbox.checked;
    });
  });
}

// ? Send a PUT request to the API
async function editFamily(body) {
  const id = body.get("family_id");
  try {
    const request = await fetch(`http://localhost:3000/families/${id}`, {
      method: "PUT",
      body: body,
    });
    const response = await request.json();

    console.log(response);

    if (!request.ok) {
      throw new Error("Failed to update family object");
    }
    console.log("Family updated successfully!");

    getFamilies();
    editFamilyDialog.close();
  } catch (error) {
    console.log("Error updating family:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getFamilies();
});
