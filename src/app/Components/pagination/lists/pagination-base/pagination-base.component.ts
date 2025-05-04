import {
  AfterViewInit,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  Directive, ViewChild, ElementRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PageSettings } from '../../../../Data/Models/Page/page-settings';
import { PagedResponse } from '../../../../Data/Models/Page/paged-response';

@Directive()
export abstract class PaginationBaseComponent<TEntity> implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('listContainer') protected listContainer!: ElementRef;
  protected readonly _entities$ = new BehaviorSubject<TEntity[]>([]);
  public readonly entities$ = this._entities$.asObservable();

  public readonly isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly isEnded$ = new BehaviorSubject<boolean>(false);

  public loadingThreshold = 40;

  private _pageSettings: PageSettings = {
    pageSize: 1,
    pageNumber: 1,
  };

  @Input({ required: true }) set pageSize(pageSize: number) {
    this._pageSettings.pageSize = pageSize;
  }

  @Input({ required: true }) set entitySource(
    entitySource: (page: PageSettings) => Promise<PagedResponse<TEntity>>
  ) {
    this._entitySource = entitySource;
  }

  protected _entitySource!: (page: PageSettings) => Promise<PagedResponse<TEntity>>;

  protected constructor() {}

  ngOnInit() {
    this.loadEntities();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['entitySource']) {
      this._pageSettings.pageNumber = 1;
      this.isLoading$.next(false);
      this.isEnded$.next(false);
      this._entities$.next([]);
      await this.loadEntities();
    }
  }

  ngAfterViewInit(): void {
    if (!this.listContainer) {
      console.warn('No loading container provided.');
      return;
    }

    this.listContainer.nativeElement.addEventListener('scroll', async () => {
      if (this.checkLoadingNecessary()) {
        await this.loadEntities();
      }
    });
  }

  private async loadEntities(): Promise<void> {
    if (this.isLoading$.value || this.isEnded$.value) return;

    this.isLoading$.next(true);

    try {
      const response = await this._entitySource(this._pageSettings);
      this.onLoadEntities(response.items);
      this.updateIsEntitiesEnded(response.items);
      this._pageSettings.pageNumber += 1;
    } catch (error) {
      console.error('Failed to load entities:', error);
    } finally {
      this.isLoading$.next(false);
    }
  }

  protected onLoadEntities(entities: TEntity[]): void {
    const current = this._entities$.value;
    this._entities$.next([...current, ...entities]);
  }

  private updateIsEntitiesEnded(entities: TEntity[]): void {
    this.isEnded$.next(entities.length < this._pageSettings.pageSize);
  }

  private checkLoadingNecessary(): boolean {
    const containerHeight = this.listContainer.nativeElement.scrollHeight;
    const scrollPosition = Math.abs(this.listContainer.nativeElement.scrollTop);
    const visibleHeight = this.listContainer.nativeElement.clientHeight;

    return scrollPosition + visibleHeight + this.loadingThreshold >= containerHeight;
  }
}
