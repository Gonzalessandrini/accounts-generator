import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Carga las variables de entorno desde .env
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    WalletsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
