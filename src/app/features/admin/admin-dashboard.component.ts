import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { GrammarItem, Lesson, LessonDifficulty, LESSON_DIFFICULTIES, LessonPayload, TestQuestion, VocabularyItem } from '../../models/lesson.model';
import { IconComponent } from '../../shared/icon/icon.component';
import { LessonService } from '../../services/lesson.service';

type VocabularyRowForm = FormGroup<{
  word: FormControl<string>;
  pinyin: FormControl<string>;
  meaning: FormControl<string>;
  exampleSentence: FormControl<string>;
  note: FormControl<string>;
}>;

type GrammarRowForm = FormGroup<{
  grammar: FormControl<string>;
  explanation: FormControl<string>;
  exampleSentence: FormControl<string>;
}>;

type TestRowForm = FormGroup<{
  question: FormControl<string>;
  optionA: FormControl<string>;
  optionB: FormControl<string>;
  optionC: FormControl<string>;
  optionD: FormControl<string>;
  correctAnswerIndex: FormControl<number>;
}>;

@Component({
  selector: 'app-admin-dashboard',
  imports: [AsyncPipe, ReactiveFormsModule, IconComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly lessonService = inject(LessonService);
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly difficultyOptions = LESSON_DIFFICULTIES;
  readonly lessons$ = this.lessonService.listLessons();
  readonly statusMessage = signal('');
  readonly toastMessage = signal('');
  readonly showToast = signal(false);
  readonly selectedLessonId = signal<string | null>(null);

  readonly lessonForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    category: ['General', Validators.required],
    difficulty: ['beginner' as LessonDifficulty, Validators.required],
    summary: [''],
    dialogue: [''],
    isPublished: [true],
    vocabulary: this.formBuilder.array([this.createVocabularyRow()]),
    grammar: this.formBuilder.array([this.createGrammarRow()]),
    tests: this.formBuilder.array([this.createTestRow()])
  });

  get vocabularyRows(): FormArray<VocabularyRowForm> {
    return this.lessonForm.controls.vocabulary;
  }

  get grammarRows(): FormArray<GrammarRowForm> {
    return this.lessonForm.controls.grammar;
  }

  get testRows(): FormArray<TestRowForm> {
    return this.lessonForm.controls.tests;
  }

  async saveLesson(): Promise<void> {
    if (this.lessonForm.invalid) {
      this.lessonForm.markAllAsTouched();
      return;
    }

    try {
      const payload = this.buildLessonPayload();
      const lessonId = this.selectedLessonId();

      if (lessonId) {
        await this.lessonService.updateLesson(lessonId, payload);
        this.statusMessage.set('Lesson updated successfully.');
      } else {
        await this.lessonService.createLesson(payload);
        this.statusMessage.set('Lesson created successfully.');
      }

      if (payload.isPublished) {
        this.openToast(lessonId ? 'Lesson updated and published.' : 'Lesson published successfully.');
      }

      this.clearForm();
    } catch (error) {
      this.statusMessage.set(this.getReadableError(error));
    }
  }

  editLesson(lesson: Lesson): void {
    this.selectedLessonId.set(lesson.id);
    this.lessonForm.patchValue({
      title: lesson.title,
      category: lesson.category,
      difficulty: lesson.difficulty,
      summary: lesson.summary,
      dialogue: lesson.dialogue,
      isPublished: lesson.isPublished
    });

    this.setVocabularyRows(lesson.vocabulary);
    this.setGrammarRows(lesson.grammar);
    this.setTestRows(lesson.tests);
  }

  async deleteLesson(lessonId: string): Promise<void> {
    try {
      await this.lessonService.deleteLesson(lessonId);
      if (this.selectedLessonId() === lessonId) {
        this.clearForm();
      }
      this.statusMessage.set('Lesson deleted.');
    } catch (error) {
      this.statusMessage.set(this.getReadableError(error));
    }
  }

  clearForm(): void {
    this.selectedLessonId.set(null);
    this.lessonForm.reset({
      title: '',
      category: 'General',
      difficulty: 'beginner',
      summary: '',
      dialogue: '',
      isPublished: true
    });
    this.setVocabularyRows([]);
    this.setGrammarRows([]);
    this.setTestRows([]);
  }

  addVocabularyRow(): void {
    this.vocabularyRows.push(this.createVocabularyRow());
  }

  removeVocabularyRow(index: number): void {
    this.vocabularyRows.removeAt(index);
    if (this.vocabularyRows.length === 0) {
      this.addVocabularyRow();
    }
  }

  addGrammarRow(): void {
    this.grammarRows.push(this.createGrammarRow());
  }

  removeGrammarRow(index: number): void {
    this.grammarRows.removeAt(index);
    if (this.grammarRows.length === 0) {
      this.addGrammarRow();
    }
  }

  addTestRow(): void {
    this.testRows.push(this.createTestRow());
  }

  removeTestRow(index: number): void {
    this.testRows.removeAt(index);
    if (this.testRows.length === 0) {
      this.addTestRow();
    }
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

  private buildLessonPayload(): LessonPayload {
    const value = this.lessonForm.getRawValue();

    return {
      title: value.title.trim(),
      category: value.category.trim() || 'General',
      difficulty: value.difficulty,
      summary: value.summary.trim(),
      dialogue: value.dialogue.trim(),
      isPublished: value.isPublished,
      vocabulary: value.vocabulary.map((row) => ({
        word: row.word.trim(),
        pinyin: row.pinyin.trim(),
        meaning: row.meaning.trim(),
        exampleSentence: row.exampleSentence.trim(),
        note: row.note.trim()
      })),
      grammar: value.grammar.map((row) => ({
        grammar: row.grammar.trim(),
        explanation: row.explanation.trim(),
        exampleSentence: row.exampleSentence.trim()
      })),
      tests: value.tests.map((row) => ({
        question: row.question.trim(),
        options: [row.optionA.trim(), row.optionB.trim(), row.optionC.trim(), row.optionD.trim()],
        correctAnswerIndex: row.correctAnswerIndex
      }))
    };
  }

  private createVocabularyRow(item?: Partial<VocabularyItem>): VocabularyRowForm {
    return this.formBuilder.nonNullable.group({
      word: [item?.word ?? ''],
      pinyin: [item?.pinyin ?? ''],
      meaning: [item?.meaning ?? ''],
      exampleSentence: [item?.exampleSentence ?? ''],
      note: [item?.note ?? '']
    });
  }

  private createGrammarRow(item?: Partial<GrammarItem>): GrammarRowForm {
    return this.formBuilder.nonNullable.group({
      grammar: [item?.grammar ?? ''],
      explanation: [item?.explanation ?? ''],
      exampleSentence: [item?.exampleSentence ?? '']
    });
  }

  private createTestRow(item?: Partial<TestQuestion>): TestRowForm {
    return this.formBuilder.nonNullable.group({
      question: [item?.question ?? ''],
      optionA: [item?.options?.[0] ?? ''],
      optionB: [item?.options?.[1] ?? ''],
      optionC: [item?.options?.[2] ?? ''],
      optionD: [item?.options?.[3] ?? ''],
      correctAnswerIndex: [item?.correctAnswerIndex ?? 0]
    });
  }

  private setVocabularyRows(items: VocabularyItem[]): void {
    this.vocabularyRows.clear();
    const rows = items.length > 0 ? items : [{} as VocabularyItem];
    for (const row of rows) {
      this.vocabularyRows.push(this.createVocabularyRow(row));
    }
  }

  private setGrammarRows(items: GrammarItem[]): void {
    this.grammarRows.clear();
    const rows = items.length > 0 ? items : [{} as GrammarItem];
    for (const row of rows) {
      this.grammarRows.push(this.createGrammarRow(row));
    }
  }

  private setTestRows(items: TestQuestion[]): void {
    this.testRows.clear();
    const rows = items.length > 0 ? items : [{} as TestQuestion];
    for (const row of rows) {
      this.testRows.push(this.createTestRow(row));
    }
  }

  private getReadableError(error: unknown): string {
    if (error instanceof Error && error.message.includes('permission_denied')) {
      return 'Realtime Database denied access. Deploy the database rules and confirm you are signed in as the admin account.';
    }

    return 'Unable to save lesson. Check Firebase Authentication and Realtime Database rules.';
  }

  private openToast(message: string): void {
    this.toastMessage.set(message);
    this.showToast.set(true);

    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }

    this.toastTimeoutId = setTimeout(() => {
      this.showToast.set(false);
      this.toastTimeoutId = null;
    }, 3200);
  }
}
