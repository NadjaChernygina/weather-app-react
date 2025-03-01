import React, { useState } from 'react';
import { Container, Typography, CircularProgress, Alert, Button, Paper, createTheme, ThemeProvider } from '@mui/material';
import SearchBar from './components/SearchBar/SearchBar';
import CurrentWeather from './components/CurrentWeather/CurrentWeather';
import Forecast from './components/Forecast/Forecast';
import { getCoordinates, getWeatherByCoordinates, getForecastByCoordinates, WeatherData, ForecastData } from './services/weatherService';
import './assets/styles/global.scss';


//  Custom Material UI theme
const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Пошук погоди по назві міста / острова / селища
  const fetchWeather = async (location: string) => {
    setLoading(true);
    setError('');
    try {
      console.log(`Searching location: ${location}`);

      const coords = await getCoordinates(location);
      if (!coords) {
        throw new Error(`Location "${location}" not found`);
      }

      console.log(`Coordinates found: ${coords.lat}, ${coords.lon}`);

      const data = await getWeatherByCoordinates(coords.lat, coords.lon);
      console.log('Weather Data:', data);

      const forecastData = await getForecastByCoordinates(coords.lat, coords.lon);
      console.log('Forecast Data:', forecastData);

      setWeather(data);
      setForecast(forecastData);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Функція для отримання погоди за геолокацією
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError('');
    try {
      console.log(`Fetching weather for coords: ${lat}, ${lon}`);

      const data = await getWeatherByCoordinates(lat, lon);
      console.log('Location-based Weather Data:', data);

      const forecastData = await getForecastByCoordinates(lat, lon);
      console.log('Forecast Data:', forecastData);

      setWeather(data);
      setForecast(forecastData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch location-based weather.');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Функція для отримання місцезнаходження
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('User Location:', position.coords.latitude, position.coords.longitude);
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to retrieve location. Please allow location access.');
        setLoading(false);
      }
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="app-container">
        <Paper className="app-paper" elevation={3}>
          <Typography variant="h4" className="app-title">
            Weather App
          </Typography>
          <SearchBar onSearch={fetchWeather} />
          <Button variant="contained" className="location-button" onClick={handleUseGeolocation}>
            Use My Location
          </Button>
          {loading && <CircularProgress className="loading-spinner" />}
          {error && <Alert className="error-message" severity="error">
            {error}
          </Alert>}
          {weather && <CurrentWeather {...weather} />}
          {forecast.length > 0 && <Forecast forecast={forecast} />}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
