const userTab  = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorImgContainer = document.querySelector("[data-errorImg]")


// Give access to current using tab
let currentTab = userTab;

let APIkey = "057fe5de0d7dafe089ed2a47c2f112bb";

//  Add the CSS to the current using tab
currentTab.classList.add("current-tab");

// Store the coordinates

getfromSessionStorage();

// Switching between the tab

function switchTab(clickedTab) {
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        //  Add active class for the current tab
        // searchForm tab
        if(!searchForm.classList.contains("active")){
            //  if searchFrom tab is invisible the make the tab visible
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
            errorImgContainer.classList.remove("active");
        }
        else{
            // To remove the search tab and make the yourWeather tab visible
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorImgContainer.classList.remove("active");
            // To display the userWeather tab first check the local
            // storage for the coordinates if they are saved in it
            getfromSessionStorage();
        }

    }
}


// Add event listeners to the tabs to switch

userTab.addEventListener("click" , () =>{
    // pass clicked tab as input to the switchTab
    switchTab(userTab);
});

searchTab.addEventListener("click" , ()=> {
    // pass the clicked tab as the input to the searchTab
    switchTab(searchTab);
});


function getfromSessionStorage(coordinates){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    // If local coordinates not present then fetch the coordinates
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherDetails(coordinates);
    }
}

// Get the weather details and display in the yourWeather container
async function fetchWeatherDetails(coordinates){

    const {lat , lon} = coordinates;

    // make the grant access container invisible

    grantAccessContainer.classList.remove("active");

    // make the loading screen visible

    loadingScreen.classList.add("active");

    errorImgContainer.classList.remove("active")

    // API call

    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`);
        const data = await response.json();
        console.log(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("Found error" , err);


    }

}

// Get the weather details dynamical for the userInfoContainer
function renderWeatherInfo(weatherInfo){
    //  fetch the elements the are in userInfoContainer

    const cityName = document.querySelector("[data-cityName]");
    const countryFlag = document.querySelector("[data-countryFlag]");
    const Desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    //  Fetch values from eather Info and put it in UI elements
    cityName.innerText = weatherInfo?.name;
    if(cityName.innerText === "undefined"){
        userInfoContainer.classList.remove("active");
        errorImgContainer.classList.add("active");
    }
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    Desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    //`http://openwe athermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    kelvin = `${weatherInfo?.main?.temp}`;
    let celsius = parseInt(kelvin) - 273.15;
    celsius = celsius.toFixed(2);
    temp.innerText = `${celsius} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

};

// Function to get the loaction of the user

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geo Location Access");
    }
}

//  Function  of show position

function showPosition(position) {
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates" ,JSON.stringify(userCoordinates));
    fetchWeatherDetails(userCoordinates);
}

// Add event listener on the grant access location

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click" , getLocation);


// Add event lisenter  on search form

const searchInput  = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e) => {

    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === "") {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});


// Display the weather information by the city name in search form
async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorImgContainer.classList.remove("active");

    try{

        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        alert("Found error" , err);

    }
};



