import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {fromEvent, Observable, tap} from "rxjs";
import {PageSettings} from '../../Models/page-settings';

@Component({template: ``})
export abstract class PaginationBaseComponent<TEntity> implements OnInit, OnChanges, AfterViewInit  {
  public Entities: TEntity[] = []
  public LoadingThreshold = 40;
  protected _loadingContainerId?: string
  protected _loadingContainer!: HTMLElement;

  private _pageSettings: PageSettings = {
    pageSize: 1,
    pageNumber: 1
  };

  @Input({required: true}) set PageSize(pageSize: number) {
    this._pageSettings.pageSize = pageSize
  }

  @Input({required: true}) set EntitySource(entitySource: (pageSettings: PageSettings) => Observable<TEntity[]>) {
    this._entitySource = entitySource
  }

  protected _entitySource!: (pageSettings: PageSettings) => Observable<TEntity[]>
  private _isLoading: boolean = false
  private _isEnded: boolean = false

  protected constructor() {
  }

  ngOnInit(): void {
    this.LoadEntities()
  }

  //if user change chat source
  ngOnChanges(): void {
    this.Entities = []
    this._pageSettings.pageNumber = 1
    this._isLoading = false
    this._isEnded = false
    this.LoadEntities()
  }

  ngAfterViewInit(): void {
    if(!this._loadingContainerId){
      console.warn(`No container id provided`)
      return
    }

    const container = document.getElementById(this._loadingContainerId)

    if(!container){
      console.warn(`Container not found with id ${this._loadingContainerId}`)
      return
    }

    this._loadingContainer = container

    fromEvent(container, 'scroll')
      .pipe(
        tap(() => {
          if(this.CheckLoadingNecessary()){
            this.LoadEntities()
          }
        })
      )
      .subscribe();
  }

  private LoadEntities(){
    if (this._isLoading || this._isEnded) {
      return
    }

    this._isLoading = true
    this._entitySource(this._pageSettings).subscribe({
      next: entities => {
        this.OnLoadEntities(entities)
        this.UpdateIsEntitiesEnded(entities)
        this._pageSettings.pageNumber += 1
      },
      error: err => {
        console.error(err)
      },
      complete: () => {
        this._isLoading = false
      }
    })
  }

  protected OnLoadEntities(entities: TEntity[]){
    this.Entities = [...this.Entities, ...entities]
  }

  private UpdateIsEntitiesEnded(entities: TEntity[]) {
    this._isEnded = entities.length < this._pageSettings.pageSize
  }

  public IsLoading(): boolean {
    return this._isLoading
  }

  public IsEnded(): boolean {
    return this._isEnded
  }

  private CheckLoadingNecessary(): boolean {
    const containerHeight = this._loadingContainer.scrollHeight;
    const scrollPosition = Math.abs(this._loadingContainer.scrollTop);
    const visibleHeight = this._loadingContainer.clientHeight;

    return scrollPosition + visibleHeight + this.LoadingThreshold >= containerHeight;
  }
}
