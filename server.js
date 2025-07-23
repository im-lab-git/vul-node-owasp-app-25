const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// --- VULNERABILITY: Using outdated middleware ---
// Older versions of Express and its middleware have known vulnerabilities.
// For example, Express 4.16.4 is susceptible to some regex denial of service attacks.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static HTML file from a 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// In-memory "database" to store comments for the XSS demo
let comments = [{ username: "Alice", comment: "This is a great post! Very informative." }];

// --- Stored XSS Vulnerability Endpoint ---
// This endpoint retrieves all comments. The frontend will render them.
app.get("/comments", (req, res) => {
	res.json(comments);
});

// This endpoint accepts new comments and stores them without any sanitization.
app.post("/comments", (req, res) => {
	const { username, comment } = req.body;
	if (username && comment) {
		const newComment = { username, comment };
		comments.push(newComment);
		console.log("Stored new comment:", newComment);
		res.status(201).json(newComment);
	} else {
		res.status(400).send("Username and comment are required.");
	}
});

// --- Broken Access Control Vulnerability Endpoint ---
// This endpoint exposes sensitive data without any authentication or authorization checks.
app.get("/api/admin/data", (req, res) => {
	console.log("ALERT: Unauthorized access to /api/admin/data");
	res.status(200).json({
		message: "SUCCESS: You have accessed the sensitive admin data.",
		data: {
			serverVersion: "1.0.0-beta",
			activeUsers: 1337,
			systemStatus: "All systems nominal.",
		},
	});
});

app.listen(PORT, () => {
	console.log(`Vulnerable server running on http://localhost:${PORT}`);
	console.log('Serving static files from the "public" directory.');
});
