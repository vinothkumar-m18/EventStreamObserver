import {createLogger, format, transports} from 'winston';
const {combine, timestamp, printf, colorize, json, errors} = format;
// local dev
const devConsoleFormat = printf(
    ({level, message, timestamp, stack, zodErrors, ...meta})=>{
        let logOutput = `[${timestamp}] ${level}: ${stack || message}`;
        if(errors){
            consolelog('error object is not null inside dev console format');
        }else{
            console.log('error object is null inside dev console format');
        }
        if(errors && Array.isArray(errors)){            
            console.log('dev console if block');
            const errorDetails = errors.map(err => `Field '${err.path.join('.')}' -> ${err.message}`).join(', ');
            logOutput += ` | Validation Errors: [${errorDetails}]`;
        }else if(Object.keys(meta).length){
            console.log('dev console else if block');
            logOutput += `${JSON.stringify(meta)}`;
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

