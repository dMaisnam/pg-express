const { Router } = require("express")
const { 
  getAll, 
  post,
  get, 
  put,
  remove
} = require("../controllers/blog.controller")
// import { 
//   postArticleSchema, 
//   putArticleSchema 
// } from "../schema/article.schema"
// import validate from "../middlewares/validate"

const router = Router()

router.get("/", getAll)
router.post("/", post)
router.get("/:id", get)
router.put("/:id", put)
router.delete("/:id", remove)
// router.post("/", validate(postArticleSchema), postArticle)
// router.put("/:id", validate(putArticleSchema), putArticle)

module.exports = router