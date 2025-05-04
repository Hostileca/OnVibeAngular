import {Component, Input} from '@angular/core';
import {PaginationBaseComponent} from '../pagination-base/pagination-base.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Assets} from '../../../../Data/Constants/assets';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Comment} from '../../../../Data/Models/Comment/comment';
import {CommentComponent} from '../../items/comment/comment.component';
import {CommentService} from '../../../../Data/Services/comment.service';
import {Post} from '../../../../Data/Models/Post/post';
import {AddComment} from '../../../../Data/Models/Comment/add-comment';

@Component({
  selector: 'app-comments-list',
  imports: [
    NgIf,
    NgForOf,
    CommentComponent,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.css'
})
export class CommentsListComponent extends PaginationBaseComponent<Comment> {
  @Input() post!: Post;

  protected commentForm = new FormGroup({
    content: new FormControl('', [Validators.maxLength(1000), Validators.required]),
    postId: new FormControl(''),
  });

  public showCommentForm: boolean = false;

  constructor(private readonly _commentService: CommentService) {
    super();
    this._loadingContainerId = 'comments-container'
  }

  public toggleCommentForm(){
    this.showCommentForm = !this.showCommentForm;
  }

  public async addComment() {
    if (this.commentForm.invalid || !this.post) return;

    this.commentForm.patchValue({ postId: this.post.id });

    try {
      const newComment = await this._commentService.addComment(<AddComment>this.commentForm.value);

      const current = this._entities$.value;
      this._entities$.next([newComment, ...current]);

      this.commentForm.reset();
      this.showCommentForm = false;
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }

  protected readonly Assets = Assets;
}
