import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import Noflights from "../assets/no-flight.png";

// Define the interface for the component props
interface FlightResultsAccordionProps {
  flights: {
    data?: {
      itineraries: any[];  // Define more specific type if possible
    };
  };
}

export default function FlightResultsAccordion({ flights }: FlightResultsAccordionProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const itineraries = flights?.data?.itineraries || [];

  // Simulating loading state
  useEffect(() => {
    if (!flights) {
      setLoading(true);
    }
    setLoading(false);
  }, [flights]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] bg-gray-50">
        <CircularProgress size={40} thickness={4} className="text-blue-600" />
      </div>
    );
  }

  if (!itineraries || itineraries.length === 0) {
    return null; // Remove the no flights div and image, just return null
  }

  return (
    <Stack className="lg:mx-24 my-4 space-y-2" spacing={2}>
      {itineraries.map((itinerary: any, index: number) => {
        const price = itinerary?.price?.formatted || "N/A";
        const legs = itinerary?.legs || [];
        const firstLeg = legs[0];
        const departure = firstLeg?.departure || "N/A";
        const arrival = firstLeg?.arrival || "N/A";
        const origin = firstLeg?.origin?.name || "Unknown";
        const destination = firstLeg?.destination?.name || "Unknown";
        const durationInMinutes = firstLeg?.durationInMinutes || "N/A";
        const carrier =
          firstLeg?.carriers?.marketing[0]?.name || "Unknown Airline";
        const logoUrl = firstLeg?.carriers?.marketing[0]?.logoUrl || "";

        return (
          <Accordion 
            key={index}
            className="border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon className="text-blue-600" />}
              className="bg-gradient-to-r from-blue-50 to-white"
            >
              <Typography className="flex items-center space-x-4">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={carrier}
                    className="w-8 h-8 object-contain"
                  />
                )}
                <span>
                  <strong className="text-blue-700">Departure:</strong>{" "}
                  {new Date(departure).toLocaleTimeString()} from {origin}{" "}
                  {new Date(departure).toLocaleDateString()} - 
                  <span className="ml-2 text-green-600 font-bold">{price}</span>
                </span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="bg-white p-6">
              <Typography>
                <strong>Departure:</strong>{" "}
                {new Date(departure).toLocaleTimeString()} from {origin}
                <br />
                <strong>Arrival:</strong>{" "}
                {new Date(arrival).toLocaleTimeString()} at {destination}
                <br />
                <strong>Duration:</strong> {Math.floor(durationInMinutes / 60)}h{" "}
                {durationInMinutes % 60}m
                <br />
                <strong>Airline:</strong> {carrier}{" "}
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={carrier}
                    style={{
                      width: "20px",
                      height: "20px",
                      marginLeft: "5px",
                    }}
                  />
                )}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
