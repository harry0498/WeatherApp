const express = require("express");
const router = express.Router();
const API_URI = "https://wttr.in";

/**
 * Fetch the weather for a location
 *
 * @param {string} loc - The location to query.
 * @returns {Promise<any>} The JSON response
 */
const fetch_weather = async (loc) => {
  // Set up the query params to get the JSON response
  const params = new URLSearchParams({
    format: "j1",
  });

  return fetch(`${API_URI}/${loc}?${params}`).then(async (res) => {
    // Check if the response is ok
    if (!res.ok) {
      throw { message: res.statusText, status: res.status };
    }

    return res
      .json()
      .then((data) => {
        // Return the JSON response
        return {
          tempC: {
            cur: data.current_condition[0].temp_C,
            max: data.weather[0].maxtempC,
            min: data.weather[0].mintempC,
          },
          tempF: {
            cur: data.current_condition[0].temp_F,
            max: data.weather[0].maxtempF,
            min: data.weather[0].mintempF,
          },
          humidity: data.current_condition[0].humidity,
          precipMM: data.current_condition[0].precipMM,
          description: data.current_condition[0].weatherDesc
            .map((desc) => desc.value)
            .join(", "),
          areaName: `${data.nearest_area[0].areaName[0].value}, ${data.nearest_area[0].region[0].value}`,
        };
      })
      .catch(() => {
        throw { message: "unable to decode JSON", status: 500 };
      });
  });
};

// Get local weather
router.get("/weather", async (req, res) => {
  try {
    const data = await fetch_weather("");

    res.status(200).json(data);
  } catch (err) {
    console.error(`Error fetching weather: ${JSON.stringify(err)}`);
    res.status(err.status).json({ message: `Error fetching weather: ${err.message}` });
  }
});

// Get weather for a location
router.get("/weather/:loc", async (req, res) => {
  try {
    const data = await fetch_weather(req.params.loc.replace(" ", "+"));

    res.status(200).json(data);
  } catch (err) {
    console.error(`Error fetching weather: ${JSON.stringify(err)}`);
    res.status(err.status).json({ message: `Error fetching weather: ${err.message}` });
  }
});

module.exports = router;
