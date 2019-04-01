import React, { Component } from 'react';
import './App.css';
import { getForecasts } from './javascript/data/Repository';

const baseStyle = (icon) => {
	return {
		backgroundImage: `url(https://vortex.accuweather.com/adc2010/images/slate/icons/${icon}.svg)`
	};
};

const WeatherCard = ({ day, forecast, setActive, index, activeIndex }) => {
	return (
		<div className={activeIndex === index ? 'card is-active' : 'card'} onClick={setActive}>
			<p className="over-line color-caption">{day}</p>
			<div className="icon" style={baseStyle(forecast.Day.Icon)} />
			<div className="card-body">
				<div className="">
					<div style={{ display: 'flex' }}>
						<p className="caption mx-4px ">{forecast.Temperature.Maximum.Value + ' °'}</p>
						<p className="caption mx-4px  color-caption">{forecast.Temperature.Minimum.Value + ' °'}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const WeatherDetail = ({ forecast, city }) => {
	return (
		<div className="weather-details">
			<div className="side-left">
				<p>{city}</p>
				<div className="detail-icon" style={baseStyle(forecast.Day.Icon)} />
				<p className="color-caption">Speed: {forecast.Day.Wind.Speed.Value} km/h</p>
				<p className="color-caption">Direction: {forecast.Day.Wind.Direction.Degrees}°</p>
			</div>
			<div className="side-right">
				<p>{Math.ceil(forecast.Temperature.Maximum.Value) + '°'}</p>
				<p className="color-caption">/ {forecast.Temperature.Minimum.Value + '°'}</p>
			</div>
		</div>
	);
};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			city: '',
			forecasts: [],
			isLoading: true,
			index: 0,
			activeIndex: 0
		};
	}

	loadData = () => {
		getForecasts((location, data) => {
			this.setState({ isLoading: true });
			this.setState({
				city: location,
				forecasts: data
			});
			this.setState({ isLoading: false });
		});
	};

	componentDidMount() {
		this.loadData();
		setInterval(() => {
			this.loadData();
		}, 600000);
	}

	parseDay = (date) => new Date(date).toDateString().split(' ').shift();

	transform = () => ({
		transform: `translateX(-${this.state.index * (100 / this.state.forecasts.length)}%)`
	});

	previous = () => {
		this.state.index > 0 && this.setState({ index: this.state.index - 1 });
	};

	next = () => {
		this.state.index < this.state.forecasts.length - 3 && this.setState({ index: this.state.index + 1 });
	};

	setActive = (index) => {
		this.setState({ activeIndex: index });
	};

	render() {
		const { forecasts, activeIndex, isLoading } = this.state;
		return (
			<div>
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<div className="parent-card">
						<WeatherDetail forecast={forecasts && forecasts[activeIndex]} city={this.state.city} />
						<div className="ok d-flex align-items-center justify-content-center">
							<div className="fav-button" onClick={this.previous}>
								<i className="fas fa-xs fa-chevron-left" />
							</div>
							<div className="carousel-wrapper">
								<div className="carousel container" style={this.transform()}>
									{forecasts.map((forecast, index) => {
										return (
											<WeatherCard
												setActive={() => this.setActive(index)}
												forecast={forecast}
												day={this.parseDay(forecast.Date)}
												index={index}
												activeIndex={this.state.activeIndex}
												key={index}
											/>
										);
									})}
								</div>
							</div>
							<div className="fav-button" onClick={this.next}>
								<i className="fas fa-xs fa-chevron-right pl-2px " />
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default App;
