const http = require("http");

const options = {
    hostname: "127.0.0.1",
    port: 3001,
    path: "/health",
    method: "GET"
};

const request = http.request(options, (response) => {
    if (response.statusCode === 200) {
        console.log("TEST PASSED");
        process.exit(0);
    } else {
        console.error("TEST FAILED");
        process.exit(1);
    }
});

request.on("error", (error) => {
    console.error("TEST FAILED:", error.message);
    process.exit(1);
});

request.end();
