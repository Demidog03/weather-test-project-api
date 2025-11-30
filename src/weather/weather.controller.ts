import { Controller, Get, Query, Param } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({ summary: 'Get all weather data' })
  @ApiResponse({ status: 404, description: 'This endpoint is not available' })
  async getAllWeather() {
    return this.weatherService.getAllWeather();
  }

  @Get('location/:location')
  @ApiOperation({ summary: 'Get weather by location name' })
  @ApiResponse({
    status: 200,
    description: 'Returns weather for the specified location',
  })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  async getWeatherByLocation(@Param('location') location: string) {
    return this.weatherService.getWeatherByLocation(location);
  }

  @Get('coordinates')
  @ApiOperation({ summary: 'Get weather by coordinates' })
  @ApiResponse({
    status: 200,
    description: 'Returns weather for the specified coordinates',
  })
  @ApiResponse({ status: 400, description: 'Invalid coordinates' })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  async getWeatherByCoordinates(@Query() query: GetWeatherDto) {
    return this.weatherService.getWeatherByCoordinates(query.lat, query.lon);
  }

  @Get('city')
  @ApiOperation({ summary: 'Get city name by coordinates (reverse geocoding)' })
  @ApiResponse({
    status: 200,
    description: 'Returns city information for the specified coordinates',
  })
  @ApiResponse({ status: 400, description: 'Invalid coordinates' })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  async getCityByCoordinates(@Query() query: GetWeatherDto) {
    return this.weatherService.getCityByCoordinates(query.lat, query.lon);
  }
}
