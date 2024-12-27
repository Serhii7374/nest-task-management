import { TaskStatus } from '../tasks-enum';
import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
