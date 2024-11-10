import { Injectable } from '@angular/core';
import { Task } from '../interfaces';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchTasks() {
    this.http
      .get<{ [key: string]: Task }>(`${environment.fbDbUrl}/tasks.json`)
      .pipe(
        map((responseData) => {
          const tasksArray: Task[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              tasksArray.push({ ...responseData[key], id: key });
            }
          }
          return tasksArray;
        })
      )
      .subscribe((tasks) => {
        this.tasksSubject.next(tasks);
      });
  }

  addTask(task: Task) {
    this.http
      .post<{ name: string }>(`${environment.fbDbUrl}/tasks.json`, task)
      .subscribe({
        next: (response) => {
          const newTask = { ...task, id: response.name };
          this.tasksSubject.next([...this.tasksSubject.value, newTask]);
        },
      });
  }

  updateTask(updatedTask: Task) {
    this.http
      .put(`${environment.fbDbUrl}/tasks/${updatedTask.id}.json`, updatedTask)
      .subscribe({
        next: () => {
          const tasks = this.tasksSubject.value.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          );
          this.tasksSubject.next(tasks);
        },
      });
  }

  removeTask(id: string) {
    this.http.delete(`${environment.fbDbUrl}/tasks/${id}.json`).subscribe({
      next: () => {
        this.tasksSubject.next(
          this.tasksSubject.value.filter((task) => task.id !== id)
        );
      },
    });
  }

  getTaskById(id: string): Observable<Task | undefined> {
    return this.http.get<Task>(`${environment.fbDbUrl}/tasks/${id}.json`).pipe(
      map((task) => {
        return task ? { ...task, id } : undefined;
      })
    );
  }

  toggleTaskCompletion(id: string, currentCompleted: boolean) {
    const taskToUpdate = this.tasksSubject.value.find((task) => task.id === id);

    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, completed: !currentCompleted };

      this.http
        .put(`${environment.fbDbUrl}/tasks/${id}.json`, updatedTask)
        .subscribe({
          next: () => {
            const tasks = this.tasksSubject.value.map((task) =>
              task.id === id ? { ...task, completed: !currentCompleted } : task
            );
            this.tasksSubject.next(tasks);
          },
        });
    }
  }
}
