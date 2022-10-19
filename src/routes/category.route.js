const { Router } = require("express")
const { 
  getAll, 
  post,
  get, 
  put,
  remove
} = require("../controllers/category.controller")
// import { 
//   postCategorySchema, 
//   putCategorySchema 
// } from "../schema/category.schema"
// import validate from "../middlewares/validate"

const router = Router()

router.get("/", getAll)
router.post("/", post)
router.get("/:id", get)
router.put("/:id", put)
router.delete("/:id", remove)
// router.post("/", validate(postCategorySchema), post)
// router.put("/:id", validate(putCategorySchema), put)

module.exports = router