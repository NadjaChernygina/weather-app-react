const API_KEY = '730960b765e6e9190346980411232cab'; // Встав свій реальний API-ключ
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherIcon: string;
  description: string;
}

export interface ForecastData {
  date: string;
  temperature: number;
  weatherIcon: string;
}

/**
 * Отримує координати місця (місто, острів, село тощо)
 */
export async function getCoordinates(location: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const response = await fetch(`${GEO_URL}?q=${location}&limit=1&appid=${API_KEY}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null; // Якщо місце не знайдено
    }

    return { lat: data[0].lat, lon: data[0].lon };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
}

/**
 * Отримання поточної погоди за координатами
 */
export async function getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    const data = await response.json();
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      weatherIcon: data.weather[0].icon,
      description: data.weather[0].description,
    };
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
}

/**
 * Отримання прогнозу погоди за координатами
 */
export async function getForecastByCoordinates(lat: number, lon: number): Promise<ForecastData[]> {
  try {
    const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    const data = await response.json();

    if (!data.list || !Array.isArray(data.list)) {
      throw new Error('Invalid forecast data received');
    }

    // Відбираємо по одному запису на день
    const dailyForecast: ForecastData[] = [];
    const dates = new Set();

      data.list.forEach((item: any) => {
        const date = new Date(item.dt_txt).toLocaleDateString();
        if (!dates.has(date)) {
          dates.add(date);
          dailyForecast.push({
            date: date,
            temperature: Math.round(item.main.temp),
            weatherIcon: item.weather[0].icon,
          });
        }
      });

    return dailyForecast;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}
