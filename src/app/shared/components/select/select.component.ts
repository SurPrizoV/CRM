import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ArrowDownComponent } from '../../SVG/arrow-down-component/arrow.component';
import { CommonModule } from '@angular/common';
import { ToggleService } from '../../services/toggle.service';

@Component({
  selector: 'app-select-component',
  standalone: true,
  imports: [ArrowDownComponent, CommonModule],
  providers: [ToggleService],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() options: string[] = [];
  @Output() optionSelected = new EventEmitter<string>();

  selectedOption: string | null = null;

  constructor(private toggleService: ToggleService, private eRef: ElementRef) {}

  ngOnInit() {
    this.toggleService.initialize(this.eRef);
  }

  toggleDropdown() {
    this.toggleService.toggleModalOpen();
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.optionSelected.emit(option);
    this.toggleService.isOpen = false;
  }

  get isOpen() {
    return this.toggleService.isOpen;
  }

  ngOnDestroy() {
    this.toggleService.destroy(this.eRef);
  }
}
