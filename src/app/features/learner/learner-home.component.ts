import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

import { backdropAnimation, fadeAnimation, lessonTransition, modalAnimation } from '../../animations/transitions';
import { Lesson, LessonDifficulty, LESSON_DIFFICULTIES, TestQuestion, VocabularyItem } from '../../models/lesson.model';
import { IconComponent } from '../../shared/icon/icon.component';
import { LessonService } from '../../services/lesson.service';

type LessonTab = 'vocabulary' | 'grammar' | 'dialogue' | 'tests';
type LessonDifficultyFilter = LessonDifficulty | 'all';

@Component({
  selector: 'app-learner-home',
  imports: [IconComponent],
  templateUrl: './learner-home.component.html',
  styleUrl: './learner-home.component.scss',
  animations: [backdropAnimation, modalAnimation, fadeAnimation, lessonTransition],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LearnerHomeComponent {
  private readonly lessonService = inject(LessonService);

  readonly difficultyOptions = LESSON_DIFFICULTIES;
  readonly lessonsLoading = signal(true);

  private readonly lessons = toSignal(
    this.lessonService.listLessons().pipe(tap(() => this.lessonsLoading.set(false))),
    { initialValue: [] as Lesson[] }
  ) as Signal<Lesson[]>;

  readonly selectedLessonId = signal<string | null>(null);
  readonly selectedTab = signal<LessonTab>('vocabulary');
  readonly selectedAnswers = signal<Record<number, number>>({});
  readonly selectedVocabularyIndex = signal<number | null>(null);
  readonly selectedDifficulty = signal<LessonDifficultyFilter>('all');
  readonly selectedCategory = signal('all');

  readonly publishedLessons = computed(() =>
    this.lessons()
      .filter((lesson: Lesson) => lesson.isPublished)
      .sort((left: Lesson, right: Lesson) => Date.parse(left.createdAt) - Date.parse(right.createdAt))
  );

  readonly availableCategories = computed(() => {
    const categories = new Set<string>(
      this.publishedLessons()
        .map((lesson: Lesson) => lesson.category.trim())
        .filter((category: string) => category.length > 0)
    );

    return [...categories].sort((left: string, right: string) => left.localeCompare(right));
  });

  readonly filteredLessons = computed(() => {
    const difficulty = this.selectedDifficulty();
    const category = this.selectedCategory();

    return this.publishedLessons().filter((lesson: Lesson) => {
      const matchesDifficulty = difficulty === 'all' || lesson.difficulty === difficulty;
      const matchesCategory = category === 'all' || lesson.category === category;
      return matchesDifficulty && matchesCategory;
    });
  });

  readonly hasActiveFilters = computed(() => this.selectedDifficulty() !== 'all' || this.selectedCategory() !== 'all');

  readonly selectedLesson = computed(() => {
    const published = this.filteredLessons();
    const activeId = this.selectedLessonId();

    if (!activeId) {
      return published[0] ?? null;
    }

    return published.find((lesson: Lesson) => lesson.id === activeId) ?? null;
  });

  readonly score = computed(() => {
    const lesson = this.selectedLesson();
    if (!lesson) {
      return 0;
    }

    return lesson.tests.reduce((total: number, question: TestQuestion, index: number) => {
      return this.selectedAnswers()[index] === question.correctAnswerIndex ? total + 1 : total;
    }, 0);
  });

  readonly activeVocabulary = computed<VocabularyItem | null>(() => {
    const lesson = this.selectedLesson();
    const activeIndex = this.selectedVocabularyIndex();

    if (!lesson || activeIndex === null) {
      return null;
    }

    return lesson.vocabulary[activeIndex] ?? null;
  });

  readonly hasPreviousVocabulary = computed(() => {
    const activeIndex = this.selectedVocabularyIndex();
    return activeIndex !== null && activeIndex > 0;
  });

  readonly hasNextVocabulary = computed(() => {
    const lesson = this.selectedLesson();
    const activeIndex = this.selectedVocabularyIndex();
    if (!lesson || activeIndex === null) {
      return false;
    }

    return activeIndex < lesson.vocabulary.length - 1;
  });

  readonly vocabularyPositionLabel = computed(() => {
    const lesson = this.selectedLesson();
    const activeIndex = this.selectedVocabularyIndex();

    if (!lesson || activeIndex === null) {
      return '';
    }

    return `${activeIndex + 1} / ${lesson.vocabulary.length}`;
  });

  constructor() {
    effect(() => {
      const lessons = this.publishedLessons();
      const currentId = this.selectedLessonId();

      if (lessons.length === 0) {
        this.selectedLessonId.set(null);
        return;
      }

      if (!currentId || lessons.every((lesson: Lesson) => lesson.id !== currentId)) {
        this.selectLesson(lessons[0].id);
      }
    });
  }

  selectLesson(lessonId: string): void {
    this.selectedLessonId.set(lessonId);
    this.selectedTab.set('vocabulary');
    this.selectedAnswers.set({});
    this.closeVocabularyDetails();
  }

  selectTab(tab: LessonTab): void {
    this.selectedTab.set(tab);
    if (tab !== 'vocabulary') {
      this.closeVocabularyDetails();
    }
  }

  selectAnswer(questionIndex: number, optionIndex: number): void {
    this.selectedAnswers.update((current) => ({
      ...current,
      [questionIndex]: optionIndex
    }));
  }

  resetQuiz(): void {
    this.selectedAnswers.set({});
  }

  setDifficultyFilter(value: string): void {
    if (value === 'all' || value === 'beginner' || value === 'elementary' || value === 'intermediate') {
      this.selectedDifficulty.set(value);
    }
  }

  setCategoryFilter(value: string): void {
    this.selectedCategory.set(value || 'all');
  }

  clearFilters(): void {
    this.selectedDifficulty.set('all');
    this.selectedCategory.set('all');
  }

  difficultyLabel(difficulty: LessonDifficulty): string {
    switch (difficulty) {
      case 'beginner':
        return 'Beginner';
      case 'elementary':
        return 'Elementary';
      case 'intermediate':
        return 'Intermediate';
    }
  }

  openVocabularyDetails(index: number): void {
    this.selectedVocabularyIndex.set(index);
  }

  closeVocabularyDetails(): void {
    this.selectedVocabularyIndex.set(null);
  }

  showPreviousVocabulary(): void {
    const activeIndex = this.selectedVocabularyIndex();
    if (activeIndex === null || activeIndex <= 0) {
      return;
    }

    this.selectedVocabularyIndex.set(activeIndex - 1);
  }

  showNextVocabulary(): void {
    const lesson = this.selectedLesson();
    const activeIndex = this.selectedVocabularyIndex();
    if (!lesson || activeIndex === null || activeIndex >= lesson.vocabulary.length - 1) {
      return;
    }

    this.selectedVocabularyIndex.set(activeIndex + 1);
  }
}
