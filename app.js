/////////////////////////
// Made by Seth Stitik //
/////////////////////////

console.log("Made by Seth Stitik (:");
console.log("Don't worry, your location information is not stored or viewed!");

let weather = {
    apikey: '${{ secrets.OPENWEATHERMAP_API_KEY }}',
    units: {
        imperial: {
            temperature: "imperial",
            windSpeed: "mph",
            temperatureSymbol: " °F",
            windSpeedSymbol: " mph"
        },
        metric: {
            temperature: "metric",
            windSpeed: "km/h",
            temperatureSymbol: " °C",
            windSpeedSymbol: " kmh"
        }
    },
    currentUnit: "imperial",

    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=" +
            this.units[this.currentUnit].temperature +
            "&appid=" +
            this.apikey
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },

    fetchWeatherByLocation: function (latitude, longitude) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
            latitude +
            "&lon=" +
            longitude +
            "&units=" +
            this.units[this.currentUnit].temperature +
            "&appid=" +
            this.apikey
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },

    fetchBackgroundImage: function (city) {
        const unsplashApiKey = '${{ secrets.UNSPLASH_API_KEY }}';
        const unsplashApiUrl = `https://api.unsplash.com/search/photos?query=${city}&per_page=1&client_id=${unsplashApiKey}`;

        fetch(unsplashApiUrl)
            .then((response) => response.json())
            .then((data) => {
                if (data.results && data.results.length > 0) {
                    const imageUrl = data.results[0].urls.regular;
                    document.body.style.backgroundImage = `url('${imageUrl}')`;
                }
            })
            .catch((error) => {
                console.error("Error fetching background image:", error);
            });
    },



    toggleUnit: function () {
        const unitToggle = document.getElementById("unit-toggle");
        this.currentUnit = unitToggle.textContent.includes("°C") ? "metric" : "imperial";
        unitToggle.textContent = this.currentUnit === "imperial" ? "°C" : "°F";
        const searchBar = document.querySelector(".search-bar");
        if (searchBar.value !== "") {
            this.search();
        } else {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        this.fetchWeatherByLocation(latitude, longitude);
                    },
                    (error) => {
                        console.log("Error getting location:", error);
                        this.search();
                    }
                );
            } else {
                console.log("Geolocation is not supported by this browser.");
                this.search();
            }
        }
    },


    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed, deg } = data.wind;
        const directions = ["North ", "NE ", "East ", "SE ", "South ", "SW ", "West ", "NW "];
        const direction = directions[Math.round(deg / 45) % 8];

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp) + weather.units[weather.currentUnit].temperatureSymbol;
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";

        let windSpeed;
        if (weather.currentUnit === "metric") {
            windSpeed = Math.round(speed * 3.6 / 1.609) + weather.units[weather.currentUnit].windSpeedSymbol;
        } else if (weather.currentUnit === "imperial") {
            windSpeed = Math.round(speed / 1.609) + weather.units[weather.currentUnit].windSpeedSymbol;
        }

        document.querySelector(".wind").innerText = "Wind: " + direction + windSpeed;
        document.querySelector(".weather").classList.remove("loading");
        this.fetchBackgroundImage(name);
    },


    search: function () {
        const searchValue = document.querySelector(".search-bar").value;
        this.fetchWeather(searchValue);
        this.fetchBackgroundImage(searchValue);
    }
};

document
    .querySelector(".search button")
    .addEventListener("click", function () {
        weather.search();
    });

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});

document.getElementById("unit-toggle").addEventListener("click", function () {
    weather.toggleUnit();
});

weather.toggleUnit();

/////////////////////////
// Made by Seth Stitik //
/////////////////////////
