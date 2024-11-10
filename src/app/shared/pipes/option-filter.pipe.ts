import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interfaces';

@Pipe({
  standalone: true,
  name: 'filterTasks',
})
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: Task[], selectedFilter: string): Task[] {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    if (!tasks) return [];

    switch (selectedFilter) {
      case 'Сегодня':
        return tasks.filter((task) =>
          this.isSameDay(new Date(task.date), today)
        );
      case 'Завтра':
        return tasks.filter((task) =>
          this.isSameDay(new Date(task.date), tomorrow)
        );
      case 'Неделя':
        return tasks.filter(
          (task) =>
            new Date(task.date) >= today && new Date(task.date) <= nextWeek
        );
      case 'Все задачи':
        return tasks;
      default:
        return tasks;
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
