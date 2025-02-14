// import function to register Swiper custom elements
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Swiper, SwiperOptions } from 'swiper/types';
import { Story } from '../../interfaces/story';
@Component({
  selector: 'app-stories-swiper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stories-swiper.component.html',
  styleUrl: './stories-swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Allow custom elements (web components),
})
export class StoriesSwiperComponent {
  @Input() stories: Story[] = [];
  @Input() indexToStart = 0;
  @ViewChild('progressBar') progressBar !: ElementRef<HTMLElement>;
  @ViewChild('liveProgress') liveProgress !: ElementRef<HTMLElement>;
  loader = true;

  config: SwiperOptions = {
    spaceBetween: 10,
    slidesPerView: 1,
    rewind: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  };
  autoplayInterval: any;
  ngOnInit() {
    //register swiper elements
    register();
    const swiperEl = document.querySelector('swiper-container');
    if (!swiperEl) return;
    //assign configurations to swiper
    Object.assign(swiperEl, { ...this.config });
    swiperEl.swiper.slideTo(this.indexToStart);
    const swiper: Swiper = swiperEl.swiper;
    //start autoplay
    swiper.autoplay.start();
    // Track progress continuously using setInterval
    this.autoplayInterval = setInterval(() => {
      this.updateProgress(swiper); // Update progress bar on each interval
    }, 10);  // Check every 100ms to track progress

    //set initially clicked story  as viewed
    this.setStoryAsViewed(this.indexToStart);
    //set stories brought into view as viewed
    swiper.on('slideChange', (e) => {
      this.setStoryAsViewed(e.activeIndex);
    });
  }

  updateProgress(swiper: Swiper) {
    // Get the current time left (remaining autoplay time)
    const timeLeft = swiper.autoplay.timeLeft;
    const delay = 2500;
    // Calculate progress as percentage from 0 to 100 based on timeLeft
    const progress = ((delay - timeLeft) / delay) * 100;  // Normalize to 0-100%

    // Update the progress bar width
    if (this.liveProgress) {
      window.scroll();
      this.liveProgress.nativeElement.style.width = `${progress}%`;  // Update progress bar width
    }
  }
  setStoryAsViewed(activeIndex: number) {
    if (this.stories[activeIndex].viewed === false) {
      this.stories[activeIndex].viewed = true;
      this.setToTail(activeIndex);
      //update local storage
      localStorage.setItem('stories', JSON.stringify(this.stories));
    }
  }

  setToTail(index: number) {
    const story = this.stories[index];
    this.stories.splice(index, 1);
    this.stories.push(story);
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }
} 
