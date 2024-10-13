import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { TrashIcon } from "@radix-ui/react-icons";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import "./WeatherCard.css";

/**
 * WeatherCard component to display weather information
 *
 * @component
 * @param {Object} data - The weather data
 * @param {Object} opts - Options
 * @param {boolean} [opts.celsius = true] - Whether to display the temperature in Celsius
 * @param {Function} handleDelete - A callback function to handle the deletion of the weather card
 *
 * @returns {JSX.Element}
 */
const WeatherCard = ({ data, opts = { celsius: true }, handleDelete }) => {
  // Get the temperature data based on the celsius option
  const temp = opts.celsius ? data.tempC : data.tempF;

  /**
   * Formats the temperature
   *
   * @param {number} temp - The temperature value (default is 0)
   * @param {boolean} celsius - Whether to display in Celsius (true) or Fahrenheit (false)
   * @returns {string} The formatted temperature string
   */
  const displayTemp = (temp = 0, celsius) => {
    return celsius ? `${temp}°C` : `${temp}°F`;
  };

  /**
   * Formats the timestamp
   *
   * @param {string} time - The timestamp to format
   * @returns {string} The formatted time string
   */
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <Card className="m-4 flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{data?.areaName}</CardTitle>
        <CardDescription>{data?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed table-small">
          <TableBody>
            <TableRow>
              <TableCell className="text-left">Now:</TableCell>
              <TableCell className="text-right">
                {displayTemp(temp?.cur, opts.celsius)}
              </TableCell>
              <TableCell className="text-left">Hum:</TableCell>
              <TableCell className="text-right">{data?.humidity}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-left">Max:</TableCell>
              <TableCell className="text-right">
                {displayTemp(temp?.max, opts.celsius)}
              </TableCell>
              <TableCell className="text-left">Rain:</TableCell>
              <TableCell className="text-right">{data?.precipMM}mm</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-left">Min:</TableCell>
              <TableCell className="text-right">
                {displayTemp(temp?.min, opts.celsius)}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-between">
        <div>
          <TrashIcon
            className="size-5 stroke-red-500 cursor-pointer"
            onClick={() => handleDelete(data?.areaName)}
          />
        </div>
        <div className="text-xs">Last updated: {formatTime(data?.lastUpdate)}</div>
      </CardFooter>
    </Card>
  );
};

export default WeatherCard;
