import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../shared/icon/icon.component';

type LandingFeature = {
  title: string;
  description: string;
  icon: string;
};

type StudyStep = {
  title: string;
  description: string;
  detail: string;
  icon: string;
};

type LandingStat = {
  value: string;
  label: string;
};

@Component({
  selector: 'app-landing',
  imports: [RouterLink, IconComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {
  readonly authService = inject(AuthService);

  readonly heroStats: LandingStat[] = [
    {
      value: '4-step',
      label: 'study path from sounds to usable lessons'
    },
    {
      value: '2 tracks',
      label: 'learner practice and admin classroom management'
    },
    {
      value: '1 place',
      label: 'to move between pinyin, vocabulary, grammar, and short tests'
    }
  ];

  readonly features: LandingFeature[] = [
    {
      title: 'Structured lesson flow',
      description: 'Each lesson keeps vocabulary, grammar, dialogue, and review in one sequence so new learners do not lose the thread.',
      icon: 'menu_book'
    },
    {
      title: 'Pinyin support that stays practical',
      description: 'A dedicated pronunciation guide helps learners lock in initials, finals, tones, and speech contrasts before they build bad habits.',
      icon: 'record_voice_over'
    },
    {
      title: 'Classroom-ready administration',
      description: 'Admins can maintain lesson content in the same workspace used by learners, which keeps materials current and aligned.',
      icon: 'dashboard'
    }
  ];

  readonly studySteps: StudyStep[] = [
    {
      title: 'Start with sound clarity',
      description: 'Use the pinyin guide to stabilize initials, finals, and tones before moving into longer material.',
      detail: 'This lowers friction when learners enter lesson content because pronunciation rules are already visible and consistent.',
      icon: 'hearing'
    },
    {
      title: 'Move into complete lessons',
      description: 'Shift into the learning area to work through vocabulary, grammar notes, dialogue, and a short check for understanding.',
      detail: 'The lesson layout is compact and focused, which is useful for self-study as well as classroom projection.',
      icon: 'school'
    },
    {
      title: 'Keep materials current',
      description: 'When teaching needs change, admins can sign in and update the lesson library without switching systems.',
      detail: 'That keeps the learner view tightly coupled to the classroom plan instead of drifting into stale content.',
      icon: 'edit_note'
    }
  ];

  readonly adminRoute = computed(() => this.authService.isAuthenticated() ? '/admin' : '/auth/login');
  readonly adminLabel = computed(() => this.authService.isAuthenticated() ? 'Open admin dashboard' : 'Admin sign in');
}