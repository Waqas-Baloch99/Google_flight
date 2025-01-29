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

interface Flight {
  price: { formatted: string };
  legs: Array<any>;
}

interface FlightResultsAccordionProps {
  flights: { data?: { itineraries: Array<any> } };
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
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!itineraries || itineraries.length === 0) {
    return (
      <div>
        <img className="m-auto" src={Noflights} alt="no-flights" />
        <h1 className="font-semibold text-2xl lg:text-4xl text-center mb-5">
          No flights available
        </h1>
      </div>
    );
  }

  return (
    <Stack className="lg:mx-24" spacing={2}>
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
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                <strong>Departure:</strong>{" "}
                {new Date(departure).toLocaleTimeString()} from {origin}{" "}
                {new Date(departure).toLocaleDateString()} - {price}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
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
