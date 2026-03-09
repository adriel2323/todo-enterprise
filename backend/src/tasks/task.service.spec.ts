/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

describe('TasksService', () => {
  const mockQueryBuilder = {
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    where: jest.fn().mockReturnThis(),
  };

  const mockUser = {
    id: 'user-id-123',
    email: 'test@example.com',
    password: 'someHashedPassword',
    tasks: [],
  };

  const mockTaskRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    getAllTask: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  });

  let service: TasksService;
  let repository;
  beforeEach(async () => {
    // 2. Configuramos el Módulo de Testing (Igual que un Module real, pero aislado)
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task), // Cuando alguien pida el Repo de Task...
          useFactory: mockTaskRepository, //... le damos un mock (una simulación) de ese Repo
        },
      ],
    }).compile();
    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });
  describe('getTaskById', () => {
    it('debe retornar una tarea si existe y le pertenece al usuario', async () => {
      // 1. ARRANGE
      const mockTask = {
        id: 'some-id',
        title: 'Test',
        description: 'Test desc',
      };
      const taskId = 'non-existent-id';

      repository.findOneBy.mockResolvedValue(mockTask);

      // 2. ACT & ASSERT
      const result = await service.getTaskById(taskId, mockUser);

      //3 ASSERT
      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: taskId,
        user: { id: mockUser.id },
      });
      expect(result).toEqual(mockTask); // ¿Devolvió lo que el repo devolvió?
    });
  });

  describe('getAllTasks', () => {
    it('debe retornar un array de tareas', async () => {
      // 1. ARRANGE
      const getTaskFilterDto = { limit: 3, page: 1 };
      const result = [
        { id: '1', title: 'Task 1', description: 'Description 1' },
        { id: '2', title: 'Task 2', description: 'Description 2' },
        { id: '3', title: 'Task 2', description: 'Description 2' },
      ];

      // Le enseñamos al mock a devolver esa promesa resuelta
      mockQueryBuilder.getMany.mockResolvedValue(result); // Simulamos que devuelve el resultado esperado

      // 2. ACT
      const tasks = await service.getAllTasks(getTaskFilterDto, mockUser);

      // 3. ASSERT
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('task');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'task.userId = :userId',
        { userId: mockUser.id },
      );
      //(page && limit ? (page - 1) * limit : 0)
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(3);

      expect(tasks).toEqual(result); // ¿Devolvió lo que el repo devolvió?
    });
  });

  describe('createTask', () => {
    it('debe crear y guardar una nueva tarea', async () => {
      // 1. ARRANGE
      const createTaskDto = {
        title: 'New Task',
        description: 'Task description',
      };

      const savedTask = {
        id: 'some-uuid-string',
        ...createTaskDto,
        user: mockUser,
      };
      // Mockeamos el comportamiento del repo para crear y guardar
      repository.create.mockReturnValue(savedTask);
      repository.save.mockResolvedValue(savedTask);

      // 2. ACT
      const result = await service.createTask(createTaskDto, mockUser);

      // 3. ASSERT
      expect(repository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        user: mockUser,
      }); // ¿Llamó a create con el DTO correcto?
      expect(repository.save).toHaveBeenCalledWith(savedTask);
      expect(result).toEqual(savedTask);
    });
  });

  describe('deleteTask', () => {
    const taskId = 'non-existent-id';
    it('must call getTaskById to check if the task exists', async () => {
      //1. ARRANGE
      repository.findOneBy.mockResolvedValue({
        id: taskId,
        tittle: 'Test Task',
      });
      repository.softDelete.mockResolvedValue({ affected: 1 });

      //2. ACT
      const result = await service.deleteTask(taskId, mockUser);

      //3. ASSERT
      expect(repository.softDelete).toHaveBeenCalledWith(taskId);
      expect(result).toBeUndefined();
    });

    it('must throw NotFoundException if task to delete does not exist', async () => {
      //1.ARRANGE
      repository.findOneBy.mockResolvedValue(null); // Simulamos que no encuentra la tarea

      //2.ACT & ASSERT
      await expect(service.deleteTask(taskId, mockUser)).rejects.toThrow(
        `Task with ID "${taskId}" not found`,
      );
      expect(repository.softDelete).not.toHaveBeenCalled(); // No debería intentar eliminar si no encuentra la tarea
    });
  });
});
