import {z} from 'zod';
// validate GET /api/events/source/:sourceId
export const sourceIdParamSchema = z.object({
    params:z.object({
        sourceId:z.string().min(1, 'Source ID is required')
    })
});

// validate GET /api/events/:eventId
export const eventIdParamSchema = z.object({
    params:z.object({
        eventId:z.string().min(1, 'Event ID is required')
    })
});

// validate GET /api/events/filterEvents
export const filterEventsSchema = z.object({
    query:z.object({
        eventType:z.string().optional(),
        status:z.enum(['received', 'processed', 'failed'], {
            errorMap: ()=>({message:'Status must be received, processed, or failed'})
        }).optional(),
        source:z.string().optional()
    })
});
