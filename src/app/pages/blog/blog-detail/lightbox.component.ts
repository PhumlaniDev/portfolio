import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit, input, output, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92)' }),
        animate(
          '220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({ opacity: 1, transform: 'scale(1)' }),
        ),
      ]),
    ]),
  ],
  template: `
    <div
      @fadeIn
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      (click)="close.emit()"
      (keydown.enter)="close.emit()"
      (keydown.space)="close.emit()"
      tabindex="0"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <!-- Close button -->
      <button
        class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center
               rounded-full bg-white/10 text-white backdrop-blur-md transition-all
               hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2
               focus:ring-white/50"
        (click)="close.emit()"
        aria-label="Close lightbox"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Caption -->
      @if (caption()) {
        <div
          class="absolute bottom-6 left-1/2 -translate-x-1/2
                    rounded-full bg-black/50 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm"
        >
          {{ caption() }}
        </div>
      }

      <!-- Image wrapper -->
      <div
        @scaleIn
        (click)="$event.stopPropagation()"
        (keydown)="$event.stopPropagation()"
        role="presentation"
      >
        @if (isLoading()) {
          <div class="flex h-32 w-32 items-center justify-center">
            <div
              class="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"
            ></div>
          </div>
        }
        <img
          [src]="url()"
          [alt]="caption() || 'Blog image'"
          [class.hidden]="isLoading()"
          class="max-h-[88vh] max-w-[92vw] rounded-lg object-contain shadow-2xl
                ring-1 ring-white/10"
          (load)="isLoading.set(false)"
        />
      </div>
    </div>
  `,
})
export class LightboxComponent implements OnInit {
  url = input.required<string>();
  caption = input<string>('');
  close = output<void>();

  isLoading = signal(true);

  ngOnInit() {
    // reset loading state whenever url changes
    this.isLoading.set(true);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
