import './style.css'

//Weather Data Class
class WeatherData {
    constructor(data) {
        this.location = data.resolvedAddress;
        this.timezone = data.timezone;
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
                hourIcon: hour.icon
            }))
        })
        );
    }
}
//Fetch using base http w apikey and URIencode in the link
async function fetchData(input) {
    try {
        const apiKey = '4FTEFML9N6VESYMLQRJW4RYL8';
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURI(input)}?key=${apiKey}`)
        console.log(response);

        const data = await response.json();

        console.log(data);
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
    console.log('form was clicked');
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
    const timeZone = weatherData.timezone;

    const currentLocalTime = convertTimezone(timeZone);
    console.log(`Current time is ${new Date()} and the timezone is: ${timeZone}, and the local time formatted is ${currentLocalTime}`);

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
        todayTemp.classList.add('temperature');
        todayTemp.setAttribute('data-temp', currentDay.temperature)
        todayTemp.setAttribute('data-unit', 'F')
        todayTemp.textContent = `${currentDay.temperature}°F`;

        const currentLocation = document.querySelector('.current-location');
        currentLocation.textContent = weatherData.location;

        const currentTime = document.querySelector('.current-time');
        currentTime.textContent = `As of ${currentLocalTime}`;
        //select additional info on today weather
        const feelsLike = document.querySelector('.feels-like-temp');
        feelsLike.classList.add('temperature');
        feelsLike.setAttribute('data-temp', currentDay.temperature)
        feelsLike.setAttribute('data-unit', 'F')
        feelsLike.textContent = `${currentDay.feelsLike}°F`;

        const chanceOfRain = document.querySelector('.rain-chance');
        chanceOfRain.textContent = `${currentDay.chanceOfRain}%`;

        const humidity = document.querySelector('.humidity');
        humidity.textContent = `${currentDay.humidity}%`;

        const windSpeed = document.querySelector('.wind-speed-value');
        windSpeed.textContent = `${currentDay.windSpeed}m/s`;

        const sunrise = document.querySelector('.sunrise-time');
        sunrise.textContent = formatTime(currentDay.sunrise);

        const sunset = document.querySelector('.sunset-time');
        sunset.textContent = formatTime(currentDay.sunset);
    }

    //Current day for each hour
    currentDay.hours.forEach(hour => createHourCards(hour));
}

//Create Hour cards in this function then use this function to do a for each hour
function createHourCards(hour) {
    const overTimeScroll = document.querySelector('.weather-over-time-scroll');

    const hourContainer = document.createElement('div');
    const hourIcon = document.createElement('div');
    const hourTime = document.createElement('div');
    const hourTemp = document.createElement('div');

    hourContainer.className = 'hour';
    hourIcon.className = 'icon';
    hourTime.className = 'hour-time';
    hourTemp.className = 'temp';
    hourTemp.classList.add('temperature');
    hourIcon.classList.add = hour.hourIcon;

    hourTime.textContent = formatTime(hour.time);
    hourTemp.textContent = `${hour.temp}°F`;

    hourTemp.setAttribute('data-temp', hour.temp);
    hourTemp.setAttribute('data-unit', 'F');

    hourContainer.appendChild(hourTime);
    hourContainer.appendChild(hourIcon);
    hourContainer.appendChild(hourTemp);

    overTimeScroll.appendChild(hourContainer);
}

//Convert YYYY-MM-DD format to a Day of the week
function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

//Convert HH:MM:SS format to 12hr Format
function formatTime(timeString) {
    //parse the string into the respective parts
    const [hourStr, minuteStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    //Determine AM/PM period
    const period = hour >= 12 ? 'PM' : 'AM';

    //convert to 12hr format
    hour = hour % 12 || 12; //Convert to 0 to 12 for midnight;

    //Return formatted time
    return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
}
//Get local time of when data was fetched 
function convertTimezone(timezone) {
    //Get current local time
    const localTime = new Date();

    //Create options for formatting
    const options = {
        timeZone: timezone,
        hour: 'numeric',
        hour12: true
    };

    //Format local date to specified timezone
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(localTime);

    //Extract the hour and period
    const [hour, period] = formattedTime.split(' ');

    return `${parseInt(hour, 10)} ${period}`;
}
//Append weather icons based on data "icon" in API 

//have C and F toggles
function convertCelsius(temp) {
    return (temp - 32) * 5 / 9;
}

function convertFahrenheit(temp) {
    return (temp * 9 / 5) + 32;
}

//Convert alls
function convertAllCelsius() {
    const tempContainers = document.querySelectorAll('.temperature');

    tempContainers.forEach(container => {
        //Get current temp vlaue and unit from attribute
        let tempF = parseFloat(container.getAttribute('data-temp'));
        let unit = container.getAttribute('data-unit');

        if (unit === 'F') {
            //Convert to Celsius
            let tempC = convertCelsius(tempF);

            container.textContent = `${tempC.toFixed(1)}°C`

            container.setAttribute('data-temp', tempC.toFixed(1))
            container.setAttribute('data-unit', 'C');
        }
    })
}

function convertAllFahrenheit() {
    const tempContainers = document.querySelectorAll('.temperature');

    tempContainers.forEach(container => {
        //Get current temp vlaue and unit from attribute
        let tempC = parseFloat(container.getAttribute('data-temp'));
        let unit = container.getAttribute('data-unit');

        if (unit === 'C') {
            //Convert to Celsius
            let tempF = convertFahrenheit(tempC);

            container.textContent = `${tempF.toFixed(1)}°F`

            container.setAttribute('data-temp', tempF.toFixed(1))
            container.setAttribute('data-unit', 'F');
        }
    })
}
addEventListener('DOMContentLoaded', () => {
    document.querySelector('#fahrenheit').addEventListener('click', convertAllFahrenheit);

    document.querySelector('#celsius').addEventListener('click', convertAllCelsius);
})

//have hourly/week toggles