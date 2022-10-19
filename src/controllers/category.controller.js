// import { 
//   fetchAllCategories, 
//   fetchCategoryById, 
//   createNewCategory, 
//   updateCategory, 
//   removeCategory
// } from "../services/category.service"

const pool = require("../utils/db")

const getAll = async (_req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const response = await pool.query(`SELECT id, title, slug, created_at, updated_at FROM category ORDER BY updated_at DESC`)
    
    res.status(200).json({ success: true, count: response.rowCount, data: response.rows }) 
    // res.status(200).send(JSON.stringify({ success: true, data: response.rows }, null, 2))
  } catch (err) {
    return res.status(400).json({ success: false, message: `Something went wrong : ${err}` })
  }
}

const get = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const { id } = req.params
    const response = await pool.query(`SELECT * FROM category WHERE id = $1`, [id])
    
    if (response.rowCount === 0) return res.status(404).json({ message: `Category wit ID ${id} does not exist` })
    
    res.status(200).json({ success: true, data: response.rows[0] })
    // res.status(200).send(JSON.stringify({ success: true, data: response.rows[0] }, null, 2))
  } catch (err) {
    return res.status(400).json({ message: `Something went wrong : ${err}` })
  }
}

const post = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const body = req.body
    const response = await pool.query(
      `INSERT INTO category (
        title, slug, created_at, updated_at
      ) VALUES (
        $1, $2, current_timestamp, current_timestamp
      ) RETURNING id, title`,
      [body.title, body.slug]
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
    
    const category = await pool.query(`SELECT id FROM category WHERE id = $1`, [id])
    // console.log(category.rowCount)
    if (category.rowCount === 0) return res.status(404).json({ message: `Category wit ID ${id} does not exist` })
    
    const response = await pool.query(
    `UPDATE category 
      SET title = $1, slug = $2, updated_at = current_timestamp 
      WHERE id = $3 
      RETURNING id, title, slug, created_at, updated_at`,
      [body.title, body.slug, id]
    )
    // const updated = updateCategory(req.params.id, req.body)
    res.status(200).json({ success: true, data: response.rows[0] })
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong : ${err}` })
  }
}

const remove = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const { id } = req.params
    const category = await pool.query(`SELECT id FROM category WHERE id = $1`, [id])
    
    if (category.rowCount === 0) return res.status(404).json({ message: `Category wit ID ${id} does not exist` })
    
    // removeCategory(req.params.id)
    await pool.query(`DELETE FROM category WHERE id = $1`, [id])

    res.status(200).json({ success: true, message: "Successfull deleted category" })
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