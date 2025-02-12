// import function to register Swiper custom elements
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { Autoplay } from 'swiper/modules';
import { Navigation, Pagination } from 'swiper/modules';

// register Swiper custom elements
@Component({
  selector: 'app-stories-swiper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stories-swiper.component.html',
  styleUrl: './stories-swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Allow custom elements (web components),
})
export class StoriesSwiperComponent {
  @Input() stories: string[] = [];
  @Input() indexToStart = 0;
  @ViewChild('progressBar') progressBar !: ElementRef<HTMLElement>;
  loader = true;
  config: SwiperOptions = {
    loop: false,
    spaceBetween: 10,
    slidesPerView: 1,
    rewind: true,
    speed: 300,
    modules: [Autoplay, Navigation, Pagination],
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    mousewheel: {
      invert: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

  };
  ngOnInit() {
    console.log(this.indexToStart);

    const swiperEl = document.querySelector('swiper-container');
    if (!swiperEl) return;
    Object.assign(swiperEl, { ...this.config, initialSlide: this.indexToStart });
    // swiperEl.swiper.slideTo(this.indexToStart);
    swiperEl.initialize();
    setTimeout(() => {
      swiperEl.swiper.slideTo(this.indexToStart);
    }, 100);
    // swiperEl.swiper.slideTo(this.indexToStart);
    // setInterval(() => {
    // swiperEl.swiper.slideNext();
    // }, 2000);
  }

}
