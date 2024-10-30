import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async listTasks() {
        const tasks = await this.tasksRepository.find();

        return tasks;
    }

    async getTask(id: string) {
        const task = await this.tasksRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.owner', 'user') //he anadido esta linea que asegura que cargamos el propietario
            .where('task.id = :id', { id })
            .getOne();

        return task;
    }

    async editTask(body: any) {
        await this.tasksRepository.update(body.id, body);
        const editedTask = await this.getTask(body.id);

        return editedTask;
    }
}
