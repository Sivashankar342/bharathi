document.getElementById("getWeather").addEventListener("click", function () {
  getWeather();
});

document.getElementById("startVoice").addEventListener("click", function () {
  startVoiceRecognition();
});

function getWeather(city) {
  if (!city) {
    city = document.getElementById("city").value;
  }

  const apiKey = "a877487b99a067943e262f7fac8cdf2c"; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let weatherHtml;
      if (data.cod === 200) {
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        let additionalInfo = "";

        // Check if the city is Chennai
        if (city.toLowerCase() === "chennai") {
          additionalInfo = `
                        <h3>Guidelines During Floods in Chennai</h3>
                        <ul>
                            <li><strong>Evacuation Orders:</strong> Residents in low-lying or flood-prone areas are often advised to evacuate to safer places such as relief camps. The government usually provides transportation and other logistics for evacuation.</li>
                            <li><strong>Emergency Contacts:</strong> Keep emergency contact numbers handy, including those of local authorities, disaster management teams, and rescue services. Call the toll-free number 1070 (State Emergency Operations Center) or 1077 (District Emergency Operations Center) for assistance.</li>
                            <li><strong>Relief Camps:</strong> The government sets up relief camps in safe zones where people can seek shelter. These camps provide food, water, medical aid, and other necessities. Information about the location of relief camps is shared through various channels, including media and local authorities.</li>
                            <li><strong>Safety Precautions:</strong> Avoid wading through floodwaters, as they may be contaminated or hide open manholes and sharp objects. Do not touch electrical appliances or switches if you are wet or standing in water. Boil water before drinking or use bottled water to avoid waterborne diseases.</li>
                            <li><strong>Health Precautions:</strong> Watch for signs of waterborne diseases such as diarrhea, cholera, or dengue, and seek medical attention immediately if symptoms appear. The government often organizes health camps in affected areas.</li>
                            <li><strong>Communication:</strong> Keep mobile phones charged, and use them sparingly to save battery life during power outages. Stay tuned to official announcements via radio, TV, and social media for updates and instructions.</li>
                            <li><strong>Transportation:</strong> Avoid unnecessary travel. The government often issues advisories on road conditions and whether certain routes are safe. Use public transport when available, as it is often coordinated with relief efforts.</li>
                            <li><strong>After the Flood:</strong> Do not return to your home until authorities have declared it safe. Dispose of any food items that may have come into contact with floodwater.</li>
                        </ul>
                    `;
        }

        // Add information about unaffected areas if city is Chennai
        if (city.toLowerCase() === "chennai") {
          additionalInfo += `
                        <h3>Unaffected Areas During Heavy Rain in Chennai</h3>
                        <p>The following areas are generally less affected during heavy rain in Chennai:</p>
                        <ul>
                            <li>Ekkattuthangal</li>
                            <li>Guindy</li>
                            <li>Arumbakkam</li>
                            <li>Anna Main Road in KK Nagar</li>
                            <li>Ramapuram</li>
                            <li>Manapakkam</li>
                            <li>Madipakkam</li>
                            <li>Puzhuthivakkam</li>
                        </ul>
                    `;
        }

        weatherHtml = `
                    <h2>Weather in ${city}</h2>
                    <p>Description: ${weatherDescription}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Humidity: ${humidity}%</p>
                    ${additionalInfo}
                `;
        speak(
          `The weather in ${city} is ${weatherDescription} with a temperature of ${temperature} degrees Celsius and humidity of ${humidity} percent.${additionalInfo}`
        );
      } else {
        weatherHtml = `<p>City not found. Please try again.</p>`;
        speak("City not found. Please try again.");
      }
      document.getElementById("weatherResult").innerHTML = weatherHtml;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById(
        "weatherResult"
      ).innerHTML = `<p>There was an error fetching the weather data.</p>`;
      speak("There was an error fetching the weather data.");
    });
}

function startVoiceRecognition() {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const city = event.results[0][0].transcript;
    document.getElementById("city").value = city;
    getWeather(city);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    speak("Sorry, I didn't catch that. Please try again.");
  };
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}
