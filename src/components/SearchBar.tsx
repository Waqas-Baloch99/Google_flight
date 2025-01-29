import { useState, useEffect, useMemo, useCallback } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { CompareArrows, PersonOutline, Search } from "@mui/icons-material";
import axios from "axios";

import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Snackbar, Alert } from "@mui/material";
import FlightResultsAccordion from "./FlightsResults";
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

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
  const [flights, setFlights] = useState([]);

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
  // Memoize the fetchAirports function
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

  // Memoize airport options based on input values
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
            // put the api key in an env file
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

  // Custom animation class
  const customAnimation = "animate-float";

  return (
    <ThemeProvider theme={theme}>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-500`}>
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>

        {/* Custom Header */}
        <div className={`text-center pt-8 ${customAnimation}`}>
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Find Your Perfect Flight
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Search across multiple airlines with our advanced flight finder
          </p>
        </div>

        {/* Existing search form with modified styling */}
        <div className="container mx-auto mt-8 px-4">
          <div className={`
            ${darkMode ? 'bg-gray-800' : 'bg-white'} 
            rounded-2xl shadow-2xl p-8 
            transform transition-all duration-300 
            hover:scale-[1.02] hover:shadow-xl
            ${darkMode ? 'shadow-blue-500/20' : 'shadow-blue-200'}
          `}>
            {/* Trip Selection Row */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <FormControl variant="standard" sx={{ 
                m: 1, 
                minWidth: 150,
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#3b82f6'
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottomColor: '#2563eb'
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
                  m: 1, 
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
                  m: 1, 
                  minWidth: 150,
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl shadow-sm">
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

              <div className="grid grid-cols-2 gap-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl shadow-sm">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker", "DatePicker"]}>
                    <DatePicker
                      value={departure}
                      onChange={(newValue) => setDeparture(newValue)}
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
                      onChange={(newValue) => setReturnDate(newValue)}
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

        {/* Custom Footer */}
        <div className={`text-center mt-8 pb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>Powered by Advanced Flight Search Technology</p>
          <p className="text-sm mt-2">Real-time prices and availability</p>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex flex-col items-center gap-4 mt-6">
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-blue-200 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <Search className="w-5 h-5" />
          <span className="font-medium">{isLoading ? "Searching..." : "Explore"}</span>
        </button>
        
        {searchTime > 0 && !isLoading && (
          <div className="text-sm text-gray-600 animate-fade-in">
            Search completed in {searchTime.toFixed(2)} seconds
          </div>
        )}
      </div>

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
      {/* flights card */}
      <FlightResultsAccordion flights={flights} />
    </ThemeProvider>
  );
}

// Add this to your CSS/Tailwind config
const customStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in;
  }
`;
