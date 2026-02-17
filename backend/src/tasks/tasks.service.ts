import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ){}

    async createTask(CreateTaskDto: CreateTaskDto): Promise<Task>{
        const {title,description} = CreateTaskDto;
        const task= this.taskRepository.create({
            title,
            description,
        })
        return await this.taskRepository.save(task);
    }

    async getAllTask(): Promise<Task[]>{
        return await this.taskRepository.find();
    }

}
