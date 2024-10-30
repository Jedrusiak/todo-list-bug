# Prueba Técnica - Gestión de Tareas

## Introducción
**Objetivo:** Implementar medidas de seguridad en un proyecto de gestión de tareas.

**Tareas realizadas:**
1. Protección de las tareas por usuario.
2. Restringir la edición de tareas.
3. Implementar y verificar autenticación con JWT.
4. Mejorar el manejo de errores.
5. Mejorar logs y mensajes de error.
6. Auditoría general de seguridad.

## Desglose de Tareas

### 1. Protección de las tareas por usuario
Implementé una verificación para asegurar que solo el propietario de una tarea pueda verla.
```typescript
@Get('/:id')
async getTask(@Param('id') id: string, @Req() req, @Res() res) {
    const task = await this.tasksService.getTask(id);
    if (task.owner.id !== req.user.id) {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    return res.json(task);
}
```
### 2. Restringir la edición de tareas
Apliqué una verificación similar para asegurar que solo el propietario pueda editar sus propias tareas.
```typescript
@Post('/edit')
async editTask(@Body() body, @Req() req, @Res() res) {
    const task = await this.tasksService.getTask(body.id);
    if (task.owner.id !== req.user.id) {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    const editedTask = await this.tasksService.editTask(body);
    return res.json(editedTask);

```
### 3. Autenticación con JWT
Verifiqué que todas las rutas sensibles están protegidas con AuthGuard
```typescript
@UseGuards(AuthGuard)
```
### 4. Mejorar el manejo de errores
Añadí manejo de errores detallados
```typescript
throw new HttpException('Acceso denegado', HttpStatus.FORBIDDEN);
```
### 5. Mejorar logs y mensajes de error
Configuré morgan para logs detallados.
```typescript
import * as morgan from 'morgan';
app.use(morgan('combined'));
```
### 6. Auditoría general de seguridad
Ejecuté eslint para verificar la calidad del código y realicé una auditoría de seguridad.
```bash
npx eslint .
npm audit
```