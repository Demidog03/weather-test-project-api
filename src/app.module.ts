import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [WeatherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
