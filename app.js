const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours: tours
    }
  })
}

const getTour = (req, res) => {
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
}

const updateTour = (req, res) => {

  const id = Number(req.params.id)

  if (id > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "wrong id"
    })
  }

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
}

const createNewTour = (req, res) => {
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
}


app.get('/api/v1/tours', getAllTours)
app.get('/api/v1/tours/:id', getTour)
app.patch('/api/v1/tours/:id', updateTour)
app.post('/api/v1/tours', createNewTour)




app.listen(3000, () => {
  console.log('Waiting for request');

})