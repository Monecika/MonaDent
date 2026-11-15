import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { LucideBuildingComplex, LucideChevronDown } from '@lucide/angular';
import { Loader } from '../../loader/loader';
import { BranchStore } from '../../../core/stores/branch-store';
import { Branch } from '../../../core/models/Branch';
import { TranslatePipe } from '../../../core/pipes/translate-pipe';

@Component({
  selector: 'app-custom-select',
  imports: [LucideBuildingComplex, LucideChevronDown, Loader, TranslatePipe],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.css',
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(document:keydown.escape)': 'isOpen = false',
  },
})
export class CustomSelect implements OnInit {
  readonly branchStore = inject(BranchStore);

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  isOpen = false;

  ngOnInit(): void {
    this.branchStore.loadBranches();
  }

  selectSubsidiary(branch: Branch): void {
    this.branchStore.selectBranch(branch);
    this.isOpen = false;
  }

  openSubsidiary(): void {
    this.isOpen = !this.isOpen;
  }

  closeOnOutsideClick(event: MouseEvent): void {
    const target = event.target;

    if (this.isOpen && target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }
}
