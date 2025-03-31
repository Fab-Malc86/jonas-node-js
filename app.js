const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))



app.get('/', (req, res) => {
  res.status(200).send('Hello from server')


})

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours: tours
    }
  })
})

app.get('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id)

  if (id > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "wrong id"
    })
  }

  const tour = tours.find(el => el.id === id)

  res.status(200).json({
    status: "success",
    data: {
      tours: tour
    }
  })
})


app.patch('/api/v1/tours/:id', (req, res) => {

  const id = Number(req.params.id)

  if (id > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "wrong id"
    })
  }

  const tour = tours.find(el => el.id === id)

  tours[id].duration = "sgays"
  console.log(tours[id].duration);

  const tourMod = Object.assign(tours[id], req.body)
  console.log(tourMod);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    if (err) {
      return res.status(404).json({
        status: "fail",
        message: "error on writing file"
      })
    }
    res.status(201).json({
      status: "success",
      data: {
        tours: tourMod
      }
    })
  })



})



app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1

  const newTour = Object.assign({ id: newId }, req.body)
  tours.push(newTour)

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    if (err) {
      return res.status(404).json({
        status: "fail",
        message: "error on writing file"
      })
    }
    res.status(201).json({
      status: "success",
      data: {
        tours: newTour
      }
    })
  })


})




app.listen(3000, () => {
  console.log('Waiting for request');

})