import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GetWeatherDto } from './dto/get-weather.dto';

export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  pressure: number;
  dewPoint: number;
  visibility: number | null;
  windSpeed: number;
  windDirection: number;
  windDirectionText: string;
}

export interface CityInfo {
  location: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface OpenWeatherMapResponse {
  name: string;
  sys: {
    country: string;
  };
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility?: number;
}

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private readonly httpService: HttpService) {
    this.apiKey = (process.env.OPENWEATHER_API_KEY || '').trim();
    if (!this.apiKey) {
      console.warn(
        'Warning: OPENWEATHER_API_KEY is not set. Weather API calls will fail.',
      );
    }
  }

  private getWindDirection(deg: number): string {
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  }

  private calculateDewPoint(temp: number, humidity: number): number {
    const a = 17.27;
    const b = 237.7;
    const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100.0);
    return Math.round((b * alpha) / (a - alpha) * 10) / 10;
  }

  private transformWeatherData(data: OpenWeatherMapResponse): WeatherData {
    const windDeg = data.wind?.deg || 0;
    const dewPoint = this.calculateDewPoint(
      data.main.temp,
      data.main.humidity,
    );

    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0]?.main || 'Unknown',
      description: data.weather[0]?.description || 'No description available',
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      dewPoint: dewPoint,
      visibility: data.visibility
        ? Math.round((data.visibility / 1000) * 10) / 10
        : null,
      windSpeed: Math.round(data.wind.speed * 3.6 * 10) / 10,
      windDirection: windDeg,
      windDirectionText: this.getWindDirection(windDeg),
    };
  }

  async getWeatherByLocation(location: string): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new HttpException(
        'OpenWeatherMap API key is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const url = `${this.baseUrl}/weather`;
      const params = {
        q: location,
        appid: this.apiKey,
        units: 'metric',
      };

      const response = await firstValueFrom(
        this.httpService.get<OpenWeatherMapResponse>(url, { params }),
      );

      return this.transformWeatherData(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException(
          `Location "${location}" not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || 'Invalid API key';
        throw new HttpException(
          `OpenWeatherMap API error: ${errorMessage}. Please verify your API key is valid and activated.`,
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch weather data',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllWeather(): Promise<WeatherData[]> {
    throw new HttpException(
      'This endpoint is not available. Use /weather/location/:location or /weather/coordinates',
      HttpStatus.NOT_FOUND,
    );
  }

  async getWeatherByCoordinates(
    lat: number,
    lon: number,
  ): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new HttpException(
        'OpenWeatherMap API key is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<OpenWeatherMapResponse>(
          `${this.baseUrl}/weather`,
          {
            params: {
              lat,
              lon,
              appid: this.apiKey,
              units: 'metric',
            },
          },
        ),
      );

      return this.transformWeatherData(response.data);
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new HttpException(
          'Invalid coordinates provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || 'Invalid API key';
        throw new HttpException(
          `OpenWeatherMap API error: ${errorMessage}. Please verify your API key is valid and activated.`,
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch weather data',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCityByCoordinates(
    lat: number,
    lon: number,
  ): Promise<CityInfo> {
    if (!this.apiKey) {
      throw new HttpException(
        'OpenWeatherMap API key is not configured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<OpenWeatherMapResponse>(
          `${this.baseUrl}/weather`,
          {
            params: {
              lat,
              lon,
              appid: this.apiKey,
              units: 'metric',
            },
          },
        ),
      );

      return {
        location: response.data.name,
        country: response.data.sys?.country || '',
        coordinates: {
          lat: response.data.coord.lat,
          lon: response.data.coord.lon,
        },
      };
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new HttpException(
          'Invalid coordinates provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || 'Invalid API key';
        throw new HttpException(
          `OpenWeatherMap API error: ${errorMessage}. Please verify your API key is valid and activated.`,
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch city information',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
