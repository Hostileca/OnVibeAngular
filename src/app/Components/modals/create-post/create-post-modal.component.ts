import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PostService} from '../../../Data/Services/post.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FileSizePipe} from '../../../Data/Pipes/file-size.pipe';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-post',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgClass,
    FileSizePipe
  ],
  templateUrl: './create-post-modal.component.html',
  styleUrl: './create-post-modal.component.css'
})
export class CreatePostModalComponent {
  protected postForm = new FormGroup({
    content: new FormControl('', [Validators.maxLength(1000)]),
    attachments: new FormControl<File[]>([])
  });

  protected isSubmitting = false;

  constructor(private readonly _postService: PostService,
              public activeModal: NgbActiveModal) {}

  public get isAttachmentsLoaded(){
    const files = this.postForm.get('attachments')?.value;
    return files && files.length > 0;
  }

  public get isValid(){
    return this.isAttachmentsLoaded ||
      (this.postForm.get('content') && this.postForm.get('content')?.value!.length! > 0);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const currentFiles = this.postForm.get('attachments')?.value || [];

      const newFiles = [...currentFiles, ...Array.from(input.files)];

      this.postForm.patchValue({
        attachments: newFiles
      });
    }
  }

  public async removeAttachment(index: number) {
    const attachments = this.postForm.get('attachments')?.value || [];
    attachments.splice(index, 1);
    this.postForm.patchValue({
      attachments: [...attachments]
    });
  }

  public async onSubmit() {
    if (!this.isValid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    await this._postService.createPost(this.postForm.value)
    this.activeModal.close();
  }

  public cancel() {
    this.activeModal.close();
  }
}
