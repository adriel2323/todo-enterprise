import { IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetTaskFilterDto {

    @ApiPropertyOptional({
        description: 'The number of tasks to return',
        example: 10,
    })
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @ApiPropertyOptional({
        description: 'The page number to return',
        example: 1,
    })
    @IsInt()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    page?: number;
}