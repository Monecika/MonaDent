import { Component, computed, ElementRef, inject, OnInit } from '@angular/core';
import { LucideChevronDown, LucideLogOut, LucideSettings } from '@lucide/angular';
import { Router, RouterLink } from '@angular/router';
import { Loader } from '../../components/loader/loader';
import { UserStore } from '../../core/stores/user-store';
import { BranchStore } from '../../core/stores/branch-store';
import { TranslatePipe } from '../../core/pipes/translate-pipe';

@Component({
  selector: 'app-user-dropdown',
  imports: [LucideChevronDown, RouterLink, LucideSettings, LucideLogOut, Loader, TranslatePipe],
  templateUrl: './user-dropdown.html',
  styleUrl: './user-dropdown.css',
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(document:keydown.escape)': 'isOpen = false',
  },
})
export class UserDropdown implements OnInit {
  private userStore = inject(UserStore);
  private branchStore = inject(BranchStore);
  private router = inject(Router);

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  readonly user = this.userStore.user;
  readonly isLoading = this.userStore.isLoading;

  readonly userInitials = computed(() => {
    const user = this.user();

    return user ? `${user.name.charAt(0)}${user.surname.charAt(0)}`.toUpperCase() : '';
  });

  readonly userFullName = computed(() => {
    const user = this.user();

    return user ? `${user.name} ${user.surname}`.trim() : '';
  });

  isOpen = false;

  ngOnInit(): void {
    this.userStore.loadUser();
  }

  openUser(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  closeOnOutsideClick(event: MouseEvent): void {
    const target = event.target;

    if (this.isOpen && target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }

  async signOut(): Promise<void> {
    this.closeMenu();
    localStorage.removeItem('userAccessToken');
    this.user.set(null);
    this.branchStore.reset();

    await this.router.navigate(['/login']);
  }
}
