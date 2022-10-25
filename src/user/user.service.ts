import { Injectable } from '@nestjs/common';
import * as Sequelize from 'sequelize';
import { encryptPassword, makeSalt } from 'src/util/cryptogram.util';
import DBConfig from './../util/db.util';

@Injectable()
export class UserService {
  /**
   * 查询是否存在该用户
   * @param accountName 用户名
   * @returns
   */
  async findOne(accountName: string): Promise<any | undefined> {
    const sql = `
    SELECT
      user_id id, account_name accountName, real_name realName, passwd password, passwd_salt salt, mobile, role
    FROM
      admin_user
    WHERE 
      account_name = '${accountName}'
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

  /**
   * 注册用户
   * @param requestBody 请求体
   */
  async register(requestBody: any): Promise<any> {
    const { accountName, realName, password, repassword, mobile } = requestBody;
    if (!password || password !== repassword) {
      return {
        code: 400,
        msg: '两次密码输入不一致',
      };
    }
    console.log('accountname', accountName, realName);
    const findOne = await this.findOne(accountName);
    if (findOne.code === 200) {
      return {
        code: 400,
        msg: '用户已存在',
      };
    }
    const salt = makeSalt();
    const hashPwd = encryptPassword(password, salt);
    const registerSQL = `
      INSERT INTO admin_user
        (account_name, real_name, passwd, passwd_salt, mobile, user_status, role, create_by)
      VALUES
        ('${accountName}', '${realName}', '${hashPwd}', '${salt}', '${mobile}', 1, 3, 0)
    `;
    try {
      await DBConfig.config.query(registerSQL, {
        logging: false,
      });
      return {
        code: 200,
        msg: 'Success',
      };
    } catch (error) {
      return {
        code: 503,
        msg: `Service error： ${error}`,
      };
    }
  }
}
