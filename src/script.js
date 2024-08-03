import './style.css'

//Weather Data Class
class WeatherData {
    constructor(data) {
        this.location = data.resolvedAddress
        this.days = data.days.map(day => ({
            dateTime: day.datetime,
            temperature: day.temp,
            condition: day.conditions,
            feelsLike: day.feelslike,
            chanceOfRain: day.precipprob,
            humidity: day.humidity,
            windSpeed: day.windspeed,
            sunrise: day.sunrise,
            sunset: day.sunset,
            icon: day.icon,

            hours: day.hours.map(hour => ({
                time: hour.datetime,
                temp: hour.temp,
                hourCondition: hour.conditions
            }))
        })
        );
    }
}
//Fetch using base http w apikey and URIencode in the link
async function fetchData(input) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURI(input)}?key=${apiKey}`)
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching data: ', error);
        document.querySelector('.error').textContent = error.message;
    }
}
//Get data, update page every time someone searches a location
const form = document.querySelector('.location-search')

form.addEventListener('submit', async event => {
    event.preventDefault();

    const input = document.querySelector('#search').value;

    const data = await fetchData(input);

    if (data) {
        //Put data in class if exists
        const weatherData = new WeatherData(data);
        //call function to display weather data
        displayWeather(weatherData);
    }
})

function displayWeather(weatherData) {
    //Assigning the first item in the days array to be the current day
    const currentDay = weatherData.days[0];

    //Select today weather 
    if (currentDay) {
        const weatherCondition = document.querySelector('.conditions');
        //update values
        weatherCondition.textContent = currentDay.condition

        const todayDate = document.querySelector('.day');
        //update values
        todayDate.textContent = getDayOfWeek(currentDay.dateTime);

        const todayIcon = document.querySelector('.today-icon');
        todayIcon.classList.add(currentDay.icon);

        const todayTemp = document.querySelector('.today-temp');
        todayTemp.textContent = currentDay.temperature;

        const currentLocation = document.querySelector('.current-location');
        currentLocation.textContent = weatherData.location;

        const currentTime = document.querySelector('current-time');
        //select additional info on today weather
        const feelsLike = document.querySelector('.feels-like-temp');
        feelsLike.textContent = currentDay.feelsLike;

        const chanceOfRain = document.querySelector('.rain-chance');
        chanceOfRain.textContent = currentDay.chanceOfRain;

        const humidity = document.querySelector('.humidity');
        humidity.textContent = currentDay.humidity;

        const windSpeed = document.querySelector('.wind-speed-value');
        windSpeed.textContent = currentDay.windSpeed;
        const sunrise = document.querySelector('.sunrise-time');
        sunrise.textContent = currentDay.sunrise;

        const sunset = document.querySelector('.sunset-time');
        sunset.textContent = currentDay.sunset;

        //select hour forecast
    }
}
//Convert YYYY-MM-DD format to a Day of the week
function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

//Append weather icons based on data "icon" in API 

//have C and F toggles

//have hourly/week toggles