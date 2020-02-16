const trailKey = "200684769-4f084c0cbb58312f47d7cfd6e89ac282";
const weatherKey = "XGoPHLmsO_f_rZvqGnD0QBbGAAbVCCcRtNKhjJZKv5A";
const geocodeKey = "AIzaSyDkSZLOdZd5QDjTrFXfRkJaj_drwGI2DNw";
let maxDistance = 10;

/* event listener for search submit */
function searchListener(){
 console.log('search listener ran');
    $('.search-form').submit(event => {
        event.preventDefault();
        let searchQuery = $('#search').val();
        maxDistance = $('#max-distance').val();
        console.log(searchQuery);
        formatQuery(searchQuery);
        resetResults();
    });
}

function resetResults() {
    $('.results-container').removeClass("hidden");
    $('.js-weather').removeClass("hidden");
    $('.js-trail').removeClass("hidden");
    $('.app-details').addClass("hidden");
    $('.js-weather-results').empty();
    $('.js-current-weather').empty();
    $('.js-trail-results').empty();
    $('.search-form').find('p').empty(); 
}
/* removes extra characters and formats search query */
function formatQuery(searchQuery) {
 let search = searchQuery.trim().replace(/,/g, "").split(" ").join("+");
    console.log(search);
    geocodeAddress(search);
}

/* uses google geocode API to find latitude and longitude of location */
function geocodeAddress(address) {
    let url=`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${geocodeKey}`;

 fetch(url)
    .then (response=> {
        if(response.ok) {
        return response.json();
        } throw new error(response.statusText);
        })
    .then (responseJson=>latLong(responseJson.results[0].geometry.location))
    .catch (error => $('.search-form').append(`<p>something went wrong, please try again.</p>`));
    
}
/* retrieves coordinates and assigns them to variables to pass into getTrails and getWeather functions */
function latLong(coordinates) {
    let latitude= coordinates.lat;
    let longitude= coordinates.lng;
    getTrails(latitude, longitude, maxDistance);
    getWeather(latitude, longitude);
}

/* uses trail run project API to find trails nearby location */
function getTrails(latitude, longitude, maxDistance) {
 console.log(latitude, longitude);

 let trailUrl = `https://www.trailrunproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=${maxDistance}&maxResults=200&key=${trailKey}`;

 fetch (trailUrl)
    .then (trailResponse=> {
        if(trailResponse.ok) {
        return trailResponse.json();
        }
        throw new error(trailResponse.statusText);
    })
    .then(trailResponseJson=> { 
        console.log(trailResponseJson);
        displayTrailResults(trailResponseJson)})
    .catch (error=> {
        console.log(error.message)
        $('.js-trail-results').text('Something went wrong. Please try again later.')
    });

 console.log(latitude, longitude); 
}

/* display trail results in the DOM */
function displayTrailResults(trailResponseJson) {
    let result = trailResponseJson.trails.length;
    if (trailResponseJson.trails.length === 0) {
        $('.js-trail-results').text('No trails found. Please try a different address.')
    } else {
    $('.js-trail-results').append(trailResponseJson.trails.map(trail=> `<li><h3>${trail.name}</h3></li>
    <li><i>${trail.summary}</i></li>
    <li>Difficulty: ${trail.difficulty}</li>
    <li>Location: ${trail.location}</li>
    <li>Condition: ${trail.conditionStatus}</li>
    <li>Length: ${trail.length} miles </li>
    <li><a href="${trail.url}" target="_blank">More Details</a></li>`));
    }
    $('.results').text(result);
}

/* uses weather Here API to retrieve results for the weather of location */
function getWeather(latitude, longitude) {
    let weatherUrl =`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${weatherKey}&product=observation&product=forecast_7days_simple&latitude=${latitude}&longitude=${longitude}`;
    fetch(weatherUrl)
    .then(weatherResponse=> {
        if (weatherResponse.ok) {
       return weatherResponse.json();
        }
        throw new error(weatherRepsonse.statusText);
    })
    .then(weatherResponse=> {
        console.log(weatherResponse);
        displayWeatherResults(weatherResponse);
    })
    .catch(error=> $('.js-weather-results').text(`Something went wrong, please try again`));

}
/* displays weather results to the DOM */
function displayWeatherResults(weather) {
let currentWeather= weather.observations.location[0].observation[0];
   let dailyForcasts = weather.dailyForecasts.forecastLocation.forecast;
   console.log(currentWeather);
   console.log(dailyForcasts);
   $('.js-current-weather').append(`<h2>Current Weather</h2><h3>Neighborhood: ${weather.observations.location[0].city}</h3>`).append(`<li class="temp"><h3>${tempCalculator(currentWeather.temperature)}<span>&#8457;</span></h3>
   <li>${currentWeather.description}</li>
   <li>Humidity: ${currentWeather.humidity}%</li>
   `);
   $('.js-weather-results').append(`<h2> 7 Day Forecast </h2>`).append(dailyForcasts.map(weather=>`<li><h3>${weather.weekday}</h3></li>
   <li>Low Temp: ${tempCalculator(weather.lowTemperature)}<span>&#8457;</span></li>
   <li>High Temp: ${tempCalculator(weather.highTemperature)}<span>&#8457;</span></li>
   <li>Humidity: ${weather.humidity}%</li>
   <li>Chance of Precipitation: ${weather.precipitationProbability}%</li>
   <li><i>${weather.precipitationDesc}</i></li>

   `));
}

/* converts celsius to farhenheight and rounds up to nearest whole integer */
function tempCalculator (num) {
    return Math.ceil((num *1.8) + 32);
}
/* event listener for email signup form */
function signUpListener() {
 console.log('sign up listener ran');
 $('.signup-form').on('submit', event=> {
    $('.email-message').empty();
    let email="";
    email =$('#email').val();
    console.log(email);
     if (/\S+@\S+\.\S+/.test(email)) {
        $('.email-message').append(`Thanks, you're all signed up!`); 
        return false;
     } else {
         event.preventDefault();
   $('.email-message').text(`Please provide a valid email address.`);
            }
    });
}

function activateListeners() {
    searchListener();
    signUpListener();
}

$(activateListeners);