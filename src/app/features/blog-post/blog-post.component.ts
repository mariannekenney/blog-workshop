import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss'
})
export class BlogPostComponent implements OnInit {
  
  public dialogRef = inject(MatDialogRef<BlogPostComponent>);
  public data = inject(MAT_DIALOG_DATA);
  private blogService = inject(BlogService);

  blogPostFormGroup: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.blogPostFormGroup = new FormGroup({
      'title': new FormControl({ value: this.data.title, disabled: !!this.data }, [Validators.required]),
      'content': new FormControl(this.data.content, [Validators.required])
    });
  }

  createPost(): void {
    this.blogService.create(this.blogPostFormGroup.getRawValue())
      .subscribe({
        next: (resp) => {
          this.dialogRef.close(resp);
        }
      });
  }

  savePost(): void {
    this.blogService.save(this.data?.id, this.blogPostFormGroup.getRawValue())
      .subscribe({
        next: (resp) => {
          this.dialogRef.close(resp);
        }
      });
  }
  
}
