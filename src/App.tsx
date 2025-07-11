import React, { useState, useEffect } from 'react';
import axios from 'axios';
// The import for "./styles.css" has been removed to resolve compilation errors.
// The CSS content is now embedded directly in this component.

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Embedded CSS content from styles.css
  const appStyles = `
    /* Reset and base styles */
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

    /* Main app container */
    .app {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      width: 100vw;
    }

    /* Weather container */
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

    /* Search section */
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
      transition: all 0.3s ease;
    }

    .search-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .search-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }

    /* Loading state */
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

    /* Error state */
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

    /* Weather info */
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
      background-clip: text;
    }

    .description {
      font-size: 1.1rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8px;
      letter-spacing: 1px;
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
      font-weight: 400;
    }

    /* Weather details */
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
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .detail-item:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .detail-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .detail-icon img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .detail-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .detail-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: white;
      margin-bottom: 2px;
    }

    .detail-label {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
    }

    /* Responsive design */
    @media (max-width: 480px) {
      .app {
        padding: 16px;
      }
      
      .weather-container {
        padding: 24px 20px;
        border-radius: 20px;
      }
      
      .search-input {
        padding: 14px 16px;
        font-size: 15px;
      }
      
      .weather-icon {
        width: 100px;
        height: 100px;
      }
      
      .temperature {
        font-size: 3rem;
      }
      
      .location {
        font-size: 1.2rem;
      }
      
      .weather-details {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .detail-item {
        padding: 16px 14px;
      }
      
      .detail-value {
        font-size: 1rem;
      }
      
      .detail-label {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 360px) {
      .weather-container {
        padding: 20px 16px;
      }
      
      .temperature {
        font-size: 2.5rem;
      }
      
      .weather-icon {
        width: 80px;
        height: 80px;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      body {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .weather-container {
        border: 2px solid white;
        background: rgba(0, 0, 0, 0.8);
      }
      
      .search-input-container {
        border: 2px solid white;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Print styles */
    @media print {
      .app {
        background: white;
        color: black;
      }
      
      .weather-container {
        background: white;
        box-shadow: none;
        border: 1px solid black;
      }
      
      .search-section {
        display: none;
      }
    }
  `;

  // Use useEffect to inject the styles into the document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = appStyles;
    document.head.appendChild(styleElement);

    // Clean up the style element on component unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [appStyles]); // Re-run if styles change (though they are static here)

  // Weather icon mapping using provided image URLs and placeholders for missing ones
  const getWeatherIcon = (weatherMain) => {
    const iconMap = {
      // Main weather conditions
      Clear: 'http://googleusercontent.com/file_content/8', // 8.png - cloud with sun (assuming clear means sunny or partly cloudy)
      Clouds: 'http://googleusercontent.com/file_content/6', // 6.png - two clouds
      Rain: 'http://googleusercontent.com/file_content/7', // 7.png - rain/drizzle like
      Drizzle: 'http://googleusercontent.com/file_content/9', // 9.png - rain/drizzle like
      Thunderstorm: 'http://googleusercontent.com/file_content/10', // 10.png - cloud with lightning
      Snow: 'http://googleusercontent.com/file_content/13', // 13.png - thermometer (best fit for snow, as it's a cold indicator)
      Mist: 'http://googleusercontent.com/file_content/12', // 12.png - gray rectangle (general for mist/haze/fog)
      Smoke: 'http://googleusercontent.com/file_content/12',
      // Removed duplicate Haze entry
      Dust: 'http://googleusercontent.com/file_content/12',
      Fog: 'http://googleusercontent.com/file_content/12',
      Sand: 'http://googleusercontent.com/file_content/12',
      Ash: 'http://googleusercontent.com/file_content/12',
      Squall: 'https://placehold.co/120x120/A9A9A9/000000?text=Wind', // No specific image for wind/squall/tornado
      Tornado: 'https://placehold.co/120x120/A9A9A9/000000?text=Tornado',

      // Additional OpenWeatherMap conditions (using generic placeholders if no specific image)
      Atmosphere: 'http://googleusercontent.com/file_content/12', // General atmospheric conditions
      // ... you can add more specific mappings here if you have more icons
    };
    return (
      iconMap[weatherMain] || 'http://googleusercontent.com/file_content/5'
    ); // Default to 5.png (white rectangle) if no specific icon
  };

  // Placeholder for search icon and detail icons
  const searchIcon = 'https://placehold.co/24x24/cccccc/000000?text=Search'; // 15.jpg not provided
  const mistIconDetail = 'http://googleusercontent.com/file_content/11'; // 11.png - gray square (used for humidity, as it's a general indicator)
  const windIconDetail = 'https://placehold.co/40x40/A9A9A9/000000?text=Wind'; // No specific image for wind
  const clearIconDetail = 'http://googleusercontent.com/file_content/3'; // 1.png - red square (used for feels like)
  const cloudsIconDetail = 'http://googleusercontent.com/file_content/4'; // 4.png - cloud with dark corner (used for pressure)

  // Format date
  const formatDate = () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Get user's location weather on initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          let userFriendlyMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              userFriendlyMessage =
                'You denied the request for your location. Please enable location services in your browser settings to get weather for your current position.';
              break;
            case error.POSITION_UNAVAILABLE:
              userFriendlyMessage =
                'Location information is unavailable. Your device might not be able to determine your position.';
              break;
            case error.TIMEOUT:
              userFriendlyMessage =
                'The request to get your location timed out. Please try again.';
              break;
            default:
              userFriendlyMessage =
                'An unknown error occurred while trying to get your location.';
              break;
          }
          console.error('Geolocation error:', userFriendlyMessage, error);
          setError(
            `${userFriendlyMessage} Falling back to default city (New York).`
          );
          // If geolocation fails, load default city
          fetchWeatherByCity('New York');
        }
      );
    } else {
      setError(
        'Geolocation is not supported by this browser. Falling back to default city (New York).'
      );
      fetchWeatherByCity('New York');
    }
  }, []);

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      // IMPORTANT: Replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual API key
      // You can get one from https://openweathermap.org/api
      const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c'; // Replaced with user-provided API key
      if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY' || !API_KEY) {
        throw new Error(
          "API Key is missing or invalid. Please replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual key from OpenWeatherMap."
        );
      }
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError(
        `Failed to fetch weather data: ${err.message}. Please ensure your API key is correct and try again.`
      );
      console.error('Weather API call error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city name
  const fetchWeatherByCity = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      // IMPORTANT: Replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual API key
      const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c'; // Replaced with user-provided API key
      if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY' || !API_KEY) {
        throw new Error(
          "API Key is missing or invalid. Please replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual key from OpenWeatherMap."
        );
      }
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError(
        `City not found or API error: ${err.message}. Please try again.`
      );
      console.error('Weather API call error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherByCity(city.trim());
      setCity('');
    }
  };

  return (
    <div className="app">
      <div className="weather-container">
        <div className="search-section">
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
        </div>

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {weatherData && !loading && (
          <div className="weather-info">
            <div className="main-weather">
              <div className="weather-icon-container">
                <img
                  src={getWeatherIcon(weatherData.weather[0].main)}
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
                  <img src={windIconDetail} alt="Wind Speed" />
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
