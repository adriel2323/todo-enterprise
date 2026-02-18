import { Controller, Post, Get, Body, Param, NotFoundException, Delete} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get('/deleted')
    getTasksDeleted(): Promise<Task[]>{
        return this.tasksService.getTasksDeleted();
    }
    
    @Get('/:id')
    getTaskById(@Param('id') id: string): Promise<Task>{

        const task= this.tasksService.getTaskById(id);
        if(!task){
            throw new NotFoundException(`Task with ID "${id}" not found`);

        }
        return task;
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task>{
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): Promise<void>{
        return this.tasksService.deleteTask(id);
    }

    
}
