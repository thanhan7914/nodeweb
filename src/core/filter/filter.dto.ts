import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export abstract class FilterDto {
    @ApiProperty({
        description: 'order',
        example: 'createdAt',
    })
    @IsOptional()
    @IsString()
    order?: string;

    @ApiProperty({
        description: 'with',
        example: 'alarms',
    })
    @IsOptional()
    @IsString()
    with?: string;
}
