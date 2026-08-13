import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal
} from '@angular/core';

export interface DropdownOption<T = string> {

  label: string;

  value: T;

}

@Component({
  selector: 'app-dropdown-select',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-selector.html',
  styleUrl: './dropdown-selector.css'
})
export class DropdownSelectComponent<T = string> {

  @Input()
  options: DropdownOption<T>[] = [];

  @Input()
  placeholder = 'Select an option';

  @Input()
  selected: DropdownOption<T> | null = null;

  @Input()
  disabled = false;

  @Input()
  loading = false;

  @Output()
  selectionChange =
    new EventEmitter<DropdownOption<T>>();

  isOpen =
    signal(false);

  activeIndex =
    signal(-1);

  constructor(
    private elementRef: ElementRef
  ) {}

  toggle(): void {

    if (
      this.disabled ||
      this.loading ||
      this.options.length === 0
    ) {
      return;
    }

    this.isOpen.update(open => !open);

    if (this.isOpen()) {

      this.activeIndex.set(

        this.selected
          ? this.options.findIndex(
              option =>
                option.value === this.selected?.value
            )
          : 0

      );

    }

  }

  select(
    option: DropdownOption<T>
  ): void {

    this.selectionChange.emit(option);

    this.isOpen.set(false);

  }

  @HostListener(
    'document:click',
    ['$event']
  )
  onDocumentClick(
    event: MouseEvent
  ): void {

    if (
      !this.elementRef.nativeElement.contains(
        event.target
      )
    ) {

      this.isOpen.set(false);

    }

  }

  @HostListener(
    'keydown',
    ['$event']
  )
  onKeydown(
    event: KeyboardEvent
  ): void {

    if (
      this.disabled ||
      this.loading
    ) {
      return;
    }

    if (!this.isOpen()) {

      if (
        event.key === 'Enter' ||
        event.key === ' ' ||
        event.key === 'ArrowDown'
      ) {

        event.preventDefault();

        this.toggle();

      }

      return;

    }

    switch (event.key) {

      case 'ArrowDown':

        event.preventDefault();

        this.activeIndex.update(index =>
          Math.min(
            index + 1,
            this.options.length - 1
          )
        );

        break;

      case 'ArrowUp':

        event.preventDefault();

        this.activeIndex.update(index =>
          Math.max(index - 1, 0)
        );

        break;

      case 'Enter':

        event.preventDefault();

        if (this.activeIndex() >= 0) {

          this.select(
            this.options[
              this.activeIndex()
            ]
          );

        }

        break;

      case 'Escape':

        event.preventDefault();

        this.isOpen.set(false);

        break;

    }

  }

}