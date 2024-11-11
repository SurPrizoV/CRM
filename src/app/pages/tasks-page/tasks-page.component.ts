import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Task } from '../../shared/interfaces';
import { TasksService } from '../../shared/services/tasks.service';
import { Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SearchService } from '../../shared/services/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../../shared/components/select/select.component';
import { TaskComponent } from '../../shared/components/task/task.component';
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { FilterTasksPipe } from '../../shared/pipes/option-filter.pipe';
import { CalendarComponent } from '../../shared/SVG/calendar/calendar.component';
import { CardComponent } from '../../shared/SVG/card-component/card.component';
import { FlagComponent } from '../../shared/SVG/flag/flag.component';
import { PersonComponent } from '../../shared/SVG/person/person.component';
import { TaskPageComponent } from '../task-page/task-page.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TaskComponent,
    TaskPageComponent,
    SelectComponent,
    FlagComponent,
    CalendarComponent,
    PersonComponent,
    CardComponent,
    FilterPipe,
    FilterTasksPipe,
  ],
  templateUrl: './tasks-page.component.html',
})
export class TasksPageComponent implements OnInit {
  searchText: string = '';
  selectedFilter: string = 'Все задачи';
  tasks$!: Observable<Task[]>;
  tSub!: Subscription;

  constructor(
    private router: Router,
    private taskService: TasksService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.taskService.fetchTasks();
    this.tasks$ = this.taskService.tasks$.pipe(catchError(() => of([])));

    this.searchService.search$.subscribe((text) => {
      this.searchText = text;
    });
  }

  onFilterChange(filter: string) {
    this.selectedFilter = filter;
  }

  onNavigate(taskId: string) {
    this.router.navigate([`tasks/task/${taskId}`]);
  }

  onRemove(taskId: string) {
    this.taskService.removeTask(taskId);
  }
}
