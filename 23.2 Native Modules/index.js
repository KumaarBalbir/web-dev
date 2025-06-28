const fs = require("fs");
fs.writeFile("output.txt", "Hail Hitler!", (err) => {
  if (err) throw err;
  console.log("Message written to file.");
});
