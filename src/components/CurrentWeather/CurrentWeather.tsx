import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import styles from './CurrentWeather.module.scss';

interface CurrentWeatherProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherIcon: string;
  description: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ temperature, humidity, windSpeed, weatherIcon, description }) => {
  return (
    <Card className={styles.weatherCard}>
      <CardContent>
        <Box className={styles.weatherInfo}>
          <img src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`} alt={description} className={styles.icon} />
          <Typography variant="h4">{temperature}°C</Typography>
          <Typography variant="subtitle1">{description}</Typography>
          <Typography variant="body2">Humidity: {humidity}%</Typography>
          <Typography variant="body2">Wind: {windSpeed} m/s</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
