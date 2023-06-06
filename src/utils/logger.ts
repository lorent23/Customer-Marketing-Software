import winston from 'winston'

const { combine, timestamp, printf, colorize, align } = winston.format;

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info: any) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  // transports: [new winston.transports.Console(), new (winston.transports.File)({
  //   filename: 'logger.log',
  //   level: 'info',
  //   options: { flags: 'w' }
  // })],
  transports: [new winston.transports.Console()],
});