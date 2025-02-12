import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoriesSwiperComponent } from "../stories-swiper/stories-swiper.component";

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
    console.log(image);
    if (image) {
      this.convertToBase64(image);
    }
  }

  convertToBase64(image: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(image); // Read the file as base64 encoded string

    reader.onload = () => {
      // The result will be a base64 string, and we store it in `imageBase64`
      localStorage.setItem('stories', JSON.stringify([...this.stories ?? [], reader.result]));
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

