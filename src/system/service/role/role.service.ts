import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../../../entitys/role.entity';
import { Repository } from 'typeorm';
import { AddRoleDto, UpdateRoleDto } from '../../dto/role';
import { clone, YYYY_MM_DD, YYYY_MM_DD_HH_MM_SS } from '../../../common/utils';
import * as moment from 'moment';
import Page from '../../../common/page';
import { MenuEntity } from '@/entitys/menu.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
  ) {}
  async addRole(roleDto: AddRoleDto) {
    let roleEntity = new RoleEntity();
    roleEntity = clone(roleEntity, roleDto);
    const menus = await this.menuRepository.findByIds(roleDto.menus);
    roleEntity.createTime = new Date();
    roleEntity.updateTime = new Date();
    roleEntity.dataStatus = 1;
    roleEntity.menus = menus;
    return await this.roleRepository.save(roleEntity);
  }
  async updateRole(roleDto: UpdateRoleDto) {
    let roleEntity = await this.roleRepository.findOne({ id: roleDto.id });
    if (!roleEntity) {
      return null;
    }
    const menus = await this.menuRepository.findByIds(roleDto.menus);
    roleEntity = clone(roleEntity, roleDto, ['createTime']);
    roleEntity.menus = menus;
    roleEntity.updateTime = new Date();
    return await this.roleRepository.save(roleEntity);
  }
  async delRoleById(id: number) {
    return await this.roleRepository.update({ id }, { dataStatus: -1 });
  }
  async getRoleById(id: number) {
    return await this.roleRepository.findOne(id, { relations: ['menus'] });
  }
  async getRoleByConds(
    roleName: string,
    roleDesc: string,
    dataStatus: number[],
    createTimeRange: string[],
    updateTimeRange: string[],
    page: number,
    pageSize: number,
  ) {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    queryBuilder.where(' 1=1 ');
    if (roleName) {
      queryBuilder.andWhere('role.roleName like :roleName', {
        roleName: '%' + roleName + '%',
      });
    }
    if (roleDesc) {
      queryBuilder.andWhere('role.roleDesc like :roleDesc', {
        roleDesc: '%' + roleDesc + '%',
      });
    }
    queryBuilder.andWhere(`role.dataStatus  in  (${dataStatus.join(',')})`);
    if (createTimeRange) {
      queryBuilder.andWhere(
        ' role.createTime between :createTimeStart and :createTimeEnd',
        {
          createTimeStart: moment(createTimeRange[0], YYYY_MM_DD).toDate(),
          createTimeEnd: moment(createTimeRange[1], YYYY_MM_DD).toDate(),
        },
      );
    }
    if (updateTimeRange) {
      queryBuilder.andWhere(
        ' role.updateTime between :updateTimeStart and :updateTimeEnd',
        {
          updateTimeStart: moment(updateTimeRange[0], YYYY_MM_DD).toDate(),
          updateTimeEnd: moment(updateTimeRange[1], YYYY_MM_DD).toDate(),
        },
      );
    }
    const count = await queryBuilder.getCount();
    const pageObj = new Page(count, page, pageSize);
    queryBuilder.limit(pageObj.pageSize).offset(pageObj.startIndex);
    const roles = await queryBuilder.getMany();
    roles.forEach((role: any) => {
      role.createTime = moment(role.createTime).format(YYYY_MM_DD_HH_MM_SS);
      role.updateTime = moment(role.updateTime).format(YYYY_MM_DD_HH_MM_SS);
    });
    pageObj.list = roles;
    return pageObj;
  }
  async getAllRoll() {
    return this.roleRepository.find({ dataStatus: 1 });
  }
}
