// import { 
//   fetchAllUsers, 
//   fetchUserById, 
//   createNewUser, 
//   updateUser, 
//   removeUser
// } from "../services/user.service"

const pool = require("../utils/db")

const getAll = async (_req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const response = await pool.query(`SELECT id, name, slug, bio, role, created_at, updated_at FROM person ORDER BY updated_at DESC`)
    
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
    const response = await pool.query(`SELECT id, name, slug, bio, role, created_at, updated_at FROM person WHERE id = $1`, [id])
    
    if (response.rowCount === 0) return res.status(404).json({ message: `User wit ID ${id} does not exist` })
    
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
      `INSERT INTO person (
        name, slug, bio, role, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, current_timestamp, current_timestamp
      ) RETURNING id, name`,
      [body.name, body.slug, body.bio, body.role]
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
    
    const user = await pool.query(`SELECT id FROM person WHERE id = $1`, [id])
    // console.log(user.rowCount)
    if (user.rowCount === 0) return res.status(404).json({ message: `User wit ID ${id} does not exist` })
    
    const response = await pool.query(
    `UPDATE person 
      SET name = $1, slug = $2, bio = $3, role = $4, updated_at = current_timestamp 
      WHERE id = $5 
      RETURNING id, name, slug, bio, role, created_at, updated_at`,
      [body.name, body.slug, body.bio, body.role, id]
    )
    // const updated = updateUser(req.params.id, req.body)
    res.status(200).json({ success: true, data: response.rows[0] })
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong : ${err}` })
  }
}

const remove = async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
    const { id } = req.params
    const user = await pool.query(`SELECT id FROM person WHERE id = $1`, [id])
    
    if (user.rowCount === 0) return res.status(404).json({ message: `User wit ID ${id} does not exist` })
    
    // removeUser(req.params.id)
    await pool.query(`DELETE FROM person WHERE id = $1`, [id])

    res.status(200).json({ success: true, message: "Successfull deleted user" })
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