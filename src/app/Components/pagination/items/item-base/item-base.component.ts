import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({template: ``})
export abstract class ItemBaseComponent<TItem> {
  @Input() item!: TItem
  @Output() onSelect = new EventEmitter<TItem>();

  public toggleItem() {
    this.onSelect.emit(this.item);
  }
}
