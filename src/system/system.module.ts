import { Module } from '@nestjs/common';
import { UserController } from './controller/user/user.controller';
import { RoleController } from './controller/role/role.controller';
import { DeptController } from './controller/dept/dept.controller';
import { MenuController } from './controller/menu/menu.controller';
import { MenuService } from './service/menu/menu.service';
import { UserService } from './service/user/user.service';
import { DeptService } from './service/dept/dept.service';
import { RoleService } from './service/role/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from '../entitys/menu.entity';
import { RoleEntity } from '@/entitys/role.entity';
import { DeptEntity } from '@/entitys/dept.entity';
import { UserEntity } from '@/entitys/user.entity';
import { FileController } from './controller/file/file.controller';
import { FileService } from './service/file/file.service';
import { FileEntity } from '../entitys/file.entity';
import { CaptchaService } from './service/captcha/captcha.service';
import { CaptchaController } from './controller/captcha/captcha.controller';
import { LoginController } from './controller/login/login.controller';
import { LoginService } from './service/login/login.service';
import { LoginLogEntity } from '../entitys/loginLog.entity';
import { LoginLogService } from './service/loginLog/loginLog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuEntity,
      RoleEntity,
      DeptEntity,
      UserEntity,
      FileEntity,
      LoginLogEntity,
    ]),
  ],
  controllers: [
    UserController,
    RoleController,
    DeptController,
    MenuController,
    FileController,
    CaptchaController,
    LoginController,
  ],
  providers: [
    MenuService,
    UserService,
    DeptService,
    RoleService,
    FileService,
    CaptchaService,
    LoginService,
    LoginLogService,
  ],
})
export class SystemModule {}
