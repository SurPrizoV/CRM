import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { TickComponent } from '../../SVG/tick/tick.component';
import { ToggleService } from '../../services/toggle.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Manager } from '../../interfaces';
import { ManagersService } from '../../services/managers.service';

@Component({
  selector: 'app-avatar-modal',
  standalone: true,
  imports: [CommonModule, TickComponent],
  providers: [ToggleService],
  templateUrl: './avatar-modal.component.html',
  styleUrl: './avatar-modal.component.scss',
})
export class AvatarModalComponent implements OnInit, OnDestroy {
  managers: Manager[] = [];
  currentUser: Manager | null = null;

  constructor(
    private toggleService: ToggleService,
    private eRef: ElementRef,
    private router: Router,
    private authService: AuthService,
    private managerService: ManagersService
  ) {}

  get isOpen() {
    return this.toggleService.isOpen;
  }

  ngOnInit() {
    this.toggleService.initialize(this.eRef);
    this.managerService.fetchManagers();
    this.managerService.managers$.subscribe((managers) => {
      this.managers = managers;
    });
    this.managerService.fetchCurrentUser();
    this.managerService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
  }

  toggleModalOpen() {
    this.toggleService.toggleModalOpen();
  }

  logout() {
    this.router.navigate(['/login']);
    this.authService.logout();
    this.toggleService.isOpen = false;
  }

  logup() {
    this.router.navigate(['/logup']);
    this.authService.logout();
    this.toggleService.isOpen = false;
  }

  ngOnDestroy() {
    this.toggleService.destroy(this.eRef);
  }
}
