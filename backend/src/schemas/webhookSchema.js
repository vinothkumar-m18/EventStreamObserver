import {z} from 'zod';
export const webhookSchema = z.object({
    params:z.object({
        endPointPath:z.string().min(1, 'Endpoint Path is required')
    }),
    body:z.record(z.unknown()),
    headers:z.object({
        'content-type':z.string({required_error:"Content-Type header is required"})
    }).passthrough()
});
