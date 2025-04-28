import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {PageSettings} from '../../../../Data/Models/Page/page-settings';
import {PagedResponse} from '../../../../Data/Models/Page/paged-response';

@Component({template: ``})
export abstract class PaginationBaseComponent<TEntity> implements OnInit, OnChanges, AfterViewInit  {
  public entities: TEntity[] = []
  public loadingThreshold = 40;
  protected _loadingContainerId?: string
  protected _loadingContainer!: HTMLElement;

  private _pageSettings: PageSettings = {
    pageSize: 1,
    pageNumber: 1
  };

  @Input({required: true}) set pageSize(pageSize: number) {
    this._pageSettings.pageSize = pageSize
  }

  @Input({required: true}) set entitySource(entitySource: (pageSettings: PageSettings) => Promise<PagedResponse<TEntity>>) {
    this._entitySource = entitySource
  }

  protected _entitySource!: (pageSettings: PageSettings) => Promise<PagedResponse<TEntity>>
  private _isLoading: boolean = false
  private _isEnded: boolean = false

  protected constructor() {
  }

  async ngOnInit() {
    await this.loadEntities()
  }

  //if user change chat source
  async ngOnChanges() {
    this.entities = []
    this._pageSettings.pageNumber = 1
    this._isLoading = false
    this._isEnded = false
    await this.loadEntities()
  }

  async ngAfterViewInit() {
    if (!this._loadingContainerId) {
      console.warn(`No container id provided`);
      return;
    }

    const container = document.getElementById(this._loadingContainerId);

    if (!container) {
      console.warn(`Container not found with id ${this._loadingContainerId}`);
      return;
    }

    this._loadingContainer = container;

    container.addEventListener('scroll', async () => {
      if (this.checkLoadingNecessary()) {
        await this.loadEntities();
      }
    });
  }

  private async loadEntities() {
    if (this._isLoading || this._isEnded) {
      return;
    }

    this._isLoading = true;

    try {
      const entities = await this._entitySource(this._pageSettings);
      this.onLoadEntities(entities.items);
      this.updateIsEntitiesEnded(entities.items);
      this._pageSettings.pageNumber += 1;
    } catch (err) {
      console.error(err);
    } finally {
      this._isLoading = false;
    }
  }

  protected onLoadEntities(entities: TEntity[]){
    if (!Array.isArray(entities)) {
      console.warn('Received non-array entities:', entities);
      entities = [];
    }

    this.entities = this.entities.concat(entities);
  }

  private updateIsEntitiesEnded(entities: TEntity[]) {
    this._isEnded = entities.length < this._pageSettings.pageSize
  }

  public isLoading(): boolean {
    return this._isLoading
  }

  public isEnded(): boolean {
    return this._isEnded
  }

  private checkLoadingNecessary(): boolean {
    const containerHeight = this._loadingContainer.scrollHeight;
    const scrollPosition = Math.abs(this._loadingContainer.scrollTop);
    const visibleHeight = this._loadingContainer.clientHeight;

    return scrollPosition + visibleHeight + this.loadingThreshold >= containerHeight;
  }
}
