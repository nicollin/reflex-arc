import { Dialect } from 'sequelize';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { getProcessProp } from './data.util';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

class DBConfig {
  // 数据库连接
  private dbConnect: Sequelize;

  // 获取数据库连接
  get config() {
    return this.dbConnect;
  }

  // 1.获取配置文件路径
  private getEnvFilePath(): string {
    const isProd = process.env.NODE_ENV === 'production';
    const devEnv = path.resolve('./src/conifg/.env.development');
    const prodEnv = path.resolve('./src/conifg/.env.production');
    if (
      (!isProd && !fs.existsSync(devEnv)) ||
      (isProd && !fs.existsSync(prodEnv))
    ) {
      console.log('缺少环境配置文件！无法获取配置信息！');
      return null;
    } else {
      console.log('获取环境配置文件成功！');
      console.log('当前环境：', isProd ? '生产环境' : '开发环境');
      console.log('配置文件：', isProd ? prodEnv : devEnv);
    }
    const filePath = isProd ? prodEnv : devEnv;
    return filePath;
  }

  // 2.获取环境配置
  private getEnvConfig = (): SequelizeOptions => {
    return {
      dialect: getProcessProp<Dialect>('DB_DIALECT'),
      host: getProcessProp('DB_HOST'),
      port: getProcessProp<number>('DB_PORT'),
      username: getProcessProp('DB_USERNAME'),
      password: getProcessProp('DB_PASSWORD'),
      database: getProcessProp('DB_DATABASE'),
      sync: {
        force: false,
      },
      timezone: '+08:00', // 东八时区
      pool: {
        max: 10, // 连接池最大连接数
        min: 0, // 连接池最小连接数
        acquire: 30000, // 连接池未能连接并抛出异常的最长时间
        idle: 10000, // 单线程未被使用则释放的最长时间
      },
    };
  };

  // 3.设置数据库连接
  private setDBConnect(connectConfig: SequelizeOptions) {
    this.dbConnect = new Sequelize(connectConfig);
  }

  // 4.检查数据库连接
  private async checkDBConnect() {
    try {
      await this.dbConnect.authenticate();
      console.log('数据库连接成功!');
    } catch (e) {
      console.log('数据库连接失败：', e);
    }
  }

  // 加载配置文件
  async loadConfig() {
    const path = this.getEnvFilePath();
    if (!path) return;
    dotenv.config({ path });
    const connectConfig = this.getEnvConfig();
    this.setDBConnect(connectConfig);
    await this.checkDBConnect();
  }
}

export default new DBConfig();
