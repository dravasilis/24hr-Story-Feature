import { Component } from '@angular/core';
import { StoriesNavigationComponent } from './components/stories-navigation/stories-navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StoriesNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showOverlay = false;
  title = 'web';
}
