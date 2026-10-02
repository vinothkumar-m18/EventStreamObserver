import logger from "../utils/logger";
export const validateWebhook = (schema) => (req, res, next) => {
    try {
        schema.parse({
            params: req.params,
            body: req.body,
            headers: req.headers
        });
        next();
    } catch (error) {
        logger.warn('Zod validation failed', {
            path:req.originalUrl,
            errors:error.errors
        });
        return res.status(400).json({
            message: 'Invalid request data',
            errors: error.errors
        });
    }
};