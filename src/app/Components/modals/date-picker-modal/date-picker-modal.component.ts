import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-picker-modal',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './date-picker-modal.component.html',
  styleUrl: './date-picker-modal.component.css'
})
export class DatePickerModalComponent implements OnInit {
  public dateForm: FormGroup = new FormGroup({
    date: new FormControl(null, [Validators.required])
  });

  public minDate: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDate = now.toISOString().slice(0, 16);
    this.dateForm.get('date')?.setValidators([
      Validators.required
    ]);
  }

  confirm() {
    if (this.dateForm.valid) {
      this.activeModal.close(new Date(this.dateForm.get('date')?.value));
    }
  }
}
