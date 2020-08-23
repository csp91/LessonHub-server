const express = require('express')
const app = express()
const pool = require('./db')
const cors = require('cors')
const fileUpload = require('express-fileupload')
app.use(cors())
app.use(fileUpload())

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
    const newTest = await pool.query(
      `SELECT * FROM lesson WHERE grade = '${grade}'`,
    )
    res.setHeader('Content-Type', 'application/json')
    res.send(newTest.rows)
  } catch (err) {
    console.error(err.message)
  }
})

//-----ITEM-------
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file upload' })
  }

  const file = req.files.file

  file.mv(`${__dirname}/uploads/${file.name}`, err => {
    if (err) {
      console.error(err)
      return res.status(500).send(err)
    }

    res.json({ fileName: file.name, filePath: `uploads/${file.name}` })
  })
})


app.listen(8080, () => {
  console.log('listening on port 8080')
})
