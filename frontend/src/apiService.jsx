/**
 * Fetches weather data for a specific city
 *
 * @async
 * @function
 * @param {string} [city = ""] - The name of the city to fetch weather data
 * @returns {Promise<Object>}
 * @throws {Error}
 */
const findWeather = async (city = "") => {
  const now = new Date();

  // Fetch the weather data from the API
  const weather = await fetch(`/api/weather/${city.replaceAll(" ", "+")}`)
    .then(async (res) => {
      // Check if the response is ok
      if (!res.ok) {
        // Try decode the JSON response
        const err = await res.json();

        // Throw an error with the JSON message
        if (err) {
          throw new Error("Failed to fetch weather: " + err.message);
        }

        // Throw a generic error message for non JSON responses
        throw new Error("Failed to fetch weather: something went wrong");
      }

      // Return the JSON response
      return res.json();
    })
    .then((data) => {
      // Set the last update time
      data.lastUpdate = now.toString();

      return data;
    })
    .catch((err) => {
      throw err;
    });

  return weather;
};

/**
 * Lists weather data from localStorage, fetching from the API if no data
 *
 * @async
 * @function
 * @returns {Promise<Array>}
 * @throws {Error}
 */
const listWeather = async () => {
  // Get the weather data from localStorage
  let weather = JSON.parse(localStorage.getItem("weather") || "[]");

  // If there is no weather data, fetch it
  if (weather.length === 0) {
    const data = await findWeather().catch((err) => {
      throw err;
    });

    weather = [data];
  }

  // Update the weather data in localStorage and return the new data
  localStorage.setItem("weather", JSON.stringify(weather));
  return weather;
};

/**
 * Updates weather data if older than 10 minutes
 *
 * @async
 * @function
 * @param {Array} weather - The array of weather data to update
 * @returns {Promise<Array>} The updated array of weather data
 */
const updateWeather = async (weather) => {
  // Check if there is weather data
  if (weather.length === 0) {
    return [];
  }

  const now = new Date();

  // Update weather older than 10 minutes
  const newWeather = await Promise.all(
    weather.map(async (data) => {
      const lastUpdate = new Date(data.lastUpdate);

      // Return the data if it was updated less than 10 minutes ago
      if (now - lastUpdate < 600000) {
        return data;
      }

      // Fetch the weather data for the city
      const d = await findWeather(data.areaName.split(",")[0]).catch((err) => {
        console.error(err);
        return data;
      });

      return d;
    }),
  );

  // Update the weather data in localStorage and return the new data
  localStorage.setItem("weather", JSON.stringify(newWeather));
  return newWeather;
};

/**
 * Deletes weather data for a specific city from localStorage
 *
 * @async
 * @function
 * @param {string} city - The name of the city to remove from the weather data
 * @returns {Promise<Array>} The updated array of weather data after deletion, or the original array if no city was provided
 */
const deleteWeather = async (city) => {
  // Get the weather data from localStorage
  const weather = JSON.parse(localStorage.getItem("weather") || "[]");

  // Check if a city was provided
  if (!city) {
    return weather;
  }

  // Remove the city from the weather data
  const newWeather = weather.filter((item) => item.areaName !== city);

  // Update the weather data in localStorage
  localStorage.setItem("weather", JSON.stringify(newWeather));

  return newWeather;
};

/**
 * A service to handle weather data
 */
const ApiService = {
  findWeather,
  listWeather,
  updateWeather,
  deleteWeather,
};

export default ApiService;
