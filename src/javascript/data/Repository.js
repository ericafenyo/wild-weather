const querystring = require('querystring');
// An identifier used to locate forecast items in the `localeStorage`
// const FORECAST_KEY = "forecasts"
const ACCU_WEATHER_TOKEN = "zaFD829yYxLkuoqdLtibIBkU62E8GrOb"
const LOCATION_KEY_BASE_URL = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search"
const FORECAST_BASE_URL = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"

/**
 * Returns true if there are forecast items in the `localeStorage`.
 */
// const isValidCache = () => localStorage.getItem(FORECAST_KEY) ? true : false

const getPosition = (callback) => navigator.geolocation ?
  navigator.geolocation.getCurrentPosition(callback) :
  console.error("Geolocation is not supported by this browser.")

const getLocationKey = (position, callback) => {
  // Bulid location url
  const quries = { "apikey": ACCU_WEATHER_TOKEN, "q": `${position.coords.latitude},${position.coords.longitude}` }
  const queryParams = querystring.stringify(quries)
  const url = `${LOCATION_KEY_BASE_URL}?${queryParams}`

  hitServer(url)
    .then(forecastObject => {
      hitServer(FORECAST_BASE_URL + forecastObject.Key + `?apikey=${ACCU_WEATHER_TOKEN}&details=true&metric=true`)
        .then(forecast => {
          callback(forecastObject, forecast)
        });
    });
}

/**
 * Calls an API endpoint
 * @param {*} url 
 * @returns a Promise
 */
const hitServer = (url) => fetch(url)
  .then(response => response.json())

const getForecasts = (callback) => {
  getPosition(postion => {
    getLocationKey(postion, (location, data) => {
      callback(location.ParentCity? location.ParentCity.EnglishName:location.EnglishName, data.DailyForecasts)
    })
  })
}

export { getForecasts }