import express from "express";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { onlyFiveFromId } from "./helper/index.js";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

// beacuse of type moudles

const PORT = 3500;
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
	console.log(`listening ${PORT}`);
});

// const httpServer = createServer();

const io = new Server(expressServer, {
	cors: {
		origin:
			process.env.NODE_ENV === "production"
				? false
				: ["http://localhost:57391", "http://127.0.0.1:57391"],
	},
});

io.on("connection", (socket) => {
	console.log(`User ${onlyFiveFromId(socket.id)} connected`);

	// Upon connection - only to user
	socket.emit("message", "Welcome to the chat");

	// Upon connection - to all others
	socket.broadcast.emit(
		"message",
		`User ${onlyFiveFromId(socket.id)} connected`,
	);

	// Listening for message event
	socket.on("message", (data) => {
		console.log(data);
		io.emit("message", `${onlyFiveFromId(socket.id)} : ${data}`);
	});

	// Listening for message event
	socket.on("disconnect", (data) => {
		console.log(data);
		socket.broadcast.emit("message", `${onlyFiveFromId(socket.id)} disconnected`);
	});

	socket.on("activity", (name) => {
		socket.broadcast.emit("activity", name);
	});
});
