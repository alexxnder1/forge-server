import * as colors from './json/console-colors.json';
import axios from "axios";

const WEATHER_UPDATE_MIN = 60;
const TIME_UPDATE_MIN = 1;

var temp = 0;
var date = new Date();

const updateTime = () => {
    let hour = date.getHours();
    let minute = date.getMinutes();

    if(hour != mp.world.time.hour)
        mp.world.time.hour = hour;

    mp.world.time.minute = minute;
};

const updateWeather = () => {
    axios.get('https://api.openweathermap.org/data/2.5/weather?lat=45.15&lon=26.833&appid=1772a548ae10c0c495ffdd6d59fae353').then(res => {
        let weather_name =  res.data.weather[0].main.toUpperCase();
        mp.world.weather = weather_name;
        temp = res.data.main.temp - 273.15;
        console.log(`${colors.red}[Weather] ${colors.reset}Id: ${colors.red}${weather_name}${colors.reset}.`);
    })
};
mp.events.addProc("getTemp", () => temp);

setInterval(updateTime, TIME_UPDATE_MIN*60000);
setInterval(updateWeather, WEATHER_UPDATE_MIN*1000*60);
updateTime();
updateWeather();

console.log(`${colors.red}[Server]${colors.reset} Started at ${colors.red}${date.toLocaleTimeString()}`);