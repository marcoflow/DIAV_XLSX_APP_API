import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from 'src/config';
import { SpreadsheetModule } from 'src/spreadsheet/spreadsheet.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    SpreadsheetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
