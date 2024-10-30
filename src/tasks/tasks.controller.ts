import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
    Res,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get('')
    async listTasks() {
        return this.tasksService.listTasks();
    }

    @Get('/:id')
    async getTask(@Param('id') id: string, @Req() req, @Res() res) {
        try {
            const task = await this.tasksService.getTask(id);

            if (task.owner.id !== req.user.id) {
                // Verificamos la propiedad de la tarea
                throw new HttpException(
                    `Acceso denegado: Usuario ${req.user.id} intentando acceder a tarea de ${task.owner.id}`,
                    HttpStatus.FORBIDDEN,
                ); // Error 403 detallado
            }

            return res.json(task);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al obtener tarea con ID ${id}`,
                HttpStatus.NOT_FOUND,
            ); // Error 404 detallado
        }
    }

    @Post('/edit')
    async editTask(@Body() body, @Req() req, @Res() res) {
        try {
            const task = await this.tasksService.getTask(body.id);

            if (task.owner.id !== req.user.id) {
                // Verificamos la propiedad de la tarea antes de permitir la edición
                throw new HttpException(
                    `Acceso denegado: Usuario ${req.user.id} intentando editar tarea de ${task.owner.id}`,
                    HttpStatus.FORBIDDEN,
                ); // Error 403 detallado
            }

            const editedTask = await this.tasksService.editTask(body); // Edita la tarea
            return res.json(editedTask); // Devuelve la tarea editada
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                `Error al editar tarea con ID ${body.id}`,
                HttpStatus.BAD_REQUEST,
            ); // Error 400 detallado
        }
    }
}
