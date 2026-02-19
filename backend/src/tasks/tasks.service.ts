import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ){}

    async getTaskById(id: string): Promise<Task>{
        const task= await this.taskRepository.findOneBy({id});
        if(!task){
            throw new NotFoundException(`Task with ID "${id}" not found`);

        }
        return task;
    }

    async createTask(CreateTaskDto: CreateTaskDto): Promise<Task>{
        const {title,description} = CreateTaskDto;
        const task= this.taskRepository.create({
            title,
            description,
        })
        return await this.taskRepository.save(task);
    }

    async getAllTasks( getTaskFilter: GetTaskFilterDto ): Promise<Task[]>{

        const { limit, page } = getTaskFilter;
        const query = this.taskRepository.createQueryBuilder('task');
        if (page !== undefined) {
            query.skip(page && limit ? (page - 1) * limit : 0);
        } 
        if (limit) {
            query.take(limit);
        }else {
            query.take(10);
        }
        return await query.getMany();
        
        //return await this.taskRepository.find();
    }

    async deleteTask(id:string): Promise<void>{
        const result= await this.taskRepository.softDelete(id);
        if(result.affected===0){
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return undefined;
    }

    async getTasksDeleted(): Promise<Task[]>{
        return await this.taskRepository.find({
            withDeleted: true,
            where: {
                deletedAt: Not(IsNull()),
            },
        });
    }

}
