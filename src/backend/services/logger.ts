import winston from 'winston';
import path from 'path';
import os from 'os';
import { isDev } from '..';
import { app } from 'electron';

const logFilePath = isDev ? '.' : app.getPath('userData');

export const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logFilePath, 'app.log'),
      maxsize: 1000000, // 1 MB
      maxFiles: 1,
    }),
  ]
});