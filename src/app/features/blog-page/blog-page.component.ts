import { Component, OnInit, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BlogPost } from '../../models/BlogPost';
import { BlogPostComponent } from '../blog-post/blog-post.component';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    CommonModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.scss'
})
export class BlogPageComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private blogService = inject(BlogService);
  private authService = inject(AuthService);

  allBlogPosts: BlogPost[] = [];

  ngOnInit(): void {
    this.allBlogPosts = this.activatedRoute.snapshot.data['allBlogPosts'];
  }

  openPostDialog(data?: BlogPost): void {
    const dialogRef = this.dialog.open(BlogPostComponent, { data, width: '50%' });

    dialogRef.afterClosed().subscribe((data: BlogPost) => {
      if (data) {
        if (this.allBlogPosts.find((blogPost: BlogPost) => blogPost.id == data.id)) {
          this.allBlogPosts = this.allBlogPosts.map((blogPost: BlogPost) => 
            (blogPost.id == data.id) ? data : blogPost
          );
        } else {
          this.allBlogPosts.push(data);
        }
      }
    });
  }

  deletePost(id: number): void {
    this.blogService.delete(id)
      .subscribe({
        next: () => {
          this.allBlogPosts = this.allBlogPosts.filter((post: BlogPost) => post.id !== id);
        }
      });
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigateByUrl('login');
  }

}
