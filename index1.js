console.log("Hello");

const APIkey = '057fe5de0d7dafe089ed2a47c2f112bb';

// Add the temperature value to the document
function renderWeatherInfo(data) {
    let newPara = document.createElement('p');

    newPara.textContent = `${data?.main?.temp.toFixed(2)}`

    document.body.appendChild(newPara);
}


//  Get weather details with city name
async function fetchWeatherDetails() {

    try{
        let city = 'visakhapatnam';

        console.log(city);

        let response =await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`);
        let data = await response.json();

        renderWeatherInfo(data);

    }
    catch(e){

        console.log('Found error' , e);

    }

};


//  Get weather details by using latitude and longitude
async function getCustomWeatherDetails() {

    try{
        let latitude =56.04;
        let longitude = 34.02;

        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}`);

        let data = await result.json();

        console.log(data);

    }
    catch(e){

        console.log('Found err' , e);
    }
}


//  switch between the Tabs
function switchTab(clickedTab){

    apiErrorContainer.classList.remove("active");

    if(currentTab != clickedTab){

        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        cuurentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //getFormSessionStorage();
        }

        //console.log("current Tab" , currentTab);
    }
}


// Get the present location details
function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No geo Location Support");
    }
}

// Get the latitude and longitude details
function showPosition(position) {
    let lat = position.coords.latitude;
    let longi =position.coords.longitude;

    console.log(lat);
    console.log(longi);
}

