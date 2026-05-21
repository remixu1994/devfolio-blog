import { Route } from '@angular/router';
import { LocaleShellPageComponent } from './pages/locale-shell.page';
import { HomePageComponent } from './pages/home.page';
import { ResumePageComponent } from './pages/resume.page';
import { ArchitectureListPageComponent } from './pages/architecture-list.page';
import { ArchitectureDetailPageComponent } from './pages/architecture-detail.page';
import { BooksPageComponent } from './pages/books.page';
import { TopicPageComponent } from './pages/topic.page';
import { BlogListPageComponent } from './pages/blog-list.page';
import { BlogDetailPageComponent } from './pages/blog-detail.page';
import { RecipesPageComponent } from './pages/recipes.page';
import { RecipeDetailPageComponent } from './pages/recipe-detail.page';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'zh',
  },
  {
    path: ':locale',
    component: LocaleShellPageComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'resume', component: ResumePageComponent },
      { path: 'architecture', component: ArchitectureListPageComponent },
      { path: 'architecture/:slug', component: ArchitectureDetailPageComponent },
      { path: 'books', component: BooksPageComponent },
      { path: 'unraid', component: TopicPageComponent, data: { slug: 'unraid' } },
      { path: 'fitness-ai-agent', redirectTo: 'fitness', pathMatch: 'full' },
      { path: 'fitness', component: TopicPageComponent, data: { slug: 'fitness-ai-agent' } },
      { path: 'recipes', component: RecipesPageComponent },
      { path: 'recipes/:slug', component: RecipeDetailPageComponent },
      { path: 'blog', component: BlogListPageComponent },
      { path: 'blog/:slug', component: BlogDetailPageComponent },
    ],
  },
  {
    path: '**',
    redirectTo: 'zh',
  },
];
