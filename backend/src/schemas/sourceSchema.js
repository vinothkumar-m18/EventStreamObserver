import {z} from 'zod';
export const createSourceSchema = z.object({
    body:z.object({
        service:z.string({required_error:'Service is required'})
            .min(1, 'Serivce cannot be empty'),
        eventsAccepted:z.array(z.string()).optional()
    }).refine(
        (data) =>  {
            if(data.service !== 'github'){
                return Array.isArray(data.eventsAccepted) && data.eventsAccepted.length > 0;
            }
            return true;
        },
        {
            message:'eventsAccepted array is required and cannot be empty for custom services',
            path:['eventsAccepted']
        }
    )
});
export const sourceIdParamSchema = z.object({
    params:z.object({
        sourceId: z.string().min(1, 'Source ID parameter is required')
    })
});