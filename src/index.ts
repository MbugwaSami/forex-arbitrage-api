import http from "http";
import app from "./app";

const server = http.createServer(app);
const port = process.env.PORT || 5000;


server.listen(port, () => {
    console.log(`Find me on http://localhost:${port}`);
});