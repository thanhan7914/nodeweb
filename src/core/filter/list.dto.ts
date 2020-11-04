import { FilterDto } from './filter.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListDto extends FilterDto {
    @IsOptional()
    @IsNumber()
    @Transform(value => Number(value))
    page: number = 1;

    @IsOptional()
    @IsNumber()
    @Transform(value => Number(value))
    limit: number = 20;
}
