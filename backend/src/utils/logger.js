import {createLogger, format, transports} from 'winston';
const {combine, timestamp, printf, colorize, json, errors} = format;
// local dev
const devConsoleFormat = printf(
    ({level, message, timestamp, stack, zodErrors, ...meta})=>{
        const validationErrors = Array.isArray(zodErrors) ? zodErrors : [];
        let logOutput = `[${timestamp}] ${level}: ${stack || message}`;

        if (validationErrors.length) {
            const errorDetails = validationErrors
                .map(err => `Field '${err.path.join('.')}' -> ${err.message}`)
                .join(', ');
            logOutput += ` | Validation Errors: [${errorDetails}]`;
        } else if (Object.keys(meta).length) {
            logOutput += ` ${JSON.stringify(meta)}`;
        }

        return logOutput;
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

