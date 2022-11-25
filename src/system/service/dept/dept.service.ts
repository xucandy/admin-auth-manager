import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeptEntity } from '@/entitys/dept.entity';
import { FindConditions, Like, Repository, In } from 'typeorm';
import { AddDeptDto, UpdateDeptDto } from '@/system/dto/dept';
import { clone } from '@/common/utils';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(DeptEntity)
    private readonly deptRepository: Repository<DeptEntity>,
  ) {}
  async addDept(addDeptDto: AddDeptDto) {
    let dept = new DeptEntity();
    let ancestors = '';
    if (addDeptDto.parentId === 0) {
      ancestors = '0';
    } else {
      const parentDept = await this.deptRepository.findOne({
        id: addDeptDto.parentId,
      });
      if (!parentDept) {
        return null;
      }
      ancestors = `${parentDept.ancestors},${parentDept.id}`;
    }
    dept = clone(dept, addDeptDto, ['createTime', 'updateTime']);
    dept.ancestors = ancestors;
    dept.createTime = new Date();
    dept.updateTime = new Date();
    dept.dataStatus = 1;
    return await this.deptRepository.save(dept);
  }
  async updateDept(updateDto: UpdateDeptDto) {
    let dept = await this.deptRepository.findOne({ id: updateDto.id });
    if (!dept) {
      return null;
    }
    let ancestors = '';
    if (dept.parentId === 0) {
      ancestors = '0';
    } else {
      const parentDept = await this.deptRepository.findOne({
        id: updateDto.parentId,
      });
      ancestors = `${parentDept.ancestors},${dept.parentId}`;
    }
    dept = clone(dept, updateDto, ['createTime']);
    dept.ancestors = ancestors;
    dept.updateTime = new Date();
    return await this.deptRepository.save(dept);
  }
  async getDeptTree(deptName: string, dataStatus?: number) {
    const where: FindConditions<DeptEntity> = {};
    if (deptName) {
      where.name = Like(`%${deptName}%`);
    }
    where.dataStatus = dataStatus ?? In([0, 1]);
    const deptEntitys = await this.deptRepository.find({
      where,
    });
    const deepFindDepts = (depts: DeptEntity[]) => {
      depts.forEach((d) => {
        const children = DeptService.getDeptByParentId(d.id, deptEntitys);
        if (children.length > 0) {
          d.children = children;
          deepFindDepts(d.children);
        }
      });
    };
    if (deptEntitys.length <= 1) {
      return deptEntitys;
    }
    const rootDepts = DeptService.getDeptByParentId(0, deptEntitys);
    if (rootDepts.length === 0) {
      return deptEntitys;
    }
    deepFindDepts(rootDepts);
    return rootDepts;
  }
  private static getDeptByParentId(parentId: number, depts: DeptEntity[]) {
    const filterDepts = [];
    for (let i = 0; i < depts.length; i++) {
      const dept = depts[i];
      if (dept.parentId === parentId) {
        filterDepts.push(dept);
        depts.splice(i, 1);
        i--;
      }
    }
    return filterDepts;
  }
  async getDeptById(id: number) {
    return await this.deptRepository.findOne({ id });
  }
  async delDept(id: number) {
    return await this.deptRepository.update({ id }, { dataStatus: -1 });
  }
}
