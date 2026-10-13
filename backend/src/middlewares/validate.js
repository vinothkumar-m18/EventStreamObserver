import logger from "../utils/logger.js";
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            params: req.params,
            body: req.body,
            headers: req.headers
        });
        next();
    } catch (error) {
        console.log('RAW ZOD ERROR OBJECT: ', error);
        logger.warn('Zod validation failed', {
            path:req.originalUrl,
            zodErrors:error.errors
        });
        return res.status(400).json({
            message: 'Invalid request data',
            errors: error.errors
        });
    }
};