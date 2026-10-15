import logger from "../utils/logger.js";
export const validate = (schema) => (req, res, next) => {

        const result = schema.safeParse({
            params: req.params,
            body: req.body,
            headers: req.headers
        });
        if(!result.success){
            const zodIssues = result.error.issues.map(issue => ({
                path:issue.path.join('.'),
                message:issue.message,
                code:issue.code
            }));
            logger.warn('Zod validation failed', {
                method:req.method,
                path:req.originalUrl,
                zodErrors:zodIssues
            });
            return res.status(400).json({
                message:'Invalid request data',
                errors:zodIssues
            });
        }
        req.validatedData = result.data;
        next();            
};