import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class GetWeatherDto {
  @ApiProperty({
    description: 'Latitude',
    example: 40.7128,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({
    description: 'Longitude',
    example: -74.006,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  lon: number;
}
