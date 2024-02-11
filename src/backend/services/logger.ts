import winston from 'winston';

export const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'service.log',
      maxsize: 1000000, // 1 MB
      maxFiles: 1,
    }),
  ],
});
