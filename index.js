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
    .then (responseJson=> getTrails(responseJson.results[0].geometry.location))
    .catch (error => console.log(error.message));
    
}

function getTrails(coordinates) {
 console.log(coordinates);
 let latLong = Object.keys(coordinates).map(key=>`${key}=${coordinates[key]}`)
 console.log(latLong); 
}

function getWeather() {
/* url https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=&product=observation&latitude=41.83&longitude=-87.68 */

}

function signUpListener() {
 console.log('sign up listener ran');
}

function activateListeners() {
    searchListener();
    signUpListener();
}

$(activateListeners);