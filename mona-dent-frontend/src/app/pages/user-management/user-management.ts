import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeader } from '../../components/page-header/page-header';
import { Button } from '../../components/custom-inputs/button/button';
import { LucidePencil, LucideUserRoundPlus } from '@lucide/angular';
import { Container } from '../../components/container/container';
import { UserForm } from './components/user-form/user-form';
import { UserService } from '../../core/services/user-service';
import { UserResponse } from '../../core/models/User';
import { finalize } from 'rxjs';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { HttpErrorService } from '../../core/services/http-error-service';

@Component({
  selector: 'app-user-management',
  imports: [PageHeader, Button, LucideUserRoundPlus, Container, LucidePencil, UserForm, TranslatePipe],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  private readonly userService = inject(UserService);
  private readonly httpErrorService = inject(HttpErrorService);

  isOpen = false;
  selectedUser: UserResponse | null = null;
  isLoading = signal<boolean>(true);
  errorMessage = signal('');
  users = signal<UserResponse[]>([]);

  ngOnInit() {
    this.userService
      .getAllUsers()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: async (users: UserResponse[]) => {
          this.errorMessage.set('');
          this.users.set(users);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set(
            this.httpErrorService.message(err, 'Could not load users. Please try again.'),
          );
        },
      });
  }

  getInitials(user: UserResponse): string {
    return `${user.name.charAt(0)}${user.surname.charAt(0)}`.toUpperCase();
  }

  closeUserPopup = () => {
    this.isOpen = false;
    this.selectedUser = null;
  };

  openUserPopup = () => {
    this.selectedUser = null;
    this.isOpen = true;
  };

  editUser(user: UserResponse): void {
    this.selectedUser = user;
    this.isOpen = true;
  }

  onUserSaved(): void {
    this.isOpen = false;
    this.selectedUser = null;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.errorMessage.set('');
        this.users.set(users);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set(
          this.httpErrorService.message(error, 'Could not load users. Please try again.'),
        );
      },
    });
  }
}
