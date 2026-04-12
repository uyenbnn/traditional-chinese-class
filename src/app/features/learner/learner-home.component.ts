import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Lesson, VocabularyItem } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson.service';

type LessonTab = 'vocabulary' | 'grammar' | 'dialogue' | 'tests';

@Component({
  selector: 'app-learner-home',
  templateUrl: './learner-home.component.html',
  styleUrl: './learner-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LearnerHomeComponent {
  private readonly lessonService = inject(LessonService);

  private readonly lessons = toSignal(this.lessonService.listLessons(), {
    initialValue: [] as Lesson[]
  });

  readonly selectedLessonId = signal<string | null>(null);
  readonly selectedTab = signal<LessonTab>('vocabulary');
  readonly selectedAnswers = signal<Record<number, number>>({});
  readonly selectedVocabularyIndex = signal<number | null>(null);

  readonly publishedLessons = computed(() =>
    this.lessons()
      .filter((lesson) => lesson.isPublished)
      .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
  );

  readonly selectedLesson = computed(() => {
    const published = this.publishedLessons();
    const activeId = this.selectedLessonId();

    if (!activeId) {
      return published[0] ?? null;
    }

    return published.find((lesson) => lesson.id === activeId) ?? null;
  });

  readonly score = computed(() => {
    const lesson = this.selectedLesson();
    if (!lesson) {
      return 0;
    }

    return lesson.tests.reduce((total, question, index) => {
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

      if (!currentId || lessons.every((lesson) => lesson.id !== currentId)) {
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
