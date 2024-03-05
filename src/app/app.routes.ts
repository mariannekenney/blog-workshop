import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { BlogPageComponent } from './features/blog-page/blog-page.component';
import { BlogService } from './services/blog.service';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'blog',
        component: BlogPageComponent,
        resolve: {
            allBlogPosts: () => inject(BlogService).getAll()
        }
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
