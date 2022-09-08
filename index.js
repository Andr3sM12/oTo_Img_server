const express = require("express");
var http = require("http");
const app = express();
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server);

// variables para borrar archivos de carpeta uploads
const fs = require("fs");
const path = require("path");
const directory = "./uploads";
//

//middlewre
app.use(express.json());
var clients = {};
const routes = require("./routes");
app.use("/routes", routes);

//  Imagenes dirigidas a receptor
app.use("/uploads", express.static("uploads"));

io.on("connection", (socket) => {
	console.log("connetetd");
	console.log(socket.id, "has joined");
	socket.on("signin", (id) => {
		console.log(id);
		clients[id] = socket;
		console.log(clients);
	});
	socket.on("message", (msg) => {
		console.log(msg);
		let targetId = msg.targetId;
		if (clients[targetId]) clients[targetId].emit("message", msg);
	});
});

app.route("/check").get((req, res) => {
	return res.json("Your App is working fine");
});

server.listen(port, "0.0.0.0", () => {
	console.log("server started");
});

//borrar datos de carpeta Uploads cuando se reinicia el server
fs.readdir(directory, (err, files) => {
	if (err) throw err;

	for (const file of files) {
		fs.unlink(path.join(directory, file), (err) => {
			if (err) throw err;
		});
	}
});
