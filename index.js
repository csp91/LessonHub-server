const express = require('express')
const app = express()
const pool = require('./db')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const fileUpload = require('express-fileupload')
app.use(cors())
app.use(fileUpload())
app.use(bodyParser.json())

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
      `SELECT * FROM lesson WHERE grade = '${grade}'`,
    )

    res.setHeader('Content-Type', 'application/json')
    res.send(lessons.rows)
  } catch (err) {
    console.error(err.message)
  }
})

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

app.post('/lesson', cors(corsOptions), async (req, res) => {
  const { title, description, grade, email } = req.body

  try {
    const author = await pool.query(
      `SELECT * FROM "user" WHERE email = '${email.toLowerCase()}'`,
    )

    if (author.rows.length > 0) {
      console.log(req.body)
      const lesson = await pool.query(`INSERT INTO "lesson" (title, description, grade, author_id)
      VALUES ('${title}', '${description}', '${grade}', ${author.rows[0].id} ) RETURNING *;`)
      res.setHeader('Content-Type', 'application/json')
      res.send(lesson.rows[0].id)
    }

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


app.listen(8080, () => {
  console.log('listening on port 8080')
})
