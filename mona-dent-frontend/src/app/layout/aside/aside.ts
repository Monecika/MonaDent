import { Component, OnInit, computed, inject, input, output } from '@angular/core';
import {
  LucideBuildingComplex,
  LucideCalendarDays,
  LucideIcon,
  LucideLayoutDashboard,
  LucideShieldCheck,
  LucideSettings,
  LucideUsersRound,
} from '@lucide/angular';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserRole } from '../../core/models/User';
import { UserStore } from '../../core/stores/user-store';
import { TranslatePipe } from '../../core/pipes/translate-pipe';

interface Page {
  icon: LucideIcon;
  title: string;
  route: string;
  roles?: UserRole[];
}

interface AsideBar {
  section: string;
  pages: Page[];
}

@Component({
  selector: 'app-aside',
  imports: [NgComponentOutlet, RouterLinkActive, RouterLink, TranslatePipe],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
})
export class Aside implements OnInit {
  readonly mobileOpen = input(false);
  readonly navigationSelected = output<void>();
  private readonly userStore = inject(UserStore);
  readonly role = computed<UserRole | null>(() => this.userStore.user()?.role ?? null);

  readonly asideBar: AsideBar[] = [
    {
      section: 'WORKSPACE',
      pages: [
        {
          icon: LucideLayoutDashboard,
          title: 'Dashboard',
          route: '/',
        },
        {
          icon: LucideCalendarDays,
          title: 'Appointments',
          route: '/appointments',
        },
        {
          icon: LucideUsersRound,
          title: 'Patients',
          route: '/patients',
        },
      ],
    },
    {
      section: 'ACCOUNT',
      pages: [
        {
          icon: LucideSettings,
          title: 'Account Settings',
          route: '/account',
        },
        {
          icon: LucideShieldCheck,
          title: 'User Management',
          route: '/users',
          roles: ['ADMIN', 'MANAGER'],
        },
        {
          icon: LucideBuildingComplex,
          title: 'Branch Management',
          route: '/branches',
          roles: ['ADMIN'],
        },
        {
          icon: LucideShieldCheck,
          title: 'IP allowlist',
          route: '/ip-addresses',
          roles: ['ADMIN'],
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.userStore.loadUser();
  }

  canViewPage(page: Page): boolean {
    const role = this.role();
    return !page.roles || (role !== null && page.roles.includes(role));
  }
}
