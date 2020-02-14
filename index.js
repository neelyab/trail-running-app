const trailKey = "200684769-4f084c0cbb58312f47d7cfd6e89ac282";
const weatherKey = "XGoPHLmsO_f_rZvqGnD0QBbGAAbVCCcRtNKhjJZKv5A";
const geocodeKey = "AIzaSyDkSZLOdZd5QDjTrFXfRkJaj_drwGI2DNw";

function searchListener(){
 console.log('search listener ran');
    $('.search-form').submit(event => {
        event.preventDefault();
        let searchQuery = $('#search').val();
        console.log(searchQuery);
        formatQuery(searchQuery);
    });
}

function formatQuery(searchQuery) {
 let search = searchQuery.trim().replace(/,/g, "").split(" ").join("+");
    console.log(search);
    geocodeAddress(search);
}

function geocodeAddress(address) {
    let url=`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${geocodeKey}`;
    let coordinates;
 fetch(url)
    .then (response=> response.json())
    .then (responseJson=>latLong(responseJson.results[0].geometry.location))
    .catch (error => console.log(error.message));
    
}
function latLong(coordinates) {
    let latitude= coordinates.lat;
    let longitude= coordinates.lng;
    getTrails(latitude, longitude);
    getWeather(latitude, longitude);
}

function getTrails(latitude, longitude) {
 console.log(latitude, longitude);

 let trailUrl = `https://www.trailrunproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=30&maxResults=20&key=${trailKey}`;

 fetch (trailUrl)
    .then (trailResponse=>trailResponse.json())
    .then(trailResponseJson=> {
        console.log(trailResponseJson);
        displayTrailResults(trailResponseJson)})
    .catch (error=> console.log(error.message));

 console.log(latitude, longitude); 
}

function displayTrailResults(trailResponseJson) {
    $('.js-trail-results').empty();
    $('.js-trail-results').append(trailResponseJson.trails.map(trail=> `<li><h3>${trail.name}</h3></li>
    <li><i>${trail.summary}</i></li>
    <li>Difficulty: ${trail.difficulty}</li>
    <li>Location: ${trail.location}</li>
    <li>Condition:${trail.conditionStatus}</li>
    <li><a href="${trail.url}" target="_blank">More Details</a></li>`));
}

function getWeather() {
    let weatherUrl =`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${weatherKey}&product=observation&latitude=${latitude}&longitude=${longitude};`

}

function signUpListener() {
 console.log('sign up listener ran');
}

function activateListeners() {
    searchListener();
    signUpListener();
}

$(activateListeners);