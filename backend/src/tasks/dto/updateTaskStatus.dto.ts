import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task.status.enum';

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'The new status of the task',
    example: 'IN_PROGRESS',
  })
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
