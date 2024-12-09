const app = require("express")();
const { json } = require("express");
const families = require("../families.json");

const port = 3000;
app.use(json());
app.listen(port, console.log(`Listening on port ${port}...`));

const incrementId = () => {
  return families.length + 1;
};

app.get("/families", (req, res) => {
  res.send(families);
});

app.get("/family/by/:id", (req, res) => {
  const filteredFamilies = families.find(
    (family) => family.family_id === parseInt(req.params.id)
  );

  if (!filteredFamilies) {
    res.send("Error: No family with that id");
  }

  res.send(families[req.params.id]);
});

app.post("/family/create", (req, res) => {
  console.log(req.body);

  res.send(`Creating a family with id ${incrementId}`);
});

app.put("/family/edit/:id", (req, res) => {
  res.send(`Edit family with id ${req.params.id}`);
});

app.delete("family/delete/:id", (req, res) => {
  res.send(`Deleting family with id ${req.params.id}`);
});
