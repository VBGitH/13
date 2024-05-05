
let btnLoad = document.getElementById('load')
btnLoad.onclick = () => {
    async function success(position) {
        let lat = position.coords.latitude
        let lon = position.coords.longitude

        //let res = await fetch(`http://localhost:3000/api/weather?lat=${lat}&lon=${lon}&temp=C`)
        
        let res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&temp=C`)
       
        let weatherData = await res.json()
        
        let hAdress = document.getElementById('adress')
        let hTemp = document.getElementById('temp')
        let hTempC = document.getElementById('tempC')
        let dIcon = document.getElementById('icon')
        let dFeel = document.getElementById('feel')
        let dHum = document.getElementById('hum')
        let dWind = document.getElementById('wind')

        hAdress.innerText = weatherData.city
        hTemp.innerText = weatherData.temp
        hTempC.innerText = weatherData.tempUnit
        let imgAdr = weatherData.icon
        dIcon.innerHTML = `<img src="${imgAdr}" alt="">`
        dHum.innerText = "влажность: " + weatherData.humidity + "%"
        dWind.innerText = "ветер: " + weatherData.wind + " м/с"

        //история запросов

        res = await fetch(`/api/requests`)
        resJson = await res.json()
        
        let hTbl = document.getElementById('tblRec')
        let htmlTable = ''

        /*  Шапка таблицы */

        htmlTable += `<tr>
                        <td><strong>Дата запроса</strong></td>
                        <td><strong>Город</strong></td>
                        <td><strong>Температура</strong></td>
                        <td><strong>Ветер</strong></td>
                        <td><strong>Влажность</strong></td>
                      </tr>`                     

        /*  вывод последних 5 запросов  */
        
        let maxRows = 5
        let rowCount = Object.keys(resJson).length
        let sup = rowCount
        let inf = Math.max(1, sup - maxRows)

        for (let i = sup; i > inf; i-- ){
          let elm = resJson[i - 1] 
          htmlTable += `<tr>
                          <td>${elm.dateRequest}</td>
                          <td>${elm.city}</td>
                          <td>${elm.temp}</td>
                          <td>${elm.wind}</td>
                          <td>${elm.humidity}</td>
                        </tr>`  
        }                      
        
        hTbl.innerHTML = htmlTable
      }
    
      function error() {
        status.textContent = "Unable to retrieve your location";
      }
    
      if (!navigator.geolocation) {
        status.textContent = "Geolocation is not supported by your browser";
      } else {
        status.textContent = "Locating…";
        navigator.geolocation.getCurrentPosition(success, error);
      }
  }
