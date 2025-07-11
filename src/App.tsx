import { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherResponse {
  weather: { icon: string; description: string }[];
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
  name: string;
}

const App = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchIcon = 'https://img.icons8.com/ios-filled/24/ffffff/search--v1.png';
  const mistIconDetail = 'https://img.icons8.com/ios-filled/50/ffffff/humidity.png';
  const windIconDetail = 'https://img.icons8.com/ios-filled/50/ffffff/wind.png';
  const clearIconDetail = 'https://img.icons8.com/ios-filled/50/ffffff/temperature.png';
  const cloudsIconDetail = 'https://img.icons8.com/ios-filled/50/ffffff/atmospheric-pressure.png';

  const appStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      overflow-x: hidden;
    }

    .app {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      width: 100vw;
    }

    .weather-container {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      width: 100%;
      max-width: 420px;
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .search-section {
      margin-bottom: 32px;
    }

    .search-form {
      width: 100%;
    }

    .search-input-container {
      position: relative;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .search-input-container:focus-within {
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .search-input {
      flex: 1;
      padding: 16px 20px;
      background: transparent;
      border: none;
      outline: none;
      color: white;
      font-size: 16px;
      font-weight: 500;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .search-button {
      background: transparent;
      border: none;
      padding: 12px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .search-icon {
      width: 24px;
      height: 24px;
    }

    .loading {
      text-align: center;
      padding: 40px 20px;
      color: white;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error {
      background: rgba(255, 107, 107, 0.2);
      border: 1px solid rgba(255, 107, 107, 0.3);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      color: #ff6b6b;
      font-weight: 500;
      margin-bottom: 20px;
    }

    .weather-info {
      color: white;
    }

    .main-weather {
      text-align: center;
      margin-bottom: 32px;
    }

    .weather-icon-container {
      margin-bottom: 20px;
    }

    .weather-icon {
      width: 120px;
      height: 120px;
      object-fit: contain;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
    }

    .temperature {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 12px;
      background: linear-gradient(45deg, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .description {
      font-size: 1.1rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8px;
    }

    .location {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, 0.95);
    }

    .date {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .weather-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .detail-item {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .detail-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .detail-icon img {
      width: 24px;
      height: 24px;
    }

    .detail-info {
      display: flex;
      flex-direction: column;
    }

    .detail-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: white;
    }

    .detail-label {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.8);
    }

    @media (max-width: 480px) {
      .weather-details {
        grid-template-columns: 1fr;
      }
    }
  `;

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = appStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const getWeatherIcon = (weather: { icon: string }[]) => {
    const iconCode = weather[0].icon;
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }: GeolocationPosition) =>
          fetchWeatherByCoords(coords.latitude, coords.longitude),
        () => {
          setError('Location access denied. Showing New York.');
          fetchWeatherByCity('New York');
        }
      );
    } else {
      setError('Geolocation not supported. Showing New York.');
      fetchWeatherByCity('New York');
    }
  }, []);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c';
      const res = await axios.get<WeatherResponse>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(res.data);
      setError('');
    } catch {
      setError('Failed to load weather.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (cityName: string) => {
    setLoading(true);
    try {
      const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c';
      const res = await axios.get<WeatherResponse>(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(res.data);
      setError('');
    } catch {
      setError('City not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherByCity(city.trim());
      setCity('');
    }
  };

  return (
    <div className="app">
      <div className="weather-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <img src={searchIcon} alt="Search" className="search-icon" />
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {weatherData && !loading && (
          <div className="weather-info">
            <div className="main-weather">
              <div className="weather-icon-container">
                <img
                  src={getWeatherIcon(weatherData.weather)}
                  alt={weatherData.weather[0].description}
                  className="weather-icon"
                />
              </div>
              <div className="temperature">
                {Math.round(weatherData.main.temp)}°C
              </div>
              <div className="description">
                {weatherData.weather[0].description.toUpperCase()}
              </div>
              <div className="location">
                {weatherData.name}, {weatherData.sys.country}
              </div>
              <div className="date">{formatDate()}</div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <div className="detail-icon">
                  <img src={mistIconDetail} alt="Humidity" />
                </div>
                <div className="detail-info">
                  <span className="detail-value">
                    {weatherData.main.humidity}%
                  </span>
                  <span className="detail-label">Humidity</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <img src={windIconDetail} alt="Wind" />
                </div>
                <div className="detail-info">
                  <span className="detail-value">
                    {Math.round(weatherData.wind.speed * 3.6)} km/h
                  </span>
                  <span className="detail-label">Wind Speed</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <img src={clearIconDetail} alt="Feels Like" />
                </div>
                <div className="detail-info">
                  <span className="detail-value">
                    {Math.round(weatherData.main.feels_like)}°C
                  </span>
                  <span className="detail-label">Feels Like</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <img src={cloudsIconDetail} alt="Pressure" />
                </div>
                <div className="detail-info">
                  <span className="detail-value">
                    {weatherData.main.pressure} hPa
                  </span>
                  <span className="detail-label">Pressure</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
