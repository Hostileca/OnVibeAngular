import {Directive, HostListener} from '@angular/core';

@Directive()
export class ContextMenuBaseComponent {
  public Visible = false;
  protected XPos = 0;
  protected YPos = 0;

  public ShowMenu(x: number, y: number) {
    this.XPos = x;
    this.YPos = y;
    this.Visible = true;
  }

  public HideMenu() {
    this.Visible = false;
  }

  @HostListener('document:click')
  private Close() {
    this.HideMenu();
  }
}
