import { Injectable } from '@nestjs/common';
import * as Sequelize from 'sequelize';
import DBConfig from './../util/db.util';

@Injectable()
export class UserService {
  async findOne(username: string): Promise<any | undefined> {
    const sql = `
    SELECT
      user_id id, real_name realName, role
    FROM
      admin_user
    WHERE 
      account_name = '${username}'
    `;
    try {
      const result = await DBConfig.config.query(sql, {
        type: Sequelize.QueryTypes.SELECT, // 查询方式
        raw: true, // 是否使用数组组装的方式展示结果
        logging: true, // 是否将SQL语句打印到控制台，默认为true
      });
      console.log('result：', result);
      const target = result[0];
      console.log('target：', target);
      if (target) {
        return {
          code: 200,
          data: {
            target,
          },
        };
      } else {
        return {
          code: 600,
          msg: '查无此人',
        };
      }
    } catch (error) {
      return {
        code: 503,
        msg: `Service error：${error}`,
      };
    }
  }
}
