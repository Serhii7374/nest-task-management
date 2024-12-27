import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  //
  // getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //
  //   let tasks = this.getAllTasks();
  //
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       return task.title.includes(search) || task.description.includes(search);
  //     });
  //   }
  //
  //   return tasks;
  // }
  //
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: {
        id: id,
        user: user,
      },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  // getTaskById(id: string): Task {
  //   const foundedTask = this.tasks.find((task) => task.id === id);
  //   if (!foundedTask) {
  //     throw new NotFoundException();
  //   }
  //   return foundedTask;
  // }
  //
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //
  //   this.tasks.push(task);
  //   return task;
  // }
  //

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({
      id: id,
      user: user,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  // deleteTask(id: string): Task[] {
  //   const foundedTask = this.getTaskById(id);
  //
  //   const taskIndex = this.tasks.findIndex((task) => task.id === foundedTask.id);
  //   if (taskIndex !== -1) {
  //     this.tasks.splice(taskIndex, 1);
  //   }
  //   return this.tasks;
  // }
  //
  async updateStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  // updateStatus(id: string, status: TaskStatus): Task {
  //   // const taskIndex = this.tasks.findIndex((task) => task.id === id);
  //   // if (taskIndex !== -1) {
  //   //   this.tasks[taskIndex].status = status;
  //   // }
  //   // return this.tasks[taskIndex];
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
