const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const filesRouter = require("./routes/files");

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(express.json());

app.use("/files", filesRouter);

app.get("/ping", (req, res) => {
	res.send("pong");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
