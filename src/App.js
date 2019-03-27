import React, { Component } from 'react';
import './App.css';
import { getForecasts } from './javascript/data/Repository'

const WeatherCard = ({ day, forecast }) => {
  console.log(forecast.Day.Icon)
  const baseStyle = (i) => {
    return {
      backgroundImage: `url(https://vortex.accuweather.com/adc2010/images/slate/icons/${i}.svg)`
    }
  }

  return (
    <div className="card">
      <p className="over-line color-caption">{day}</p>
      <div className="icon" style={baseStyle(forecast.Day.Icon)}></div>
      <div className="card-body">
        <div className="">
          <div className="d-flex">
            <p className="caption">{forecast ? forecast.Temperature.Maximum.Value + " °" : ""}</p>
            <p className="caption color-caption">{forecast ? forecast.Temperature.Minimum.Value + " °" : ""}</p>
          </div>
        </div>
      </div>
    </div>)
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      forecast: [],
      isLoading: true
    }
  }

  loadData = () => {
    getForecasts((location, data) => {
      this.setState({ isLoading: true })
      this.setState({
        city: location,
        forecast: data
      })
      this.setState({ isLoading: false })
    })
  }

  componentDidMount() {
    this.loadData()
    setInterval(() => {
      this.loadData()
    }, 600000)
  }

  parseDay = (date) => new Date(date).toDateString().split(" ").shift()

  next 

  render() {
    let forecasts = this.state.forecast
    console.log(this.state.isLoading)
    return (
      <div className="weather-board">

        <div className="main">
          <div className="stage"></div>

          <div className="ok d-flex align-items-center justify-content-center">
            <div className="fav-button">
              <i class="fas fa-xs fa-chevron-left"></i>
            </div>
            <div className="carousel-wrapper">
              <div className="carousel container">
                {
                  this.state.isLoading ?
                    <p>Loading...</p> :
                    forecasts.map((forecast, index) => {
                      console.log(forecast)
                      return <WeatherCard forecast={forecast} day={this.parseDay(forecast.Date)} key={index} />
                    })
                }
              </div>
            </div>

            <div className="fav-button" onClick = {this.next}>
              <i class="fas fa-xs fa-chevron-right"></i>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default App;