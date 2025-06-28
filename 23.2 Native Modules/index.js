const fs = require("fs");
fs.writeFile("output.txt", "Hail Hitler!", (err) => {
  if (err) throw err;
  console.log("Message written to file.");
});

fs.readFile("message.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
