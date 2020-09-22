$(document).ready(function () {
  // get localstorage parse and fetch last city in array then run displaycity
  let storedCities = localStorage.getItem("cities");
  storedCities = JSON.parse(storedCities);
  if(storedCities!=null) {
    let lastCity = storedCities[storedCities.length - 1];
    gettingWeather(lastCity);
  }
  
  

  fetchCities();
  function fetchCities() {
    let citiesStringified = localStorage.getItem("cities");
    let cities;
    if (citiesStringified === null) {
      cities = [];
    } else {
      // parse the cities to an array
      cities = JSON.parse(citiesStringified);
    }

    $("#cityButtons ul").empty();
    cities.forEach((city) => {
      let buttonLi = $("<li>").append($("<button>").text(city)); //create li, button and append results from input
      buttonLi.on("click", function (event) {
        gettingWeather($(this).text()); //run function gettingWeather and display to page
      });
      $("#cityButtons ul").prepend(buttonLi); // prepend into it ul from html by ID
    });
  }

  let citySearchButton = document.getElementById("citySearchButton");

  citySearchButton.addEventListener("click", displayCity);

  function displayCity(event) {
    // To stop browser from  refreshing the page on form submission
    event.preventDefault();
    let citySearchValue = document.getElementById("citySearchInput").value;
    if (citySearchValue.length === 0) {
      //search field is empty and button presses return,do nothing
      return;
    }
    gettingWeather(citySearchValue);
    addCity(citySearchValue);
  }

  function addCity(city) {
    //Check if city is empty, if it is return

    // Fecth current cities from local storage
    let stringCities = localStorage.getItem("cities");
    let parsedCities;
    if (stringCities === null) {
      parsedCities = [];
    } else {
      // parse the cities to an array
      parsedCities = JSON.parse(stringCities);
    }

    // push new city into array
    parsedCities.push(city);
    // stringify cities array
    let stringifiedCities = JSON.stringify(parsedCities);
    // setitem to new strinigify cties array
    localStorage.setItem("cities", stringifiedCities);
    fetchCities();
  }

  function gettingWeather(city) {
    let APIKey = "8c9a4efabb69f58227603ac1d8e1c12c";

    // Here we are building the URL we need to query the database
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      let currentWeatherDiv = $("#dailyWeather"); //declaring variable based on dailyWether id
      currentWeatherDiv.empty(); //to make sure it's empty after every search
      let date = moment().format("DD/MM/YYYY"); //declaring the date from moment
      let icon = response.weather[0].icon;
      let iconurl = "https://openweathermap.org/img/w/" + icon + ".png";
      let img = $("<img>");
      img.attr("src", iconurl);

      let cityName = response.name; //declared variable to call the object
      currentWeatherDiv.append($("<h2>").text(cityName + " " + date)); // to append cityName to newly createdH2
      currentWeatherDiv.append(img);
      let cityTemp = response.main.temp; //grab it from the response name in the console
      currentWeatherDiv.append(
        $("<p>").text("Temperature: " + cityTemp + " °C")
      );
      let cityWind = response.wind.speed;
      currentWeatherDiv.append(
        $("<p>").text("Wind Speed: " + cityWind + " MPH")
      );
      let cityHum = response.main.humidity;
      currentWeatherDiv.append($("<p>").text("Humidity: " + cityHum + " %"));

      let lat = response.coord.lat;
      let long = response.coord.lon;
      getUV(lat, long);
      gettingForecast(cityName);
    });
  }

  function getUV(lat, lon) {
    let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=8c9a4efabb69f58227603ac1d8e1c12c`;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      let currentWeatherDiv = $("#dailyWeather");

      let ptag = $("<p>");
      ptag.text("UV Index: ");

      let cityUV = response.value;
      let bgrCityUV = $("<span>");
      bgrCityUV.addClass(["badge", "badge-danger"]);
      bgrCityUV.text(cityUV);

      ptag.append(bgrCityUV);

      currentWeatherDiv.append(ptag);
    });
  }
});

function gettingForecast(city) {
  let APIKey = "8c9a4efabb69f58227603ac1d8e1c12c";
  let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    let forecast = response.list;
    let fiveDayForecastDiv = $("#fiveDayForecast");
    fiveDayForecastDiv.empty();
    for (let i = 0; i <= 4; i++) {
      let card = $("<div>");
      card.addClass("col-md-2");

      let date = moment(forecast[i].dt_txt).format("DD/MM/YYYY");
      card.append($("<p>").text("Date: " + date));
      let icon = forecast[i].weather[0].icon;
      let iconurl = "https://openweathermap.org/img/w/" + icon + ".png";
      let img = $("<img>");
      img.attr("src", iconurl);
      card.append(img);

      let temperature = forecast[i].main.temp;
      card.append($("<p>").text("Temperature: " + temperature));
      let humidity = forecast[i].main.humidity;
      card.append($("<p>").text("Humidity: " + humidity));
      fiveDayForecastDiv.append(card);
    }
  });
}
