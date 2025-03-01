import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import styles from './Forecast.module.scss';

interface ForecastItem {
  date: string;
  temperature: number;
  weatherIcon: string;
}

interface ForecastProps {
  forecast: ForecastItem[];
}

const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  return (
    <Grid container spacing={2} className={styles.forecastContainer}>
      {forecast.map((item, index) => (
        <Grid item xs={12} sm={6} md={2} key={index}>
          <Card className={styles.forecastCard}>
            <CardContent>
              <Typography variant="body2">{item.date}</Typography>
              <img src={`https://openweathermap.org/img/wn/${item.weatherIcon}@2x.png`} alt="" className={styles.icon} />
              <Typography variant="h6">{item.temperature}°C</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Forecast;
