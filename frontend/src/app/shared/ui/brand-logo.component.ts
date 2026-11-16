import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  template: `
    @if (layout === 'inline') {
      <!-- Variante Horizontale Inline (REVGET ///) -->
      <div [class]="'flex items-center gap-2 select-none ' + className">
        <span class="text-neutral-900 dark:text-white font-black text-2xl tracking-tighter">
          REV<span class="text-amber-500">GET</span>
        </span>
        <svg class="h-4 w-auto text-amber-500 shrink-0" viewBox="0 0 250 85" fill="currentColor">
          <rect width="78.9" height="18.5" x="0" y="55" rx="9.2" transform="rotate(-43 0 55)" />
          <rect width="78.9" height="18.5" x="50" y="55" rx="9.2" transform="rotate(-43 50 55)" />
          <rect width="78.9" height="18.5" x="100" y="55" rx="9.2" transform="rotate(-43 100 55)" />
          <rect width="28.5" height="18.5" x="150" y="55" rx="9.2" transform="rotate(-43 150 55)" />
          <path d="M230 28c7 2.6 6.9 12.6-.2 15l-19 6.5c-5.2 1.8-10.7-2.1-10.6-7.7l.2-13.5c.1-5.5 5.6-9.3 10.8-7.4l18.8 7.1Z" />
        </svg>
      </div>
    } @else {
      <!-- Variante Stackée Référence ScrewFast img.png (Rev sur Get ///) -->
      <div [class]="'flex flex-col select-none leading-none ' + className">
        <!-- Ligne 1 (Haut) : Rev décalé au-dessus de Get -->
        <div class="flex items-center pl-2.5 pb-0.5">
          <span class="text-neutral-900 dark:text-white font-black text-2xl tracking-tighter leading-none">
            {{ caps ? 'REV' : 'Rev' }}
          </span>
        </div>
        <!-- Ligne 2 (Bas) : Get aligné à gauche + barres ScrewFast calées à droite -->
        <div class="flex items-center gap-1.5 leading-none">
          <span class="text-neutral-900 dark:text-white font-black text-2xl tracking-tighter leading-none">
            {{ caps ? 'GET' : 'Get' }}
          </span>
          <!-- 3 barres obliques + arrêt + flèche ScrewFast -->
          <svg class="h-4 w-auto text-amber-500 shrink-0" viewBox="0 0 250 85" fill="currentColor">
            <rect width="78.9" height="18.5" x="0" y="55" rx="9.2" transform="rotate(-43 0 55)" />
            <rect width="78.9" height="18.5" x="50" y="55" rx="9.2" transform="rotate(-43 50 55)" />
            <rect width="78.9" height="18.5" x="100" y="55" rx="9.2" transform="rotate(-43 100 55)" />
            <rect width="28.5" height="18.5" x="150" y="55" rx="9.2" transform="rotate(-43 150 55)" />
            <path d="M230 28c7 2.6 6.9 12.6-.2 15l-19 6.5c-5.2 1.8-10.7-2.1-10.6-7.7l.2-13.5c.1-5.5 5.6-9.3 10.8-7.4l18.8 7.1Z" />
          </svg>
        </div>
      </div>
    }
  `
})
export class BrandLogoComponent {
  @Input() className = '';
  @Input() layout: 'stacked' | 'inline' = 'stacked';
  @Input() caps = false;
}
