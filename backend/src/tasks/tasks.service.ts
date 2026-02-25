import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../auth/user.entity';
// import { TaskStatus } from './task.status.enum';
// import { ApiProperty } from '@nestjs/swagger';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      user,
    });

    // Guardamos y retornamos la entidad completa.
    // TypeScript está feliz porque 'save' devuelve un 'Task' válido.
    return await this.taskRepository.save(task);
  }

  async getAllTasks(
    getTaskFilter: GetTaskFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { limit, page } = getTaskFilter;
    const query = this.taskRepository.createQueryBuilder('task');
    query.where('task.user.id = :userId', { userId: user.id });
    if (page !== undefined) {
      query.skip(page && limit ? (page - 1) * limit : 0);
    }
    if (limit) {
      query.take(limit);
    } else {
      query.take(10);
    }
    return await query.getMany();

    //return await this.taskRepository.find();
  }

  async deleteTask(id: string, user: User): Promise<void> {
    console.log('Deleting task with ID:', id, 'for user:', user.id);
    const task = await this.getTaskById(id, user);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    const result = await this.taskRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return undefined;
  }

  async getTasksDeleted(): Promise<Task[]> {
    return await this.taskRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
    });
  }
}
