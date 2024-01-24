const express = require('express')
const app = express()
const port = 8081

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dohyung:asd2464@loft.ornhmfo.mongodb.net/').then(() => console.log("Monggo DB Conected..."))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})