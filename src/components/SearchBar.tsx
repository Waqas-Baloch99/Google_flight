import { useState, useEffect, useMemo, useCallback } from "react";
import { CompareArrows, PersonOutline, Search } from "@mui/icons-material";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import noFlightImage from '../assets/no-flight.png';  // Add this import
import { 
  Snackbar, 
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Autocomplete
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FlightResultsAccordion from "./FlightsResults";

export default function SearchBar() {
  const [trip, setTrip] = useState("");
  const [passenger, setPassenger] = useState(1);
  const [type, setType] = useState("");

  const [departure, setDeparture] = useState<Dayjs | null>(dayjs(null));
  const [returnDate, setReturnDate] = useState<Dayjs | null>(dayjs(null));

  const [origin, setOrigin] = useState<string | null>("");
  const [originInputValue, setOriginInputValue] = useState("");
  const [destinationInputValue, setDestinationInputValue] = useState("");
  const [destination, setDestination] = useState<string | null>("");
  const [flights, setFlights] = useState<{ 
    data?: { 
      itineraries: any[] 
    } | undefined
  }>({ data: { itineraries: [] } });

  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  const [originSkyId, setOriginSkyId] = useState("");
  const [destinationSkyId, setDestinationSkyId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [searchTime, setSearchTime] = useState<number>(0);

  // Snackbar state for error handling
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleTrip = (event: SelectChangeEvent) => {
    setTrip(event.target.value);
  };

  const handleFlightType = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  // Shared function to fetch airports based on input value
  const fetchAirports = useCallback(async (query: string) => {
    try {
      const response = await axios.get(
        `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${query}&locale=en-US`,
        {
          headers: {
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching airport data:", error);
      setSnackbarMessage("Error fetching airport data.");
      setSnackbarOpen(true);
      return [];
    }
  }, []);

  const memoizedOriginOptions = useMemo(() => {
    if (originInputValue.length > 2) {
      return fetchAirports(originInputValue);
    }
    return [];
  }, [originInputValue, fetchAirports]);

  const memoizedDestinationOptions = useMemo(() => {
    if (destinationInputValue.length > 2) {
      return fetchAirports(destinationInputValue);
    }
    return [];
  }, [destinationInputValue, fetchAirports]);

  useEffect(() => {
    const fetchOptions = async () => {
      const fetchedOriginOptions = await memoizedOriginOptions;
      setOriginOptions(fetchedOriginOptions);

      const fetchedDestinationOptions = await memoizedDestinationOptions;
      setDestinationOptions(fetchedDestinationOptions);
    };
    fetchOptions();
  }, [memoizedOriginOptions, memoizedDestinationOptions]);

  const handleSearch = async () => {
    const startTime = performance.now();
    setIsLoading(true);

    const params = {
      originSkyId: originSkyId,
      originEntityId: originId,
      destinationEntityId: destinationId,
      destinationSkyId: destinationSkyId,
      date: departure ? departure.format("YYYY-MM-DD") : "",
      returnDate: returnDate ? returnDate.format("YYYY-MM-DD") : "",
      cabinClass: type.toLowerCase(),
      adults: passenger,
      sortBy: "best",
      currency: "USD",
      market: "en-US",
      countryCode: "US",
    };

    try {
      const response = await axios.get(
        "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
        {
          params,
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          },
        }
      );
      setFlights(response.data);
      const endTime = performance.now();
      setSearchTime((endTime - startTime) / 1000); // Convert to seconds
    } catch (error) {
      console.error("Error fetching flights:", error);
      setSnackbarMessage("Error fetching flights.");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
        },
      }),
    [darkMode],
  );

  const customAnimation = "animate-float";
  const maxDate = useMemo(() => dayjs().add(1, 'year'), []);
  const minDate = useMemo(() => dayjs(), []);

  const handleDepartureChange = (newValue: Dayjs | null) => {
    if (!newValue) {
      setDeparture(null);
      return;
    }

    if (newValue.isBefore(minDate, 'day')) {
      setSnackbarMessage("Departure date cannot be in the past");
      setSnackbarOpen(true);
      return;
    }

    if (newValue.isAfter(maxDate)) {
      setSnackbarMessage("Departure date cannot be more than 1 year from now");
      setSnackbarOpen(true);
      return;
    }

    setDeparture(newValue);

    if (returnDate && newValue.isAfter(returnDate)) {
      setReturnDate(newValue);
    }
  };

  const handleReturnChange = (newValue: Dayjs | null) => {
    if (!newValue) {
      setReturnDate(null);
      return;
    }

    if (!departure) {
      setSnackbarMessage("Please select a departure date first");
      setSnackbarOpen(true);
      return;
    }

    if (newValue.isBefore(departure)) {
      setSnackbarMessage("Return date must be after departure date");
      setSnackbarOpen(true);
      return;
    }

    if (newValue.isAfter(maxDate)) {
      setSnackbarMessage("Return date cannot be more than 1 year from now");
      setSnackbarOpen(true);
      return;
    }

    setReturnDate(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={`min-h-[80vh] ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-500`}>
        {/* Theme Toggle */}
        <div className="absolute top-2 right-2">
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit" size="small">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>

        {/* Custom Header */}
        <div className={`text-center pt-4 ${customAnimation}`}>
          <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Find Your Perfect Flight
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Search across multiple airlines
          </p>
        </div>

        {/* Search Container */}
        <div className="container mx-auto mt-4 px-2">
          <div className={`
            ${darkMode ? 'bg-gray-800' : 'bg-white'} 
            rounded-xl shadow-lg p-4
            transform transition-all duration-300 
            hover:shadow-xl
            ${darkMode ? 'shadow-blue-500/20' : 'shadow-blue-200'}
          `}>
            {/* Trip Selection Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <FormControl variant="standard" sx={{ 
                m: 0.5, 
                minWidth: 120,
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#3b82f6'
                }
              }}>
                <InputLabel id="demo-simple-select-standard-label">
                  <CompareArrows /> Round trip{" "}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={trip}
                  onChange={handleTrip}
                  label="Trip"
                >
                  <MenuItem value="Round trip">
                    <em>Round trip</em>
                  </MenuItem>
                  <MenuItem value={"One way"}>One way</MenuItem>
                  <MenuItem value={"Multi-city"}>Multi-way</MenuItem>
                </Select>
              </FormControl>

              <div className="md:pl-6">
                <FormControl variant="standard" sx={{ 
                  m: 0.5, 
                  minWidth: 24,
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#3b82f6'
                  }
                }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <PersonOutline />{" "}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={passenger}
                    onChange={(e) => setPassenger(Number(e.target.value))}
                    label="Passenger"
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="md:pl-6">
                <FormControl variant="standard" sx={{ 
                  m: 0.5, 
                  minWidth: 120,
                  '& .MuiInput-underline:before': {
                    borderBottomColor: '#3b82f6'
                  }
                }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Economy
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={type}
                    onChange={handleFlightType}
                    label="Age"
                  >
                    <MenuItem value="economy">
                      <em>Economy</em>
                    </MenuItem>
                    <MenuItem value={"premium_economy"}>Premium Economy</MenuItem>
                    <MenuItem value={"business"}>Business</MenuItem>
                    <MenuItem value={"first"}>First</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-3 bg-gradient-to-r from-blue-50 to-white p-3 rounded-lg">
                <div className="flex items-center p-2">
                  <Autocomplete
                    id="manageable-states-demo"
                    value={origin}
                    inputValue={originInputValue}
                    onInputChange={(_event, newInputValue) => {
                      setOriginInputValue(newInputValue);
                    }}
                    sx={{ 
                      width: '100%',
                      '& .MuiInputBase-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        '&:hover': {
                          backgroundColor: '#f8fafc'
                        }
                      }
                    }}
                    options={originOptions}
                    getOptionLabel={(option: any) =>
                      option?.presentation?.suggestionTitle || ""
                    }
                    onChange={(_event, value: any | null) => {
                      setOrigin(value);
                      setOriginId(value?.entityId || "");
                      setOriginSkyId(value?.skyId);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Where from?" />
                    )}
                  />
                </div>
                <div className="flex items-center p-2">
                  <Autocomplete
                    id="manageable-states-demo"
                    value={destination}
                    inputValue={destinationInputValue}
                    onInputChange={(_event, newInputValue) => {
                      setDestinationInputValue(newInputValue);
                    }}
                    sx={{ 
                      width: '100%',
                      '& .MuiInputBase-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        '&:hover': {
                          backgroundColor: '#f8fafc'
                        }
                      }
                    }}
                    options={destinationOptions}
                    getOptionLabel={(option: any) =>
                      option?.presentation?.suggestionTitle || ""
                    }
                    onChange={(_event, value: any | null) => {
                      setDestination(value);
                      setDestinationId(value?.entityId || "");
                      setDestinationSkyId(value?.skyId);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Where to?" />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gradient-to-r from-blue-50 to-white p-3 rounded-lg">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker", "DatePicker"]}>
                    <DatePicker
                      value={departure}
                      onChange={handleDepartureChange}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: '12px',
                          backgroundColor: 'white',
                          '&:hover': {
                            backgroundColor: '#f8fafc'
                          }
                        }
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker", "DatePicker"]}>
                    <DatePicker
                      value={returnDate}
                      onChange={handleReturnChange}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: '12px',
                          backgroundColor: 'white',
                          '&:hover': {
                            backgroundColor: '#f8fafc'
                          }
                        }
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:shadow-blue-200 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">{isLoading ? "Searching..." : "Explore"}</span>
          </button>
          
          {searchTime > 0 && !isLoading && (
            <div className="text-xs text-gray-600 animate-fade-in">
              Search completed in {searchTime.toFixed(2)} seconds
            </div>
          )}
        </div>

        {/* Flight Results */}
        {!isLoading && flights.data?.itineraries?.length > 0 && (
          <FlightResultsAccordion flights={flights} />
        )}

        {/* No Flights Found Image */}
        {!isLoading && flights.data?.itineraries?.length === 0 && (
          <div className="flex flex-col items-center mt-8">
            <img 
              src={noFlightImage}
              alt="No flights found" 
              className="max-w-xs opacity-75"
            />
            <p className={`text-center mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No flights found for your search criteria
            </p>
          </div>
        )}

        {/* Snackbar for error handling */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}
