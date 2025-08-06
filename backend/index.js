const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

connectToMongo();

const app = express();
const port = process.env.PORT || 5000;
const frontend_url = process.env.FRONTEND_URL;

// CORS config — correct usage
app.use(
  cors({
    origin: frontend_url,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// API routes — correct usage
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/quiz", require("./Routes/quiz"));
app.use("/api/question", require("./Routes/question"));
app.use("/api/result", require("./Routes/result"));


app.use(express.static(path.join(__dirname, "build")));


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
