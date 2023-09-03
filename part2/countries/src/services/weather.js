//  Weather data by Open-Meteo.com
//  https://open-meteo.com/

import axios from "axios"

const baseUrl = 'https://api.open-meteo.com/v1'

const getWeather = (lat, long) => {
    const request = axios.get(`${baseUrl}/forecast?latitude=${lat}&longitude=${long}&daily=weathercode&current_weather=true&windspeed_unit=ms&timezone=auto&forecast_days=1`)

    return request.then(response => response.data)
}

export default { getWeather }