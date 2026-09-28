import {z} from 'zod';
export const webhookSchema = z.object({
    params:z.string().min(1, 'Endpoint path is required'),
    body:z.object(z.unknown()),
    headers:z.object({
        'content-type':z.string({required_error:"Content-Type header is required"})
    }).passthrough()
});
