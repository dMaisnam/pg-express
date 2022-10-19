const { Router } = require("express")
const { 
  getAll, 
  post,
  get, 
  put,
  remove
} = require("../controllers/user.controller")
// import { 
//   postUserSchema, 
//   putUserSchema 
// } from "../schema/user.schema"
// import validate from "../middlewares/validate"

const router = Router()

router.get("/", getAll)
router.post("/", post)
router.get("/:id", get)
router.put("/:id", put)
router.delete("/:id", remove)
// router.post("/", validate(postUserSchema), post)
// router.put("/:id", validate(putUserSchema), put)

module.exports = router