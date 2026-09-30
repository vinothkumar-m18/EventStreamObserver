import {keyof, z} from 'zod';
export const webhookSchema = z.object({
    params:z.object({
        endPointPath:z.string().min(1, 'Endpoint Path is required')
    }),
    body:z.record(z.unknown()),
    headers:z.preprocess(
        (obj) => {
            if(!obj || typeof obj !== 'object') return obj;
            return Object.fromEntries(
                Object.entries(obj).map(([key, val]) => [key.toLowerCase(), val])
            );
        },
        z.object({
            'content-type':z.string({required_error:"Content-Type header is required"}).passthrough()
        })
    )
});
