const app = require("./app");
const config = require("./app/config");

// Starting server
const PORT = config.app.port;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})