import { Route } from '@angular/router';
import { LocaleShellPageComponent } from './pages/locale-shell.page';
import { HomePageComponent } from './pages/home.page';
import { ResumePageComponent } from './pages/resume.page';
import { ArchitectureListPageComponent } from './pages/architecture-list.page';
import { ArchitectureDetailPageComponent } from './pages/architecture-detail.page';
import { TopicPageComponent } from './pages/topic.page';
import { BlogListPageComponent } from './pages/blog-list.page';
import { BlogDetailPageComponent } from './pages/blog-detail.page';

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
      { path: 'unraid', component: TopicPageComponent, data: { slug: 'unraid' } },
      { path: 'fitness-ai-agent', component: TopicPageComponent, data: { slug: 'fitness-ai-agent' } },
      { path: 'blog', component: BlogListPageComponent },
      { path: 'blog/:slug', component: BlogDetailPageComponent },
    ],
  },
  {
    path: '**',
    redirectTo: 'zh',
  },
];
