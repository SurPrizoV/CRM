import { isPlatformBrowser } from '@angular/common';
import { ElementRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable()
export class ToggleService {
  isOpen: boolean = false;
  isBrowser: boolean;
  private closeCallback?: () => void;
  private clickHandler?: EventListener;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  initialize(eRef: ElementRef, closeCallback?: () => void) {
    this.closeCallback = closeCallback;

    if (this.isBrowser && !this.clickHandler) {
      this.clickHandler = (event: Event) => this.clickOut(event, eRef);
      document.addEventListener('click', this.clickHandler);
    }
  }

  toggleModalOpen() {
    this.isOpen = !this.isOpen;
  }

  clickOut(event: Event, eRef: ElementRef) {
    if (this.isBrowser && !eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      if (this.closeCallback) {
        this.closeCallback();
      }
    }
  }

  destroy(eRef: ElementRef) {
    if (this.isBrowser && this.clickHandler) {
      document.removeEventListener('click', this.clickHandler);
      this.clickHandler = undefined;
    }
  }
}
