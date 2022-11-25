import { Injectable } from '@nestjs/common';
import { AddUserDto, UpdateUserDto } from '@/system/dto/user';
import { UserEntity } from '@/entitys/user.entity';
import { clone, strToMd5, YYYY_MM_DD } from '@/common/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '@/entitys/role.entity';
import moment from 'moment';
import Page from '@/common/page';
import { DeptEntity } from '@/entitys/dept.entity';
import { ChangeUserBasicDto } from '../../dto/user/index';

interface Conds {
  username?: string;
  nickname?: string;
  phone?: string;
  updateTimeRange?: string[];
  createTimeRange?: string[];
  dataStatus?: number | string;
  roleCodes?: string[];
  deptId?: number;
  page?: number;
  pageSize?: number;
}
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(DeptEntity)
    private readonly deptRepository: Repository<DeptEntity>,
  ) {}
  async addUser(addUserDto: AddUserDto) {
    let user = new UserEntity();
    user = clone(user, addUserDto, ['roles']);
    user.createTime = new Date();
    user.updateTime = new Date();
    user.password = strToMd5(user.password ?? '123456');
    const roles = await this.roleRepository.findByIds(addUserDto.roles);
    const dept = await this.deptRepository.findOne(addUserDto.deptId);
    user.dept = dept;
    user.roles = roles;
    user.dataStatus = 1;
    user.avatar = '';
    return await this.userRepository.save(user);
  }
  async updateUser(updateUserDto: UpdateUserDto) {
    let user = await this.userRepository.findOne({ id: updateUserDto.id });
    if (!user) {
      return null;
    }
    user = clone(user, updateUserDto, ['createTime', 'roles', 'password']);
    if (updateUserDto.password) {
      user.password = strToMd5(updateUserDto.password);
    }
    user.updateTime = new Date();
    const roles = await this.roleRepository.findByIds(updateUserDto.roles);
    const dept = await this.deptRepository.findOne(updateUserDto.deptId);
    user.roles = roles;
    user.dept = dept;
    return await this.userRepository.save(user);
  }
  async changeUserBasic(changeUserBasicDto: ChangeUserBasicDto) {
    const { id, ...changeInfo } = changeUserBasicDto;
    return await this.userRepository.update({ id }, changeInfo);
  }
  async changePassword(id: number, newPassword: string) {
    return await this.userRepository.update(
      { id },
      { password: strToMd5(newPassword) },
    );
  }
  async getUserByConds(params: Conds) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('1=1');
    if (params.deptId) {
      queryBuilder
        .innerJoinAndSelect('user.dept', 'dept')
        .andWhere(
          `(dept.id = ${params.deptId} or dept.id in (select t.id from sys_dept t where find_in_set(${params.deptId},ancestors) ))`,
        );
    }
    if (params.roleCodes) {
      const index = params.roleCodes.findIndex((s) => s === '');
      if (index > -1) {
        params.roleCodes.splice(index, 1);
      }
      queryBuilder
        .innerJoinAndSelect('user.roles', 'role')
        .andWhere('role.roleName in (:...roleCodes)', {
          roleCodes: params.roleCodes,
        });
    }
    params.username &&
      queryBuilder.andWhere(' user.username like :username', {
        username: '%' + params.username + '%',
      });
    params.phone &&
      queryBuilder.andWhere(' user.phone = :phone ', { phone: params.phone });
    params.nickname &&
      queryBuilder.andWhere(' user.nickname like :nickname ', {
        nickname: `%${params.nickname.trim()}%`,
      });
    if (params.createTimeRange && params.createTimeRange instanceof Array) {
      queryBuilder.andWhere(
        'user.createTime between :createStartTime and :createEndTime',
        {
          createStartTime: moment(
            params.createTimeRange[0],
            YYYY_MM_DD,
          ).toDate(),
          createEndTime: moment(params.createTimeRange[1], YYYY_MM_DD).toDate(),
        },
      );
    }
    if (params.updateTimeRange && params.updateTimeRange instanceof Array) {
      queryBuilder.andWhere(
        ' user.updateTime between :updateStartTime and :updateEndTime',
        {
          updateStartTime: moment(
            params.updateTimeRange[0],
            YYYY_MM_DD,
          ).toDate(),
          updateEndTime: moment(params.updateTimeRange[1], YYYY_MM_DD).toDate(),
        },
      );
    }
    if (params.dataStatus !== undefined && params.dataStatus !== '') {
      queryBuilder.andWhere(' user.dataStatus = :dataStatus', {
        dataStatus: params.dataStatus,
      });
    } else {
      queryBuilder.andWhere(` user.dataStatus in(0,1)`);
    }
    const count = await queryBuilder.getCount();
    const page = new Page(count, params.page, params.pageSize);
    const users = await queryBuilder
      .limit(page.pageSize)
      .offset(page.startIndex)
      .orderBy('user.updateTime', 'DESC')
      .getMany();
    users.forEach((user: any) => {
      delete user.password;
    });
    page.list = users;
    return page;
  }
  async delUser(id: number) {
    const user = await this.getUserById(id);
    if (!user) {
      return false;
    }
    user.roles = [];
    user.dataStatus = -1;
    await this.userRepository.save(user);
  }
  async getUserById(id: number) {
    return await this.userRepository.findOne(id, {
      relations: ['dept', 'roles'],
    });
  }
  async getUserByUsername(username: string) {
    return await this.userRepository.findOne(
      { username },
      { relations: ['dept', 'roles'] },
    );
  }
}
