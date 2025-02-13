import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoriesSwiperComponent } from "../stories-swiper/stories-swiper.component";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-stories-navigation',
  standalone: true,
  imports: [StoriesSwiperComponent],
  templateUrl: './stories-navigation.component.html',
  styleUrl: './stories-navigation.component.scss'
})
export class StoriesNavigationComponent {
  @Output() showOverlayChange = new EventEmitter<boolean>();
  @Input() showOverlay = false;
  stories: string[] = [];
  indexToStart = 0;
  ngOnInit() {
    this.stories = JSON.parse(localStorage.getItem('stories') as string);
  }

  savePhoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const image = input?.files ? input.files[0] : null;
    if (image) {
      this.convertToBase64(image);
    }
  }

  convertToBase64(image: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(image); // Read the file as base64 encoded string
    reader.onload = () => {
      // The result will be a base64 string, and we store it in `imageBase64`
      try {
        localStorage.setItem('stories', JSON.stringify([...this.stories ?? [], reader.result]));
      } catch (error: any) {
        if (error.name === 'QuotaExceededError') {
          alert('File size is too large. Please select a smaller file.');
        }
        else {
          alert('Unknown error.');
        }
      }
      this.stories = JSON.parse(localStorage.getItem('stories') as string);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  }

  triggerStoriesView(index: number) {
    this.indexToStart = index;
    this.showOverlayChange.emit(true);
  }
}

