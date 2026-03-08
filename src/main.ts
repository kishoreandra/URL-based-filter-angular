import { Component, signal, computed, effect } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, RouterModule, provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="container">
      <h1>Filterable List</h1>

      <div class="search-box">
        <div class="search-wrapper">
          <input
            type="text"
            [(ngModel)]="searchText"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search items..."
            class="search-input"
          />
          @if (searchText()) {
            <button
              (click)="clearSearch()"
              class="clear-btn"
              title="Clear search"
            >
              ✕
            </button>
          }
        </div>
      </div>

      <div class="list">
        @for (item of filteredItems(); track item) {
          <div class="list-item">{{ item }}</div>
        } @empty {
          <div class="empty-state">No items found</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: #1a1a1a;
    }

    .search-box {
      margin-bottom: 1.5rem;
    }

    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      padding-right: 2.5rem;
      font-size: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #2563eb;
    }

    .clear-btn {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #9ca3af;
      padding: 0.25rem 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }

    .clear-btn:hover {
      color: #374151;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .list-item {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 3px solid #2563eb;
    }

    .empty-state {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
    }
  `]
})
export class App {
  searchText = signal('');

  items = signal([
    'Apple',
    'Banana',
    'Cherry',
    'Date',
    'Elderberry',
    'Fig',
    'Grape',
    'Honeydew',
    'Kiwi',
    'Lemon',
    'Mango',
    'Orange',
    'Papaya',
    'Quince',
    'Raspberry'
  ]);

  filteredItems = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    if (!search) {
      return this.items();
    }
    return this.items().filter(item =>
      item.toLowerCase().includes(search)
    );
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    effect(() => {
      this.route.queryParams.subscribe(params => {
        const searchParam = params['search'] || '';
        this.searchText.set(searchParam);
      });
    });
  }

  onSearchChange(value: string) {
    this.searchText.set(value);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: value || null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  clearSearch() {
    this.searchText.set('');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: '', component: App }
    ])
  ]
});
