const apiKey = "3dc7dc1d3d75ae72581957b905534af4";

function getWeatherMeaning(icon) {
    const meanings = {
        "01d": "Clear Sky (Day)",
        "01n": "Clear Sky (Night)",
        "02d": "Few Clouds",
        "02n": "Few Clouds",
        "03d": "Scattered Clouds",
        "03n": "Scattered Clouds",
        "04d": "Broken Clouds",
        "04n": "Broken Clouds",
        "09d": "Shower Rain",
        "09n": "Shower Rain",
        "10d": "Rain",
        "10n": "Rain",
        "11d": "Thunderstorm",
        "11n": "Thunderstorm",
        "13d": "Snow",
        "13n": "Snow",
        "50d": "Mist / Fog",
        "50n": "Mist / Fog"
    };
    return meanings[icon] || "Weather";
}

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const error = document.getElementById("error");
    const result = document.getElementById("weatherResult");
    const forecastDiv = document.getElementById("forecast");
    const searchCard = document.querySelector(".search-card");
    const container = document.querySelector(".container");

    error.textContent = "";
    forecastDiv.innerHTML = "";

    if (!city) {
        error.textContent = "Please enter a city name";
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) throw new Error();

            result.classList.remove("d-none");
            document.getElementById("cityName").textContent = "Today's Weather in: " + data.name;
            document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById("description").textContent = data.weather[0].description;
            document.getElementById("humidity").textContent = data.main.humidity;
            document.getElementById("wind").textContent = data.wind.speed;

            document.getElementById("weatherIcon").src =
                `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            document.querySelector(".rain").style.display =
                data.weather[0].main.toLowerCase().includes("rain") ? "block" : "none";

            document.querySelector(".lightning").style.display =
                data.weather[0].main.toLowerCase().includes("thunder") ? "block" : "none";

            container.style.display = "none";
            container.style.height = "0px";
            searchCard.style.display = "none";

            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        })
        .then(res => res.json())
        .then(forecastData => {
            const daily = forecastData.list.filter((_, i) => i % 8 === 0).slice(0, 7);

            daily.forEach(day => {
                const date = new Date(day.dt * 1000).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                });

                const card = document.createElement("div");
                card.className = "col-md-3 col-sm-6 forecast-card";
                card.innerHTML = `
                    <h5>${date}</h5>
                    <img class="forecast-icon"
                        src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                        alt="${day.weather[0].main}">
                    <p>☁ ${getWeatherMeaning(day.weather[0].icon)}</p>
                    <p>🌡 ${Math.round(day.main.temp)}°C</p>
                    <p>💧 ${day.main.humidity}% | 💨 ${day.wind.speed} m/s</p>
                `;
                forecastDiv.appendChild(card);
            });
        })
        .catch(() => {
            error.textContent = "City not found or network error";
        });
}

document.getElementById("cityInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        getWeather();
    }
});
