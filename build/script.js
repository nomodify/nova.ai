const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  const message = document.getElementById("message-input").value;

  // Get the IP address using a fetch request
  fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => {
      // Show typing indicator
      const typingIndicator = document.getElementById("typing");
      typingIndicator.style.display = "block";

      const dataToSend = {
        text: message,
        key: "12f3b54a-3dde-4626-ac07-b29a527a0a44",
        playerId: data.ip,
        speak: true,
      };

      fetch("https://api.carterlabs.ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          const outputDiv = document.getElementById("output");
          const responseDiv = document.createElement("div");
          responseDiv.classList.add("response");
          responseDiv.innerHTML = `<p>You: ${data.input}</p><p>Nova: ${data.output.text}</p>`;

          // Remove the oldest response if the container has reached its max size
          if (outputDiv.children.length >= 10) {
            outputDiv.removeChild(outputDiv.firstChild);
          }

          // Append the new response at the bottom of the container
          outputDiv.appendChild(responseDiv);

          data.forced_behaviours.forEach((fb) => {
            console.log("Forced Behaviour:", fb.name);
          });

          document.getElementById("message-input").value = "";

          // Hide typing indicator
          typingIndicator.style.display = "none";
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => console.error(error));
});


// Time:
const timeElement = document.querySelector(".time");
const dateElement = document.querySelector(".date");

/**
 * @param {Date} date
 */
function formatTime(date) {
  const hours12 = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const isAm = date.getHours() < 12;

  return `${hours12.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${isAm ? "AM" : "PM"}`;
}

/**
 * @param {Date} date
 */
function formatDate(date) {
  const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${DAYS[date.getDay()]}, ${
    MONTHS[date.getMonth()]
  } ${date.getDate()} ${date.getFullYear()}`;
}

setInterval(() => {
  const now = new Date();

  timeElement.textContent = formatTime(now);
  dateElement.textContent = formatDate(now);
}, 200);

// Get weather:

function getWeather() {
  let temperature = document.getElementById("temperature");
  let description = document.getElementById("description");
  let location = document.getElementById("location");

  let api = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "1ce5f4180d4b54d3df67feadb325265a";

  location.innerHTML = "Locating...";

  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    let url =
      api +
      "?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=" +
      apiKey +
      "&units=metric";

    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let temp = data.main.temp;
        temperature.innerHTML = temp + "° C";
        location.innerHTML = data.name + " ";
        description.innerHTML = data.weather[0].main;
      });
  }

  function error() {
    location.innerHTML = "Unable to retrieve your location";
  }
}

getWeather();