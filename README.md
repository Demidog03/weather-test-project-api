# 🌤️ Weather API

A Weather API service built using NestJS. This application provides weather information endpoints without authentication requirements.

---

## 📘 Description

This project is a backend API service for retrieving weather information. Built using NestJS and best practices, it provides endpoints to get weather data by location or coordinates.

---

## ✅ Features

- 🌤️ Get weather by location name (using OpenWeatherMap API)
- 📍 Get weather by coordinates (latitude/longitude)
- 📄 API Documentation with Swagger
- 🐳 Dockerized environment for easy setup
- 🔄 Real-time weather data from OpenWeatherMap

---

## 🧰 Tech Stack

| Layer             | Technology                     |
|------------------|--------------------------------|
| Framework        | NestJS                          |
| HTTP Client      | Axios (via @nestjs/axios)      |
| Weather API      | OpenWeatherMap API              |
| Containerization | Docker, Docker Compose          |
| API Docs         | Swagger (via @nestjs/swagger)   |
| Language         | TypeScript                      |

---

## 📂 Folder Structure

```
weather-test-project-api/
│
├── src/
│ ├── weather/ # Weather module
│ ├── app.module.ts # Main application module
│ ├── main.ts # Application entry point
│
├── Dockerfile # Docker image build file
├── docker-compose.yml # Docker setup
├── README.md # You're reading it
```

---

## ⚙️ Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/) and sign up for a free account
2. Navigate to the "API keys" section in your account dashboard
3. Generate a new API key (free tier allows 1,000 calls per day)
4. **Important**: New API keys can take up to 2 hours to activate. If you get a 401 error, wait a bit and try again.
5. Make sure your email is verified - OpenWeatherMap requires email verification for API key activation

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Running the App With Docker

```bash
docker-compose up --build
```

App: http://localhost:3000

### 5. Running Without Docker (Locally)

```bash
npm run start:dev
```

## 📑 API Documentation

Once the server is running, open:

http://localhost:3000/api/docs

Auto-generated using @nestjs/swagger

## 🔌 API Endpoints

### Get Weather by Location
- **GET** `/weather/location/:location`
- Example: `/weather/location/New York` or `/weather/location/London`
- Returns weather data for the specified location
- Uses OpenWeatherMap API to fetch real-time weather data

### Get Weather by Coordinates
- **GET** `/weather/coordinates?lat=40.7128&lon=-74.0060`
- Returns weather data for the specified coordinates (latitude and longitude)
- Uses OpenWeatherMap API to fetch real-time weather data

## 📊 Response Format

All endpoints return detailed weather data in the following format:

```json
{
  "location": "Moscow",
  "temperature": 10,
  "feelsLike": 5,
  "condition": "Clouds",
  "description": "broken clouds",
  "humidity": 97,
  "pressure": 1021,
  "dewPoint": 0,
  "visibility": 10.0,
  "windSpeed": 3.0,
  "windDirection": 150,
  "windDirectionText": "SSE"
}
```

### Field Descriptions:

- **location**: City name
- **temperature**: Current temperature in Celsius
- **feelsLike**: "Feels like" temperature in Celsius
- **condition**: Main weather condition (e.g., "Clear", "Clouds", "Rain")
- **description**: Detailed weather description
- **humidity**: Humidity percentage (0-100)
- **pressure**: Atmospheric pressure in hPa
- **dewPoint**: Dew point temperature in Celsius
- **visibility**: Visibility in kilometers (null if not available)
- **windSpeed**: Wind speed in km/h
- **windDirection**: Wind direction in degrees (0-360)
- **windDirectionText**: Wind direction as text (N, NE, E, SE, S, SW, W, NW, etc.)
