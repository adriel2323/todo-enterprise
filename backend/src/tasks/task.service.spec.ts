import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

// 1. Creamos un mock (una simulación) del Repo de Task
// Esto es como crear un "trozo" de Repo que solo responde a las funciones que necesitamos para nuestros tests
const mockTaskRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  getAllTask:jest.fn()
};

describe('TasksService', () => {
  let service: TasksService;
  let repository;
  beforeEach(async ()=> {
    // 2. Configuramos el Módulo de Testing (Igual que un Module real, pero aislado)
    const module: TestingModule= await Test.createTestingModule({
        providers:[
            TasksService,
            {
                provide: getRepositoryToken(Task),// Cuando alguien pida el Repo de Task...
                useValue: mockTaskRepository, //... le damos un mock (una simulación) de ese Repo
            },
        ]
    }).compile();
    service=module.get<TasksService>(TasksService);
    repository=module.get<Repository<Task>>(getRepositoryToken(Task));
  })

  describe('getAllTasks', () => {
    it('debe retornar un array de tareas', async () => {
      // 1. ARRANGE
      const result = [{ title: 'Test Task', status: 'OPEN' }]; 
      // Le enseñamos al mock a devolver esa promesa resuelta
      repository.find.mockResolvedValue(result);

      // 2. ACT
      const tasks = await service.getAllTasks();

      // 3. ASSERT
      expect(tasks).toEqual(result); // ¿Devolvió lo que el repo le dio?
      expect(repository.find).toHaveBeenCalled(); // ¿Llamó al repo?
    });
  });

  // 3. Ahora probamos el Servicio en Isolación (sin dependencias externas)
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

