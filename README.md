# Workshop 2024: Frontend

Build a frontend blog application using Angular and connect it to your local backend!

&nbsp;
&nbsp;
## Chapter 0: Getting Started
### Prerequisites
- [ ] [Visual Studio Code](https://code.visualstudio.com/download)
- [ ] [Node.js](https://nodejs.org/en/download)
- [ ] npm (included in the latest version of Node.js)

&nbsp;
### Setup
Verify you have **node** installed by checking the version:
```bash
node -v
```
Verify you have **npm** installed by checking the version:
```bash
npm -v
```

&nbsp;
### Install [Angular CLI](https://angular.io/cli) globally
```bash
npm install -g @angular/cli@latest
```

&nbsp;
### Create a new Angular application
```bash
ng new blog-frontend
```
- Which stylesheet format would you like to use? [**SCSS**](https://sass-lang.com/documentation/syntax#scss)
- Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? **No**

&nbsp;
### Install [Angular Material](https://angular.io/material) in the blog-frontend folder
```bash
npm install @angular/material
```

&nbsp;
### Run the application
```bash
ng serve
```
Your application is now live at http://localhost:4200!

&nbsp;
&nbsp;
## Chapter 1
### refactor: enable auto-importing for @angular/material
in **tsconfig.json**, under "compiler-options":
```json
 "typeRoots": ["node_modules/@angular/material"]
```

&nbsp;
### refactor: add global styling
in **styles.scss**, replace contents with:
```scss
@use '@angular/material' as mat;
@include mat.core();

@import "@angular/material/prebuilt-themes/indigo-pink.css";

$primary: mat.define-palette(mat.$indigo-palette);

body {
  margin: 0;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
  background-color: mat.get-color-from-palette($primary, 'lighter');
}

html, body {
  height: 100%;
}
```

&nbsp;
### reafctor: modify generated app template
remove all contents of **app.component.html**, except:
```html
<router-outlet />
```

&nbsp;
### refactor: providers for app config
in **app.config.ts**, add providers for appConfig:
```ts
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient()
    ]
};
```

&nbsp;
&nbsp;
## Chapter 3
### models/BlogPost.ts
add a new folder "models" and inside, create a new file named "BlogPost.ts" to hold the interface "BlogPost":
```ts
export interface BlogPost {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}
```

&nbsp;
### generate BlogService
```bash
ng g service services/blog
```

&nbsp;
### refactor: BlogService headers & token
in **blog.service.ts**, replace the class "BlogService" contents with:
```ts
private blogUrl: string = 'http://localhost:8080/api/blogs';

constructor(private httpClient: HttpClient) {
}

fetchToken(): void {
    this.httpClient.post<{ token: string }>(
        'http://localhost:8080/api/auth/login',
        { email: 'test1@nowhere.com', password: '12345678' }
      )
      .subscribe((resp) => {
        localStorage.setItem('auth_token', resp.token);
      });
}

getHttpHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('auth_token');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) };
}
```
&nbsp;
in **app.component.ts**, implement the "fetchToken" function:
```ts
constructor(private blogService: BlogService) {
    this.blogService.fetchToken();
}
```

&nbsp;
&nbsp;
## Chapter 4
### generate BlogPageComponent
```bash
ng g component features/blog-page
```

&nbsp;
### refactor: route to BlogPageComponent
in **app.routes.ts**, add a route for BlogPageComponent and a catch-all route:
```ts
export const routes: Routes = [
    {
        path: 'blog',
        component: BlogPageComponent
    },
    {
        path: '**',
        redirectTo: 'blog'
    }
];
```

&nbsp;
### refactor: BlogPageComponent toolbar
in **blog-page.component.html**, replace contents with:
```html
<div class="blog-page-container">
    <mat-toolbar color="primary">
        <span>My Blog</span>
        <button mat-raised-button color="accent">New Post</button>
        <span></span>
    </mat-toolbar>
</div>
```
&nbsp;
in **blog-page.component.scss**, replace contents with:
```scss
.blog-page-container {
    mat-toolbar {
        justify-content: space-between;
    }
}
```
&nbsp;
in **blog-page.component.ts**, add the corresponding Angular Material module imports:
```ts
MatToolbarModule,
MatButtonModule
```

&nbsp;
### refactor: BlogPageComponent grid-list
&nbsp;
in **blog-page.component.html**, add the grid list for blog posts under the toolbar:
```html
<mat-grid-list cols="3">
        @for (post of allBlogPosts; track post.id) {
            <mat-grid-tile></mat-grid-tile>
        }
</mat-grid-list>
```
&nbsp;
in **blog-page.component.ts**, add the corresponding Angular Material module imports:
```ts
MatGridListModule
```
&nbsp;
in **blog-page.component.ts**, add the variable "allBlogPosts" and be sure to import our BlogPost model:
```ts
allBlogPosts: BlogPost[] = [];
```

&nbsp;
### refactor: BlogPageComponent card
in **blog-page.component.html**, add grid tile for blog post:
```html
<mat-grid-tile>
    <mat-card>
        <mat-card-header color="primary">
            <mat-card-title>{{ post.title }}</mat-card-title>

            <mat-card-subtitle>
                <span>Created </span>
                <span class="emphasis">{{ post.createdAt | date }}</span>
                <span> by </span>
                <span class="emphasis">{{ post.author }}</span>
            </mat-card-subtitle>
        </mat-card-header>
        
        <mat-divider></mat-divider>

        <mat-card-content>{{ post.content }}</mat-card-content>

        <mat-card-actions align="end">
            <mat-card-subtitle>
                <span>Updated </span>
                <span class="emphasis">{{ post.updatedAt | date: 'short' }}</span>
            </mat-card-subtitle>

            <button mat-flat-button color="primary">Edit</button>
            <button mat-flat-button color="warn">Delete</button>
        </mat-card-actions>
    </mat-card>
</mat-grid-tile>
```
&nbsp;
in **blog-page.component.ts**, add the corresponding Angular Material module imports:
```ts
CommonModule,
MatCardModule,
MatDividerModule
```
&nbsp;
in **blog-page.component.html**, add styling within ".blog-page-container":
```scss
::ng-deep .mat-grid-tile-content {
    align-items: flex-start;
    margin-top: 30px;
}

mat-card {
    width: calc(100% - 80px);
    max-height: calc(100% - 80px);
    overflow: hidden;

    .emphasis {
        font-weight: bold;
    }

    mat-card-content {
        margin: 16px 0;
        overflow: auto;
    }

    mat-card-actions > * {
        margin-left: 16px;
    }
}
```

&nbsp;
### GET all blog posts
&nbsp;
in **app.routes.ts**, add resolver to "blog" route:
```ts
resolve: {
    allBlogPosts: () => inject(BlogService).getAll()
}
```
&nbsp;
in **blog-page.component.ts**, BlogPageComponent implements OnInit:
```ts
export class BlogPageComponent implements OnInit {
```
&nbsp;
in **blog-page.component.ts**, inject the ActivatedRoute:
```ts
private activatedRoute = inject(ActivatedRoute);
```
&nbsp;
in **blog-page.component.ts**, the LoginComponent then uses function ngOnInit:
```ts
ngOnInit(): void {
    this.allBlogPosts = this.activatedRoute.snapshot.data['allBlogPosts'];
}
```
&nbsp;
in **blog.service.ts**, add the function "getAll":
```ts
getAll(): Observable<BlogPost[]> {
    return this.httpClient.get<BlogPost[]>(this.blogUrl, this.getHttpHeaders());
}
```

&nbsp;
&nbsp;
## Chapter 4
### generate BlogPostComponent
```bash
ng g component features/blog-post
```

&nbsp;
### refactor: BlogPageComponent opens BlogPostComponent
in **blog-page.component.html**, add a click event to the "New Post" button:
```html
(click)="openPostDialog()"
```
&nbsp;
in **blog-page.component.ts**, inject "MatDialog":
```ts
private dialog = inject(MatDialog);
```
&nbsp;
in  **blog-page.component.ts**, create the "openPostDialog" function:
```ts
openPostDialog(): void {
    this.dialog.open(BlogPostComponent, { width: '50%' });
}
```

&nbsp;
### refactor: BlogPostComponent form
in **blog-post.component.html**, replace contents with:
```html
<div class="blog-post-container">
    <form [formGroup]="blogPostFormGroup">
        <mat-form-field>
            <mat-label>Title</mat-label>
            <input matInput type="text" formControlName="title"/>
        </mat-form-field>

        <mat-form-field>
            <mat-label>Content</mat-label>
            <textarea matInput cols="40" rows="10" formControlName="content"></textarea>
        </mat-form-field>
    </form>
</div>
```
&nbsp;
in **blog-post.component.scss**, replace contents with:
```scss
.blog-post-container {
    margin: 20px;

    mat-form-field {
        width: 100%;

        input {
            color: black;
        }

        textarea {
            max-height: 40vh;
            overflow: auto;
        }
    }
}
```
&nbsp;
in **blog-post.component.ts**, add the corresponding Angular Material module imports:
```ts
FormsModule,
ReactiveFormsModule,
MatFormFieldModule,
MatInputModule
```
&nbsp;
in **blog-post.component.ts**, BlogPostComponent implements OnInit:
```ts
export class BlogPostComponent implements OnInit {
```
&nbsp;
in **blog-post.component.ts**, insert the following into the component for the form:
```ts
blogPostFormGroup: FormGroup = new FormGroup({});

ngOnInit(): void {
    this.blogPostFormGroup = new FormGroup({
        'title': new FormControl('', [Validators.required]),
        'content': new FormControl('', [Validators.required])
    });
}
```

&nbsp;
### refactor: BlogPostComponent buttons
in **blog-post.component.html**, add the "Cancel" and "Create" buttons:
```html
<div class="form-actions">
        <button mat-button (click)="dialogRef.close()">Cancel</button>
        
        <button mat-raised-button color="accent"
            [disabled]="blogPostFormGroup.invalid">
            Create
        </button>
</div>
```
&nbsp;
in **blog-post.component.scss**, add styling within ".blog-post-container":
```scss
.form-actions {
    display: flex;
    justify-content: flex-end;

    button {
        margin: 0 8px;
    }
}
```
&nbsp;
in **blog-post.component.ts**, add the corresponding Angular Material module imports:
```ts
MatButtonModule
```
&nbsp;
in **blog-posts.component.ts**, inject "MatDialogRef":
```ts
public dialogRef = inject(MatDialogRef<BlogPostComponent>);
```

&nbsp;
### POST new blog post
&nbsp;
in **blog-post.component.html**, add a click event to the "Create" button:
```html
(click)="createPost()"
```
&nbsp;
in **blog-post.component.ts**, inject the BlogService:
```ts
private blogService = inject(BlogService);
```
&nbsp;
in **blog-post.component.ts**, add the function "createPost" to use BlogService's "create":
```ts
createPost(): void {
    this.blogService.create(this.blogPostFormGroup.getRawValue())
      .subscribe({
        next: (resp) => {
          this.dialogRef.close(resp);
        }
      });
}
```
&nbsp;
in **blog.service.ts**, add the function "create":
```ts
create(data: { title: string, content: string }): Observable<BlogPost> {
    return this.httpClient.post<BlogPost>(this.blogUrl, data, this.getHttpHeaders());
}
```

&nbsp;
&nbsp;
## Chapter 5
### PATCH blog post
in **blog-page.component.html**, add function "openPostDialog" to the "Edit" button:
```html
(click)="openPostDialog(post)"
```
&nbsp;
in **blog-page.component.ts**, modify the function "openPostDialog":
```ts
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
```
&nbsp;
in **blog-post.component.html**, put the form action "Create" inside an if/else statement and add a "Save" button:
```html
@if (data) {
    <button mat-raised-button color="primary"
        [disabled]="blogPostFormGroup.invalid"
        (click)="savePost()">
        Save
    </button>
} @else {
    <button mat-raised-button color="accent"
        [disabled]="blogPostFormGroup.invalid"
        (click)="createPost()">
        Create
    </button>
}
```
&nbsp;
in **blog-post.component.ts**, inject "MAT_DIALOG_DATA":
```ts
public data = inject(MAT_DIALOG_DATA);
```
&nbsp;
in **blog-post.component.ts**, modify the form initialization of form "blogPostFormGroup":
```ts
this.blogPostFormGroup = new FormGroup({
    'title': new FormControl({ value: this.data.title, disabled: !!this.data }, [Validators.required]),
    'content': new FormControl(this.data.content, [Validators.required])
});
```
&nbsp;
in **blog-post.component.ts**, add the function "savePost" to use BlogService's "save":
```ts
savePost(): void {
    this.blogService.save(this.data.id, this.blogPostFormGroup.getRawValue())
      .subscribe({
        next: (resp) => {
          this.dialogRef.close(resp);
        }
      });
}
```
&nbsp;
in **blog.service.ts**, add the function "save":
```ts
save(id: number, data: { title: string, content: string }): Observable<BlogPost> {
    return this.httpClient.patch<BlogPost>(`${this.blogUrl}/${id}`, data, this.getHttpHeaders());
}
```

&nbsp;
### DELETE blog post
in **blog-page.component.ts**, add function "deletePost" to the "Delete" button:
```html
(click)="deletePost(post.id)"
```
&nbsp;
in **blog-page.component.ts**, inject the BlogService:
```ts
private blogService = inject(BlogService);
```
&nbsp;
in **blog-page.component.ts**, add the function "deletePost" to use BlogService's "delete":
```ts
deletePost(id: number): void {
    this.blogService.delete(id)
      .subscribe({
        next: () => {
          this.allBlogPosts = this.allBlogPosts.filter((post: BlogPost) => post.id !== id);
        }
      });
}
```
&nbsp;
in **blog.service.ts**, add the function "delete":
```ts
delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.blogUrl}/${id}`, this.getHttpHeaders());
}
```
