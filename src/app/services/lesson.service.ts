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

import { Lesson, LessonPayload } from '../models/lesson.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private readonly lessonsRef;

  constructor(private readonly firebaseService: FirebaseService) {
    this.lessonsRef = ref(this.firebaseService.database, 'lessons');
  }

  listLessons(): Observable<Lesson[]> {
    return new Observable<Lesson[]>((subscriber) => {
      const unsubscribe = onValue(
        this.lessonsRef,
        (snapshot) => {
          const lessonsRecord = (snapshot.val() as Record<string, Omit<Lesson, 'id'>> | null) ?? {};
          const lessons = Object.entries(lessonsRecord)
            .map(([id, lesson]) => ({
              ...lesson,
              id
            }))
            .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

          subscriber.next(lessons);
        },
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }

  getLessonById(lessonId: string): Observable<Lesson | null> {
    return new Observable<Lesson | null>((subscriber) => {
      if (!lessonId) {
        subscriber.next(null);
        subscriber.complete();
        return;
      }

      const lessonRef = ref(this.firebaseService.database, `lessons/${lessonId}`);
      get(lessonRef)
        .then((snapshot) => {
          if (!snapshot.exists()) {
            subscriber.next(null);
            subscriber.complete();
            return;
          }

          subscriber.next({
              ...(snapshot.val() as Omit<Lesson, 'id'>),
            id: lessonId
          });
          subscriber.complete();
        })
        .catch((error) => subscriber.error(error));
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

    const existingLesson = snapshot.val() as Omit<Lesson, 'id'>;
    const now = new Date().toISOString();

    await set(lessonRef, {
      ...payload,
      id: lessonId,
      createdAt: existingLesson.createdAt,
      updatedAt: now
    });
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const lessonRef = ref(this.firebaseService.database, `lessons/${lessonId}`);
    await remove(lessonRef);
  }
}
