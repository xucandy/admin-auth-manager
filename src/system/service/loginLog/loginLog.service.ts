import { Injectable } from '@nestjs/common';
import * as parser from 'ua-parser-js';
import { Repository } from 'typeorm';
import axios from 'axios';
import { UserEntity } from '../../../entitys/user.entity';
import { getIp } from '../../../common/utils';
import { LoginLogEntity } from '../../../entitys/loginLog.entity';
import Page from '@/common/page';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(LoginLogEntity)
    private readonly loginLogRepository: Repository<LoginLogEntity>,
  ) {}
  async save(req: any, user: UserEntity) {
    const ip = getIp(req);
    const ua = parser(req.headers['user-agent']);
    const loginLog = new LoginLogEntity();
    loginLog.loginTime = new Date();
    loginLog.os = ua.os.name + '/' + ua.os.version;
    loginLog.ua = ua.ua;
    loginLog.userId = user.id;
    loginLog.browser = ua.browser.name + '/' + ua.browser.version;
    const url = `http://opendata.baidu.com/api.php?query=${ip}&co=&resource_id=6006&oe=utf8`;
    axios.get(url).then((res: any) => {
      loginLog.ip = ip;
      loginLog.location =
        res.data.data.length > 0 ? res.data.data[0].location : '未获取到地址';
      this.loginLogRepository.save(loginLog);
    });
  }
  async getLoginLogList({
    pageNum = 1,
    pageSize = 10,
  }: { pageNum?: number; pageSize?: number } = {}) {
    const queryBuilder = this.loginLogRepository.createQueryBuilder('loginLog');
    queryBuilder
      .leftJoinAndSelect(UserEntity, 'user', 'user.id = loginLog.userId')
      .select([
        'loginLog.id as id',
        'loginLog.os as os',
        'loginLog.browser as browser',
        'loginLog.ip as ip',
        'loginLog.location as location',
        'loginLog.ua as ua',
        'loginLog.loginTime as loginTime',
        'loginLog.userId as userId',
        'user.username as username',
        'user.nickname as nickname',
      ]);
    const count = await queryBuilder.getCount();
    const page = new Page(count, pageNum, pageSize);
    const result = await queryBuilder
      .orderBy('loginLog.loginTime', 'DESC')
      .offset(page.startIndex)
      .limit(page.pageSize)
      .getRawMany();
    page.list = result;
    return page;
  }
}
