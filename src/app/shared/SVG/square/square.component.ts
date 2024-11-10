import { Component } from '@angular/core';

@Component({
  selector: 'app-square',
  standalone: true,
  imports: [],
  template: `<svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#BDBDBD" />
  </svg> `,
})
export class SquareComponent {}
