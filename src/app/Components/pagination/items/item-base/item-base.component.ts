import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({template: ``})
export abstract class ItemBaseComponent<TItem> {
  @Input() item!: TItem
  @Output() onSelect = new EventEmitter<TItem>();
  protected isSelected: boolean = false;

  public toggleItem() {
    this.onSelect.emit(this.item);
  }

  public handleClick(event: Event) {
    this.isSelected = !this.isSelected;
    if (this.onSelect.observed) {
      event.preventDefault();
      this.onSelect.emit(this.item);
    }
  }
}
