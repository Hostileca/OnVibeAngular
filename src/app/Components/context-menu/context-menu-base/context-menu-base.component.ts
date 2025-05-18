import {Directive, HostListener} from '@angular/core';

@Directive()
export class ContextMenuBaseComponent {
  public Visible = false;
  protected XPos = 0;
  protected YPos = 0;

  public open(x: number, y: number) {
    this.XPos = x;
    this.YPos = y;
    this.Visible = true;
  }

  @HostListener('document:click')
  protected close() {
    this.Visible = false;
  }
}
