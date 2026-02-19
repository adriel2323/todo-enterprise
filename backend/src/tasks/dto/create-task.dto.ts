import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
    @ApiProperty({
        description: 'The title of the task',
        example:'Finish the project',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'The description of the task',
        example:'Finish the project by the end of the week',
    })
    @IsOptional()
    @IsString()
    description?: string;
}