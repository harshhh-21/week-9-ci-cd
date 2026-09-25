const express = require("express");

const app = express();

const PORT = process.env.PORT || 3001;
const VERSION = process.env.APP_VERSION || "v1";

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Week 9 CI/CD</title>
        </head>
        <body>
            <h1>DevOps CI/CD Demo</h1>
            <h2>Application Version: ${VERSION}</h2>
            <p>Deployed through Jenkins.</p>
        </body>
        </html>
    `);
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        version: VERSION
    });
});

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});
