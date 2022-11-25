import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from '../../../entitys/menu.entity';
import { FindConditions, Like, Repository } from 'typeorm';
import { AddMenuDto, UpdateMenuDto } from '../../dto/menu';
import { clone } from '../../../common/utils';
import { RoleEntity } from '../../../entitys/role.entity';
import { UserEntity } from '../../../entitys/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly userService: UserService,
  ) {}
  async addMenu(menuDto: AddMenuDto) {
    let menu = new MenuEntity();
    menu = clone(menu, menuDto);
    if (menu.parentId == undefined) {
      menu.parentId = 0;
    }
    if (menu.type == 1 && menu.hidden == undefined) {
      menu.hidden = true; //默认菜单显示
    }
    menu.createTime = new Date();
    menu.updateTime = new Date();
    menu.dataStatus = 1;
    menu.type = 1;
    //throw new HttpException('抛出的异常', 500);
    return await this.menuRepository.save(menu);
  }
  async updateMenu(menu: UpdateMenuDto) {
    let menuEntity = await this.menuRepository.findOne(menu.id);
    if (!menuEntity) {
      return null;
    }
    menuEntity = clone(menuEntity, menu, ['createTime']);
    menuEntity.updateTime = new Date();
    return await this.menuRepository.save(menuEntity);
  }
  async getMenuTree(menuName?: string) {
    const where: FindConditions<MenuEntity> = { dataStatus: 1 };
    if (menuName) {
      where.name = Like('%' + menuName + '%');
    }
    const menus = await this.menuRepository.find({
      where,
      order: {
        sort: 'ASC',
        createTime: 'ASC',
      },
    });
    const deepFindMenu = (children: MenuEntity[]) => {
      children.forEach((menu) => {
        const filterMenus = MenuService.getMenuByParentId(menu.id, menus);
        if (filterMenus.length > 0) {
          menu.children = filterMenus;
          deepFindMenu(menu.children);
        }
      });
    };
    const rootMenus = MenuService.getMenuByParentId(0, menus);
    if (rootMenus.length === 0 || menus.length === 0) {
      return rootMenus;
    }
    deepFindMenu(rootMenus);
    return rootMenus;
  }
  async getUserRouters(userEntity: UserEntity) {
    const user = await this.userService.getUserById(userEntity.id);
    const roleIds = user.roles.map((r) => r.id);
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    const roles = await queryBuilder
      .leftJoinAndSelect(
        'role.menus',
        'menus',
        'menus.dataStatus = 1 and menus.type =1',
      )
      .andWhereInIds(roleIds)
      .getMany();
    const menus = roles.map((r) => r.menus).flat();
    MenuService.distinctMenu(menus);
    const rootMenus = MenuService.getMenuByParentId(0, menus);
    const deepFindMenu = (children: MenuEntity[]) => {
      return children.map((menu) => {
        const route: any = {
          id: menu.id,
          parentId: menu.parentId,
          name: menu.name,
          path: menu.path,
          auth: menu.scope,
          component: menu.component,
          meta: {
            hidden: menu.hidden,
            icon: menu.icon,
            layout: menu.layout,
            title: menu.name,
          },
        };
        const filterMenus = MenuService.getMenuByParentId(menu.id, menus);
        if (filterMenus.length > 0) {
          route.children = deepFindMenu(filterMenus);
        }
        return route;
      });
    };
    return deepFindMenu(rootMenus);
  }
  private static distinctMenu(menus: MenuEntity[]) {
    menus.sort((m1, m2) => m1.sort - m2.sort);
    for (let i = menus.length - 1; i >= 0; i--) {
      const menu = menus[i];
      const firstIndex = menus.findIndex((m) => m.id == menu.id);
      if (firstIndex !== i) {
        menus.splice(i, 1);
      }
    }
  }
  private static getMenuByParentId(parentId: number, menus: MenuEntity[]) {
    const filterMenu: MenuEntity[] = [];
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      if (menu.parentId === parentId) {
        filterMenu.push(menu);
        menus.splice(i, 1);
        i--;
      }
    }
    return filterMenu;
  }
  async getMenuById(id: number) {
    return await this.menuRepository.find({ id });
  }
  async delMenuById(id: number) {
    return await this.menuRepository.delete({ id });
  }
}
