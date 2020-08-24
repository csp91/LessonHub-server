const path = require('path')
const express = require('express')
const app = express()
const pool = require('./db')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const fileUpload = require('express-fileupload')
const e = require('express')
let port = process.env.PORT || 8080
app.use(cors())
app.use(fileUpload())
app.use(bodyParser.json())

const publicPath = path.join(__dirname)

var corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET, POST, OPTIONS',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//ROUTES

//-----LESSONS--------
//GET
app.get('/lessons/:grade', cors(corsOptions), async (req, res) => {
  const { grade } = req.params
  try {
    const lessons = await pool.query(
      `SELECT lesson.*, a.first, a.last, a.email, a.phone FROM lesson 
      JOIN "user" as a
      ON lesson.author_id = a.id      
      WHERE grade = '${grade}'`,
    )

    res.setHeader('Content-Type', 'application/json')
    res.send(lessons.rows)
  } catch (err) {
    console.error(err.message)
  }
})


app.get('/search/lesson', cors(corsOptions), async (req, res) => {
  const word = req.query.word
  try {
    const lessons = await pool.query(
      `SELECT lesson.*, a.first, a.last, a.email, a.phone FROM lesson 
      JOIN "user" as a
      ON lesson.author_id = a.id WHERE LOWER(description) like '%${word.toLowerCase()}%' or LOWER(title) like '%${word.toLowerCase()}%' or LOWER(notes) like '%${word.toLowerCase()}%'`,
    )

    res.setHeader('Content-Type', 'application/json')
    res.send(lessons.rows)
  } catch (err) {
    console.error(err.message)
  }
})


//GET lessons by category
app.get('/lessons/cat/:cat', cors(corsOptions), async (req, res) => {
  const { cat } = req.params
  try {
    const lessons = await pool.query(
      `SELECT lesson.*, a.first, a.last, a.email, a.phone FROM lesson 
      JOIN "user" as a
      ON lesson.author_id = a.id WHERE category = '${cat}'`,
    )

    res.setHeader('Content-Type', 'application/json')
    res.send(lessons.rows)
  } catch (err) {
    console.error(err.message)
  }
})


//get file related to lesson
app.get('/lesson/:id/items', cors(corsOptions), async (req, res) => {
  const { id } = req.params
  try {
    const items = await pool.query(
      `SELECT ENCODE(file, 'base64') as files FROM item WHERE lesson_id = ${id}`,
    )

    res.send(items.rows)
  } catch (err) {
    console.error(err.message)
  }
})

//post lesson
app.post('/lesson', cors(corsOptions), async (req, res) => {
  const { title, description, grade, email, category, notes, first, last, phone } = req.body

  try {
    const author = await pool.query(
      `SELECT * FROM "user" WHERE email = '${email.toLowerCase()}'`,
    )

    let userid;
    if (author.rows.length == 0) {
      console.log(req.body)
      const reg = await pool.query(`INSERT INTO "user" (first, last, phone, email)
      VALUES ($1, $2, $3, $4) RETURNING *;`, [first, last, phone, email])
      userid = reg.rows[0].id
    } else {
      userid = author.rows[0].id
    }

    const lesson = await pool.query(`INSERT INTO "lesson" (title, description, grade, category, notes, author_id)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, [title, description, grade, category, notes, userid])
    res.setHeader('Content-Type', 'application/json')
    res.send(lesson.rows[0].id)

  } catch (err) {
    console.error(err.message)
  }
})

//-----ITEM-------
app.post('/upload', (req, res) => {
  const { name, id } = JSON.parse(req.body.jsondata)

  console.log(name, !name)
  console.log(id, !id)
  if (req.files === null || !name || !id) {
    return res.status(400).json({ msg: 'No file upload' })
  }

  const file = req.files.file

  file.mv(`${__dirname}/uploads/${file.name}`, async err => {
    if (err) {
      console.error(err)
      return res.status(500).send(err)
    }

    fs.readFile(`uploads/${file.name}`, async (err, data) => {
      if (err) {
        console.error(err)
      }
      try {
        const query = await pool.query(`INSERT INTO item (lesson_id, name, file) VALUES (${id}, '${name}', '\\x${data.toString('hex')}') RETURNING *;`,)

        res.send(query.rows[0].id)
      } catch (err) {
        console.log(err)
      }
    })
  })
})


app.listen(port, () => {
  console.log('listening on port 8080')
})
