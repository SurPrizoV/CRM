import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CrossComponent } from '../../shared/SVG/cross/cross.component';
import { FlagComponent } from '../../shared/SVG/flag/flag.component';
import { CalendarComponent } from '../../shared/SVG/calendar/calendar.component';
import { PersonComponent } from '../../shared/SVG/person/person.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToggleService } from '../../shared/services/toggle.service';
import { ArrowDownComponent } from '../../shared/SVG/arrow-down-component/arrow.component';
import { TasksService } from '../../shared/services/tasks.service';
import { Manager, Task } from '../../shared/interfaces';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ManagersService } from '../../shared/services/managers.service';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CrossComponent,
    FlagComponent,
    CalendarComponent,
    PersonComponent,
    ArrowDownComponent,
  ],
  providers: [ToggleService],
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss'],
})
export class TaskPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  taskCreator: string | null = null;
  taskCreatorImg: string | null = null;
  date: Date = new Date();
  taskId: string | null = null;
  managers: Manager[] = [];
  currentUser: Manager | null = null;

  constructor(
    private eRef: ElementRef,
    private router: Router,
    private toggleService: ToggleService,
    private taskService: TasksService,
    private route: ActivatedRoute,
    private managerService: ManagersService
  ) {}

  ngOnInit() {
    this.toggleService.initialize(this.eRef, () => {
      this.closeModal();
    });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      subtitle: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
      responsible: new FormControl('', Validators.required),
    });

    this.form.get('date')?.valueChanges.subscribe((value: string | Date) => {
      if (value instanceof Date) {
        const formattedDate = this.formatDate(value);
        this.form.get('date')?.setValue(formattedDate, { emitEvent: false });
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.taskService.getTaskById(this.taskId).subscribe((task) => {
          if (task) {
            this.form.patchValue(task);
            this.taskCreator = task.created!;
            this.taskCreatorImg = task.img;
            this.form.get('responsible')?.setValue(task.responsible);
          }
        });
      }
    });

    this.managerService.fetchManagers();
    this.managerService.managers$.subscribe((managers) => {
      this.managers = managers;
    });

    this.managerService.fetchCurrentUser();
    this.managerService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
      if (!this.taskId) {
        this.taskCreator = `${currentUser?.name} ${currentUser?.surname}`;
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.form.valid) {
      const formData: Task = {
        ...this.form.value,
        created:
          this.taskCreator ||
          `${this.currentUser?.name} ${this.currentUser?.surname}`,
        createdTime: this.taskId ? undefined : new Date(),
        completed: false,
        img: this.taskCreatorImg || this.currentUser?.img || '',
      };

      if (this.taskId) {
        const updatedTask = { ...formData, id: this.taskId };
        this.taskService.updateTask(updatedTask);
      } else {
        this.taskService.addTask(formData);
      }
      this.closeModal();
    }
  }

  closeModal() {
    this.router.navigate(['/tasks']);
  }

  ngOnDestroy() {
    this.toggleService.destroy(this.eRef);
  }
}
