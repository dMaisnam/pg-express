// import { 
//   fetchAllArticles, 
//   fetchArticleById, 
//   createNewArticle, 
//   updateArticle, 
//   removeArticle
// } from "../services/article.service"

const pool = require("../utils/db")

const getAll = async (_req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const response = await pool.query(
      `SELECT blog.id, blog.title, blog.excerpt, blog.feature_image, blog.category_id, category.title AS category_title, category.slug AS category_slug, blog.author_id, person.name AS author_name, person.bio AS author_bio, blog.created_at 
      FROM blog 
      INNER JOIN category
      ON blog.category_id = category.id
      INNER JOIN person
      ON blog.author_id = person.id
      ORDER BY blog.updated_at DESC`
    )
    
    // res.status(200).json({ success: true, count: response.rowCount, data: response.rows }) 
    res.status(200).send(JSON.stringify({ success: true, count: response.rowCount, data: response.rows }, null, 2))
  } catch (err) {
    return res.status(400).json({ success: false, message: `Something went wrong : ${err}` })
  }
}

const get = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const { id } = req.params
    const response = await pool.query(
      `SELECT blog.id, blog.title, blog.excerpt, blog.feature_image, blog.category_id, category.title AS category_title, category.slug AS category_slug, blog.author_id, person.name AS author_name, person.bio AS author_bio, blog.created_at, blog.updated_at 
      FROM blog 
      INNER JOIN category
      ON blog.category_id = category.id
      INNER JOIN person
      ON blog.author_id = person.id
      WHERE blog.id = $1`, 
      [id]
    )
    
    if (response.rowCount === 0) return res.status(404).json({ message: `Article wit ID ${id} does not exist` })
    
    // res.status(200).json({ success: true, data: response.rows[0] })
    res.status(200).send(JSON.stringify({ success: true, data: response.rows[0] }, null, 2))
  } catch (err) {
    return res.status(400).json({ message: `Something went wrong : ${err}` })
  }
}

const post = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const body = req.body
    const response = await pool.query(
      `INSERT INTO blog (
        title, excerpt, content, feature_image, category_id, author_id, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, current_timestamp, current_timestamp
      ) RETURNING id, title`,
      [body.title, body.excerpt, body.content, body.feature_image, body.category_id, body.author_id]
    )
    
    res.status(201).json({ success: true, data: response.rows[0] })
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong : ${err}` })
  }
}

const put = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const { id } = req.params
    const body = req.body
    
    const blog = await pool.query(`SELECT id FROM blog WHERE id = $1`, [id])
    // console.log(blog.rowCount)
    if (blog.rowCount === 0) return res.status(404).json({ message: `Article wit ID ${id} does not exist` })
    
    const response = await pool.query(
    `UPDATE blog 
      SET title = $1, excerpt = $2, content = $3, feature_image = $4, category_id = $5, author_id = $6, updated_at = current_timestamp 
      WHERE id = $7 
      RETURNING id, title, excerpt, content, feature_image, category_id, author_id, created_at, updated_at`,
      [body.title, body.excerpt, body.content, body.feature_image, body.category_id, body.author_id, id]
    )
    // const updated = updateArticle(req.params.id, req.body)
    res.status(200).json({ success: true, data: response.rows[0] })
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong : ${err}` })
  }
}

const remove = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const { id } = req.params
    const blog = await pool.query(`SELECT id FROM blog WHERE id = $1`, [id])
    
    if (blog.rowCount === 0) return res.status(404).json({ message: `Article wit ID ${id} does not exist` })
    
    // removeArticle(req.params.id)
    await pool.query(`DELETE FROM blog WHERE id = $1`, [id])

    res.status(200).json({ success: true, message: "Successfull deleted article" })
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong : ${err}` })
  }
}

module.exports = {
  getAll,
  get,
  post,
  put,
  remove
}