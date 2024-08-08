const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "Healthy and Running !" });
});

app.post("/addRecord", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email)
    return res.status(400).json({ msg: "Mandatory fields missing!" });

  res.status(200).json({ msg: "Healthy and Running !" });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
