import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from './system/system.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    SystemModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test01',
      password: 'test01',
      database: 'test_admin',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
