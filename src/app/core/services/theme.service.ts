import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkModeSubject = new BehaviorSubject<boolean>(false);

  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.darkModeSubject.next(true);
      document.body.classList.add('dark-theme');
    }
  }

  toggleTheme(): void {

    const isDark = !this.darkModeSubject.value;

    this.darkModeSubject.next(isDark);

    document.body.classList.toggle('dark-theme', isDark);

    localStorage.setItem(
      'theme',
      isDark ? 'dark' : 'light'
    );
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}