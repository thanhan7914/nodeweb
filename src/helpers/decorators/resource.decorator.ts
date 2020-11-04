import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { ResourceInterceptor } from 'src/core/resource/resource.interceptor';

export const Resource = (resourceType) => applyDecorators(
    UseInterceptors(new ResourceInterceptor(resourceType)),
);
