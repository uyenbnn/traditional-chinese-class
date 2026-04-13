import { Routes } from '@angular/router';

import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'learn'
	},
	{
		path: 'learn',
		data: { animation: 'learn' },
		loadChildren: () => import('./features/learner/learner.routes').then((m) => m.learnerRoutes)
	},
	{
		path: 'auth',
		data: { animation: 'auth' },
		loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes)
	},
	{
		path: 'admin',
		data: { animation: 'admin' },
		canActivate: [authGuard, adminGuard],
		loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes)
	},
	{
		path: '**',
		redirectTo: 'learn'
	}
];
