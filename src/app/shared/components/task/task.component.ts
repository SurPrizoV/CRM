import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardComponent } from '../../SVG/card-component/card.component';
import { FormsModule } from '@angular/forms';
import { Task } from '../../interfaces';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, FormatDatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() remove = new EventEmitter<string>();

  constructor(private tasksService: TasksService) {}

  onCheck(event: Event) {
    event.stopPropagation();
    this.tasksService.toggleTaskCompletion(this.task.id!, this.task.completed);
  }

  onRemove(event: Event) {
    event.stopPropagation();
    this.remove.emit(this.task.id);
  }
}
