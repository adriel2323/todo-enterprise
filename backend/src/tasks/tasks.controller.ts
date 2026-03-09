import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  NotFoundException,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { UpdateTaskStatusDto } from './dto/updateTaskStatus.dto';

@Controller('tasks')
//Declarar que todas las rutas de este controlador requieren autenticación JWT(error fantasma por valor default de NestJS)
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks with pagination',
    type: [Task],
  })
  getAllTasks(
    @Query() getTaskFilterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getAllTasks(getTaskFilterDto, user);
  }

  @Get('/deleted')
  @ApiOperation({ summary: 'Get all deleted tasks' })
  @ApiResponse({
    status: 200,
    description: 'List of deleted tasks',
    type: [Task],
  })
  getTasksDeleted(): Promise<Task[]> {
    return this.tasksService.getTasksDeleted();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'The found task', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    const task = this.tasksService.getTaskById(id, user);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task,
  })
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({
    status: 204,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  @ApiOperation({ summary: 'Update a task status by ID' })
  @ApiResponse({
    status: 200,
    description: 'The task status has been successfully updated.',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
