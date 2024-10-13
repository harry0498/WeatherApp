import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader } from "@/components/ui/card";

import "./NewLocation.css";
import { useState } from "react";

/**
 * Component to add a new location for weather checking
 *
 * @component
 * @param {Function} handleNewWeather - A function to update the weather
 * @returns {JSX.Element}
 */
const NewLocation = ({ handleNewWeather }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [error, setError] = useState(false);

  /**
   * Handles dialog open/close state changes
   *
   * @param {boolean} open - The open state of the dialog
   */
  const handleOpenChange = (open) => {
    setIsOpen(open);
    setLocation("");
    setError(false);
  };

  /**
   * Handles the adding a new location
   */
  const handleSubmit = async () => {
    await handleNewWeather(location)
      .then(() => handleOpenChange(false))
      .catch((err) => {
        console.error(err);
        setError(true);
        return;
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Card className="m-4 hover:bg-secondary cursor-pointer flex items-center place-content-center sm:min-h-[278px]">
          <CardHeader className="p-0 text-6xl content-center">+</CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] top-[200px]">
        <DialogHeader>
          <DialogTitle>Add Location</DialogTitle>
          <DialogDescription>Add a new location to check the weather.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid gap-2">
            <Label htmlFor="city" className="text-left">
              City
            </Label>
            <Input
              id="city"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setError(false);
              }}
              className={`${error && "border border-red-500"}`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewLocation;
