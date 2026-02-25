import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

// 1. Creamos un mock (una simulación) del Repo de Task
// Esto es como crear un "trozo" de Repo que solo responde a las funciones que necesitamos para nuestros tests

const mockQueryBuilder = {
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn(), // Le sacamos el mockResolvedValue fijo
};

const mockTaskRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  getAllTask: jest.fn(),
  findOneBy: jest.fn(),
  softDelete: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder), // Cuando se llame a createQueryBuilder, devuelve nuestro mockQueryBuilder
};

describe('TasksService', () => {
  let service: TasksService;
  let repository;
  beforeEach(async () => {
    // 2. Configuramos el Módulo de Testing (Igual que un Module real, pero aislado)
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task), // Cuando alguien pida el Repo de Task...
          useValue: mockTaskRepository, //... le damos un mock (una simulación) de ese Repo
        },
      ],
    }).compile();
    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });
  describe('getTaskById', () => {
    it('debe lanzar NotFoundException si la tarea no existe', async () => {
      // 1. ARRANGE
      const taskId = 'non-existent-id';
      repository.findOneBy.mockResolvedValue(null); // Simulamos que no encuentra la tarea

      // 2. ACT & ASSERT
      await expect(service.getTaskById(taskId)).rejects.toThrow(
        `Task with ID "${taskId}" not found`,
      );
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
      repository
        .createQueryBuilder(getTaskFilterDto)
        .getMany.mockResolvedValue(result); // Simulamos que devuelve el resultado esperado

      // 2. ACT
      const tasks = await service.getAllTasks(getTaskFilterDto);

      // 3. ASSERT
      expect(repository.createQueryBuilder).toHaveBeenCalledWith(
        getTaskFilterDto,
      ); // ¿Llamó a find con el filtro correcto?

      //(page && limit ? (page - 1) * limit : 0)
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0); // ¿Llamó a skip con el valor correcto?
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(3); // ¿Llamó a take con el valor correcto?
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
      const savedTask = { id: 'some-uuid-string', ...createTaskDto };
      // Mockeamos el comportamiento del repo para crear y guardar
      repository.create.mockReturnValue(savedTask); // Cuando se llame a create, devuelve savedTask
      repository.save.mockResolvedValue(savedTask); // Cuando se llame a save, devuelve savedTask

      // 2. ACT
      const result = await service.createTask(createTaskDto);

      // 3. ASSERT
      expect(repository.create).toHaveBeenCalledWith(createTaskDto); // ¿Llamó a create con el DTO correcto?
      expect(repository.save).toHaveBeenCalledWith(savedTask); // ¿Llamó a save con el resultado de create?
      expect(result).toEqual(savedTask); // ¿Devolvió lo que save devolvió?
    });
  });

  describe('deleteTask', () => {
    it('must throw NotFoundException if task to delete does not exist', async () => {
      //1.ARRANGE
      const taskId = 'non-existent-id';
      repository.softDelete.mockResolvedValue({ affected: 0 });

      //2.ACT & ASSERT
      await expect(service.deleteTask(taskId)).rejects.toThrow(
        `Task with ID "${taskId}" not found`,
      );
      expect(repository.softDelete).toHaveBeenCalledWith(taskId);
    });

    it('must delete a task', async () => {
      //1.ARRANGE
      const taskId = 'some-uuid-string';
      repository.softDelete.mockResolvedValue({ affected: 1 });

      //2.ACT
      const result = await service.deleteTask(taskId);

      //3.ASSERT
      expect(repository.softDelete).toHaveBeenCalledWith(taskId);
      expect(result).toBeUndefined();
    });
  });

  // 3. Ahora probamos el Servicio en Isolación (sin dependencias externas)
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
