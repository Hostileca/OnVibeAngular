import { Component } from '@angular/core';
import {FileService} from '../../../Data/Services/file.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PostService} from '../../../Data/Services/post.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FileSizePipe} from '../../../Data/Pipes/file-size.pipe';

@Component({
  selector: 'app-create-post',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgClass,
    FileSizePipe
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  protected postForm = new FormGroup({
    content: new FormControl('', [Validators.maxLength(1000)]),
    attachments: new FormControl<File[]>([])
  });

  protected uploadedFiles: File[] = [];
  protected isSubmitting = false;

  constructor(private readonly _postService: PostService) {}

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
    this.uploadedFiles.splice(index, 1);
  }

  public async onSubmit() {
    if (this.postForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    await this._postService.createPost(this.postForm.value)
  }

  public cancel() {}
}
