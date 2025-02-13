import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoriesSwiperComponent } from "../stories-swiper/stories-swiper.component";
import { HttpErrorResponse } from '@angular/common/http';
import { Story } from '../../interfaces/story';

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
  stories: Story[] = [];
  indexToStart = 0;

  ngOnInit() {
    this.stories = this.getValidStories();
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
      // Get the current timestamp
      const timestamp = new Date().getTime();

      // Construct the story object with the image and timestamp
      const newStory: Story = {
        imageUrl: reader.result as string,
        timestamp: timestamp
      };

      try {
        //save to local storage
        localStorage.setItem('stories', JSON.stringify([...this.stories ?? [], newStory]));
      } catch (error: any) {
        if (error.name === 'QuotaExceededError') {
          alert('File size is too large. Please select a smaller file.');
        }
        else {
          alert('Unknown error.');
        }
      }
      //udate stories
      this.stories = JSON.parse(localStorage.getItem('stories') as string);

    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  }

  //open swiper
  triggerStoriesView(index: number) {
    this.indexToStart = index;
    this.showOverlayChange.emit(true);
  }

  //check for expired stories
  getValidStories(): any[] {
    // Retrieve stories from localStorage
    const storedStories = JSON.parse(localStorage.getItem('stories') || '[]');

    // Get the current timestamp
    const currentTimestamp = new Date().getTime();

    // Filter stories to only include those that are within 24 hours
    const validStories = storedStories.filter((story: Story) => {
      return currentTimestamp - story.timestamp <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    });

    // Re-save only the valid stories to localStorage (removes expired ones)
    localStorage.setItem('stories', JSON.stringify(validStories));

    return validStories;
  }
}

