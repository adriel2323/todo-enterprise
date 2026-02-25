import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { TaskStatus } from './task.status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../auth/user.entity';

@Entity()
export class Task {
  @ApiProperty({
    description: 'The unique identifier of the task',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Buy groceries',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Milk, Bread, Eggs, and Butter',
  })
  @Column({
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'The status of the task',
    enum: TaskStatus,
    example: TaskStatus.OPEN,
    default: TaskStatus.OPEN,
  })
  @Column({
    type: 'text',
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'The date and time when the task was created',
    example: '2024-06-01T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the task was last updated',
    example: '2024-06-02T15:30:00Z',
  })
  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The date and time when the task was deleted (soft delete)',
    example: '2024-06-03T10:00:00Z',
  })
  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  user: User;

  //   @Column()
  //   userId: string;
}
