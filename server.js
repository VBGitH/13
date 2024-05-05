const express = require('express')
const app = express()
const port = 3000

require('dotenv').config()

const mongoose = require('mongoose')
//mongoose.connect('mongodb://127.0.0.1:27017/meteoDB')
mongoose.connect(process.env.MONGODB_URI)
const weatherRequest = mongoose.model('weatherRequest', { 
  city          : String,
  lat           : String,
  lon           : String,
  humidity      : String,
  wind          : String,
  temp          : String,
  tempUnit      : String,
  icon          : String,
  dateRequest   : String, 
})

app.use('/', express.static('public'));

app.get('/api/weather', async (req, res) => {
    
    /*
    http://localhost:3000//api/weather?lat=64.614336&lon=32.242278&temp=C
    */

    let lat = req.query.lat
    let lon = req.query.lon
    let temp = req.query.temp

    let key = '9a116ac36af7abeb1a9817c92526e136'
    let resData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&lang=ru`)
    let resDataJson = await resData.json()

    let tempData = ''
    let tempUnit = ''
    let humData = resDataJson.main.humidity
    let windData = resDataJson.wind.speed
    let currentDate = new Date()

    if (temp == 'C'){
        tempData = tempData + Math.round(resDataJson.main.temp - 273.15)
        tempUnit = "°C"
    }else{
        tempData = tempData + resDataJson.main.temp
        tempUnit = "°K"    
    }

    let icon = "https://openweathermap.org/img/wn/" + resDataJson.weather[0].icon + "@2x.png"
  
    res.json({
        'city' : resDataJson.name,
        'lat' : resDataJson.coord.lat,
        'lon' : resDataJson.coord.lon,
        'humidity' : humData,
        'wind' : windData,
        'temp' : tempData,
        'tempUnit' : tempUnit,
        'icon' : icon
    })

    /* ---- запись БД ---- */
    const wRequest = new weatherRequest()
    wRequest.city = resDataJson.name
    wRequest.lat = resDataJson.coord.lat
    wRequest.lon = resDataJson.coord.lon
    wRequest.humidity = humData
    wRequest.wind = windData
    wRequest.temp = tempData
    wRequest.tempUnit = tempUnit
    wRequest.icon = icon
    wRequest.dateRequest = currentDate
  
    await wRequest.save()

  })

app.get('/api/requests', async (req, res) => {
  
    let mReq = await weatherRequest.find()
    res.json(mReq)

  })

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})

app.get('/api/test', async (req, res) => {
  
  res.json({

      'city' : 'petr'
  })

})