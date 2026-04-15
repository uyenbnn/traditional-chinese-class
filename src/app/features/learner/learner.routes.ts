import { Routes } from '@angular/router';

import { LearnerHomeComponent } from './learner-home.component';
import { PinyinPageComponent } from './pinyin-page.component';

export const learnerRoutes: Routes = [
  {
    path: '',
    data: { animation: 'learner-home' },
    component: LearnerHomeComponent
  },
  {
    path: 'pinyin',
    data: { animation: 'pinyin' },
    component: PinyinPageComponent
  }
];
