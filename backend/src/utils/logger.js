import {createLogger, format, transports} from 'winston';
const {combine, timestamp, printf, colorize, json, errors} = format;
// local dev
const devConsoleFormat = printf(
    ({level, message, timestamp, stack, ...meta})=>{
        const metadata = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `[${timestamp}] ${level}: ${stack || message} ${metadata}`;
    }
);
const logger = createLogger(
    {
        level:process.env.LOG_LEVEL || 'info',
        format:combine(
            timestamp({format:'YYYY-MM-DD HH:mm:ss' }),
            errors({stack:true})
        ),
        transports:[
            // output to terminal
            new transports.Console({
                format:process.env.NODE_ENV === 'production' 
                    ? combine(json()) 
                    : combine(colorize(), devConsoleFormat)
            }),
            // write errors to log file
            new transports.File({
                filename:'logs/error.log',
                level:'error',
                format:json()
            }),
            // write all logs to a log file
            new transports.File({
                filename:'logs/combined.log',
                format:json()
            })
        ]        
    }
);
export default logger;

