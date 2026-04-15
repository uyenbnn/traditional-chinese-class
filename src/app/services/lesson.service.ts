import { Injectable } from '@angular/core';
import {
  get,
  onValue,
  push,
  ref,
  remove,
  set
} from 'firebase/database';
import { Observable } from 'rxjs';

import { Lesson, LessonDifficulty, LessonPayload } from '../models/lesson.model';
import { FirebaseService } from './firebase.service';

type LessonRecord = Partial<Omit<Lesson, 'id'>>;
type RealtimeSnapshot = {
  exists(): boolean;
  val(): unknown;
};
type ObservableSubscriber<T> = {
  next(value: T): void;
  error(error: unknown): void;
  complete(): void;
};

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private readonly lessonsRef;

  constructor(private readonly firebaseService: FirebaseService) {
    this.lessonsRef = ref(this.firebaseService.database, 'lessons');
  }

  listLessons(): Observable<Lesson[]> {
    return new Observable<Lesson[]>((subscriber: ObservableSubscriber<Lesson[]>) => {
      const unsubscribe = onValue(
        this.lessonsRef,
        (snapshot: RealtimeSnapshot) => {
          const lessonsRecord = (snapshot.val() as Record<string, LessonRecord> | null) ?? {};
          const lessons = Object.entries(lessonsRecord)
            .map(([id, lesson]) => this.normalizeLesson(id, lesson))
            .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

          subscriber.next(lessons);
        },
        (error: unknown) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }

  getLessonById(lessonId: string): Observable<Lesson | null> {
    return new Observable<Lesson | null>((subscriber: ObservableSubscriber<Lesson | null>) => {
      if (!lessonId) {
        subscriber.next(null);
        subscriber.complete();
        return;
      }

      const lessonRef = ref(this.firebaseService.database, `lessons/${lessonId}`);
      get(lessonRef)
        .then((snapshot: RealtimeSnapshot) => {
          if (!snapshot.exists()) {
            subscriber.next(null);
            subscriber.complete();
            return;
          }

          subscriber.next(this.normalizeLesson(lessonId, snapshot.val() as LessonRecord));
          subscriber.complete();
        })
        .catch((error: unknown) => subscriber.error(error));
    });
  }

  async createLesson(payload: LessonPayload): Promise<string> {
    const now = new Date().toISOString();
    const newLessonRef = push(this.lessonsRef);
    const lessonId = newLessonRef.key;

    if (!lessonId) {
      throw new Error('Unable to create lesson key.');
    }

    const lessonToCreate: Lesson = {
      ...payload,
      id: lessonId,
      createdAt: now,
      updatedAt: now
    };

    await set(newLessonRef, lessonToCreate);
    return lessonId;
  }

  async updateLesson(lessonId: string, payload: LessonPayload): Promise<void> {
    const lessonRef = ref(this.firebaseService.database, `lessons/${lessonId}`);
    const snapshot = await get(lessonRef);

    if (!snapshot.exists()) {
      throw new Error('Lesson not found.');
    }

    const existingLesson = this.normalizeLesson(lessonId, snapshot.val() as LessonRecord);
    const now = new Date().toISOString();

    await set(lessonRef, {
      ...payload,
      createdAt: existingLesson.createdAt,
      updatedAt: now
    });
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const lessonRef = ref(this.firebaseService.database, `lessons/${lessonId}`);
    await remove(lessonRef);
  }

  private normalizeLesson(lessonId: string, lesson: LessonRecord): Lesson {
    const createdAt = lesson.createdAt ?? new Date(0).toISOString();
    const updatedAt = lesson.updatedAt ?? createdAt;

    return {
      id: lessonId,
      title: lesson.title ?? 'Untitled lesson',
      category: lesson.category?.trim() || 'General',
      difficulty: this.normalizeDifficulty(lesson.difficulty),
      summary: lesson.summary ?? '',
      vocabulary: lesson.vocabulary ?? [],
      grammar: lesson.grammar ?? [],
      dialogue: lesson.dialogue ?? '',
      tests: lesson.tests ?? [],
      isPublished: lesson.isPublished ?? false,
      createdAt,
      updatedAt
    };
  }

  private normalizeDifficulty(value: unknown): LessonDifficulty {
    if (value === 'beginner' || value === 'elementary' || value === 'intermediate') {
      return value;
    }

    return 'beginner';
  }
}
