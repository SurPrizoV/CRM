import { Component } from '@angular/core';
import { AvatarModalComponent } from '../../components/avatar-modal/avatar-modal.component';
import { SelectComponent } from '../../components/select/select.component';
import { ArrowDownComponent } from '../../SVG/arrow-down-component/arrow.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Task } from '../../interfaces';
import { TasksService } from '../../services/tasks.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    RouterOutlet,
    ArrowDownComponent,
    SelectComponent,
    AvatarModalComponent,
  ],
  providers: [TasksService],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  searchText: string = '';
  tasks$!: Observable<Task[]>;

  constructor(
    private tasksService: TasksService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.tasksService.fetchTasks()
    this.tasks$ = this.tasksService.tasks$;
  }

  updateSearchText() {
    this.searchService.setSearchText(this.searchText);
  }
}
