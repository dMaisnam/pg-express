require('dotenv').config()
const express = require("express")
const cors = require("cors")

const { PORT } = require("./src/utils/constants")
const blogsRouter = require("./src/routes/blog.route")
const categoriesRouter = require("./src/routes/category.route")
const usersRouter = require("./src/routes/user.route")

// Middlewares
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Routes
app.get("/_check", (_req, res) => res.status(200).json({ message: 'Server is OK 👍'}))
app.use("/blogs", blogsRouter)
app.use("/categories", categoriesRouter)
app.use("/users", usersRouter)

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`)
})