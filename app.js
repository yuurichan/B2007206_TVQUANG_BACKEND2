const express = require("express");
const cors = require("cors");

const app = express();

const contactsRouter = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");

// Adding middlewares
app.use(cors());
app.use(express.json());

// Routers
app.use("/api/contacts", contactsRouter);

// Handle 404/Error Response
app.use((req, res, next) => {
    // This part will run when user accessed an unknown/undefined route
    // next() will be called to return an error
    return next(new ApiError(404, "Resource not found"));
})

// Define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    // Middleware xử lý lỗi tập trung
    // Trong các đoạn code xử lý ở các route, gọi next(error) sẽ chuyển
    // về middleware xử lý lỗi này
    return res.status(err.statusCode || 500).json({
        message: err.errMessage || "Internal Server Error",
    });
    // ApiError làm tham số của next <=> là tham số của middleware này
});
// Simply put, this one will take the attributes of ApiError class and process them in this middleware,
// which, in turn, will return an appropriate error.

app.get("/", (req, res) => {
    res.status(200);
    res.json({message: "Welcome to Contact book application."});
});

module.exports = app;
