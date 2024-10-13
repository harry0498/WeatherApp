import { WeatherCard, NewLocation, Spinner } from "./components";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ApiService from "@/apiService";

/**
 * Main App component for the Weather application
 *
 * @component
 */
const App = () => {
  const [weather, setWeather] = useState([]);
  const [celsius, setCelsius] = useState(() => {
    // Get the stored celsius setting from localStorage
    const storedcelsius = localStorage.getItem("celsius");

    // Set the default value to true if not found
    if (storedcelsius === null) {
      localStorage.setItem("celsius", true);
      return true;
    }

    // Return the stored value
    return storedcelsius === "true";
  });
  const [isLoading, setIsLoading] = useState(true);
  const apiService = ApiService;

  /**
   * Loads weather data from the API and updates the weather state
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const loadWeather = async () => {
    // List the weather data
    const loadedWeather = await apiService.listWeather().catch((err) => {
      console.error(err);
      return;
    });

    // Update the weather data if older than 10 minutes
    const updatedWeather = await apiService.updateWeather(loadedWeather);

    setWeather(updatedWeather);
    setIsLoading(false);
  };

  /**
   * Toggles between Celsius and Fahrenheit
   *
   * @function
   */
  const toggleCelsius = () => {
    setCelsius(!celsius);
    localStorage.setItem("celsius", !celsius);
  };

  /**
   * Adds new weather data for a specified city and updates the weather state
   *
   * @async
   * @function
   * @param {string} city - The city to add to the weather data
   * @throws {Error}
   */
  const handleNewWeather = async (city) => {
    // Fetch the weather data for the city
    const data = await apiService.findWeather(city).catch((err) => {
      throw err;
    });

    let newWeather = [];

    // Check if the city is not already in the weather data
    if (!weather.some((item) => item.areaName === data.areaName)) {
      newWeather = weather.concat(data);
    } else {
      // Update the existing city data
      newWeather = weather.map((item) => (item.areaName === data.areaName ? data : item));
    }

    // Update the weather data in localStorage and return the new data
    localStorage.setItem("weather", JSON.stringify(newWeather));
    setWeather(newWeather);
  };

  /**
   * Deletes weather data for a specified city and updates the weather state
   *
   * @async
   * @function
   * @param {string} city - The city to delete from the weather data
   */
  const handleDelete = async (city) => {
    await apiService.deleteWeather(city).then((data) => {
      setWeather(data);
    });
  };

  useEffect(() => {
    // Load the weather
    loadWeather();
  }, []);

  return (
    <>
      <div className="p-3 bg-muted flex justify-between">
        <h1 className="font-bold">Weather App</h1>
        <div className="flex items-center space-x-2">
          <Label htmlFor="celsiusToggle">{celsius ? "Celsius" : "Fahrenheit"}</Label>
          <Switch id="celsiusToggle" checked={celsius} onClick={toggleCelsius} />
        </div>
      </div>
      <div className="container max-w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <NewLocation key="new" handleNewWeather={handleNewWeather} />
        {!isLoading &&
          weather.map((data, index) => (
            <WeatherCard
              key={index}
              data={data}
              opts={{ celsius: celsius }}
              handleDelete={handleDelete}
            />
          ))}
        {isLoading && <Spinner />}
      </div>
    </>
  );
};

export default App;
