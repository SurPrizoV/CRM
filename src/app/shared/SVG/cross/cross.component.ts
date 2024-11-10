import { Component } from '@angular/core';

@Component({
  selector: 'app-cross',
  standalone: true,
  imports: [],
  template: `<svg
    class="cross-icon"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.589 5.58904L14.4106 4.41071L9.99981 8.82154L5.58898 4.41071L4.41064 5.58904L8.82148 9.99987L4.41064 14.4107L5.58898 15.589L9.99981 11.1782L14.4106 15.589L15.589 14.4107L11.1781 9.99987L15.589 5.58904Z"
      fill="#374957"
    />
  </svg> `,
  styles: [
    `
      .cross-icon {
        cursor: pointer;
      }
    `,
  ],
})
export class CrossComponent {}
