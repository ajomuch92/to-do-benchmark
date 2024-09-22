import { config } from "dotenv";
import { Sequelize, INTEGER, STRING, DATE, NOW, Model } from 'sequelize';

config();

DATE.prototype._stringify = function _stringify(date: any, options: any) {
    date = this._applyTimezone(date, options);
    return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};

const parseConnectionString = (connectionString: string) => {
    const params = connectionString.split(';').filter(Boolean); // Divide por ';' y elimina cualquier cadena vacía
    const config: Record<string, any> = {};
  
    params.forEach(param => {
      const [key, value] = param.split('=');
      config[key.trim()] = value.trim();
    });
  
    return {
      user: config['User Id'],
      password: config['Password'],
      server: config['Server'],
      database: config['Database'],
      options: {
        encrypt: config['Encrypt'] === 'true' // Esto es importante si la base de datos necesita encriptar conexiones
      }
    };
};


const { user, password, server, database } = parseConnectionString(process.env.CON_STRING as string)


export const sequelize = new Sequelize(database, user, password, {
    host: server,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        instanceName: 'MSSQL2016',
        enableArithAbort: true
      },
    },
  });
  
  interface ToDoAttributes {
    id?: number;
    title: string;
    description?: string;
    status?: string;
    creationDate?: Date;
  }
  
 export class ToDo extends Model<ToDoAttributes> implements ToDoAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public status!: string;
    public creationDate!: Date;
  }
  
  ToDo.init({
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    description: {
      type: STRING,
    },
    status: {
      type: STRING,
      allowNull: false,
    },
    creationDate: {
      type: DATE,
      defaultValue: NOW,
      field: 'creation_date',
    },
  }, {
    sequelize,
    modelName: 'ToDo',
    tableName: 'ToDo',
    timestamps: false,
  });