import express, { json } from "express";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import path from "path";

const __dirname = path.resolve();

const app = express();
const port = 3000;
app.use([json({ limit: "10mb" }), cors({ origin: "http://127.0.0.1:8080" })]);

app.listen(port, console.log(`Listening on port ${port}...`));

const upload = multer({ dest: "server/uploads/" });

const uploadPath = "server/families.json";

// Serve uploaded images
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, "server/uploads", req.params.filename);
  res.sendFile(filePath);
});

// ? Load/read the families from the families.json
const loadFamilies = () => JSON.parse(fs.readFileSync(uploadPath, "utf-8"));

// ? Update the families.json with new data
const saveFamilies = (families) =>
  fs.writeFileSync(uploadPath, JSON.stringify(families, null, 2));

// ? Keep track of the current id
let currentId = loadFamilies().length;

// ! CRUD Endpoints

// ? POST REQUEST - Create a new family to add to families
app.post("/families", upload.single("family_picture"), (req, res) => {
  const { file, body } = req;
  console.log(file, body);

  const familyObj = {
    family_id: currentId,
    family_name: body.family_name,
    family_title: body.family_title,
    family_description: body.family_description,
    family_picture: file
      ? `http://localhost:3000/uploads/${file.filename}`
      : req.body.family_picture,
    family_properties: JSON.parse(body.family_properties),
  };

  if (req.body) {
    const families = loadFamilies();
    families.push(familyObj);
    currentId += 1;
    saveFamilies(families);
    res.status(200).json({ message: "New family added!" });
  } else {
    res.status(404).json({ message: "Failed to add a new family..." });
  }
});

// ? GET REQUEST ALL FAMILIES - Get a list of all families
app.get("/families", (req, res) => {
  const families = loadFamilies();

  const { query } = req;

  // If no query parameters, return all families
  if (!Object.keys(query).length) {
    return res.json(families);
  }

  // Filter families based on the query parameters
  const filteredFamilies = families.filter((family) => {
    return Object.entries(query).every(([key, value]) => {
      if (key === "value") {
        return family.family_description.toLowerCase().includes(value);
      }
      return family.family_properties[key];
    });
  });

  res.json(filteredFamilies);
});

// ? GET REQUEST BY ID - Get a specific family
app.get("/families/:id", (req, res) => {
  const families = loadFamilies();

  const filteredFamilies = families.find(
    (family) => family.family_id === Number(req.params.id)
  );

  if (!filteredFamilies) res.status(404).json({ message: "Family not found" });

  res.send(filteredFamilies);
});

// ? PUT REQUEST - Edit a family by id
app.put("/families/:id", upload.single("family_picture"), (req, res) => {
  const { file, body } = req;

  const families = loadFamilies();

  const familyId = Number(req.params.id);

  const familyIndex = families.findIndex(
    (family) => family.family_id === familyId
  );

  if (familyIndex === -1) {
    return res.status(404).json({ message: "Family not found" });
  }

  const oldPicture = families[familyIndex].family_picture;

  // Check if a file is uploaded and if the old picture is not the placeholder
  if (file) {
    if (oldPicture.startsWith("http://localhost:3000/uploads/")) {
      const filename = oldPicture.replace("http://localhost:3000/uploads/", "");

      try {
        console.log(`Deleting old image: ${filename}`);
        fs.unlinkSync(__dirname + "/server/uploads/" + filename);
      } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
      }
    }
  }

  // Create the updated family object
  const editedFamilyObj = {
    family_id: familyId,
    family_name: body.family_name,
    family_title: body.family_title,
    family_description: body.family_description,
    family_picture: file
      ? `http://localhost:3000/uploads/${file.filename}`
      : oldPicture, // Keep the old picture if no new file is uploaded
    family_properties: JSON.parse(body.family_properties),
  };

  // Update the family record
  families[familyIndex] = {
    ...families[familyIndex],
    ...editedFamilyObj,
  };

  saveFamilies(families);

  res.json({ message: "Your family was successfully updated!" });
});

// ? DELETE REQUEST - Delete a family by id
app.delete("/families/:id", (req, res) => {
  let families = loadFamilies();

  const familyId = Number(req.params.id);

  const familyIndex = families.findIndex(
    (family) => family.family_id === familyId
  );

  if (familyIndex !== -1) {
    const familyPicture = families[familyIndex].family_picture;

    if (familyPicture.startsWith("http://localhost:3000/uploads/")) {
      const filename = familyPicture.replace(
        "http://localhost:3000/uploads/",
        ""
      );

      try {
        fs.unlinkSync(__dirname + "/server/uploads/" + filename);
      } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
      }
    }

    const updatedFamilies = families.filter(
      (family) => family.family_id !== familyId
    );

    saveFamilies(updatedFamilies);
    res.status(200).sendStatus(200);
  } else {
    res.status(404).json({ error: "Family not found" });
  }
});
