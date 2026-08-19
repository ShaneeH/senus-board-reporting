import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSelectComponent } from './dropdown-selector';

describe('DropdownSelectComponent', () => {
  let component: DropdownSelectComponent<unknown>;
  let fixture: ComponentFixture<DropdownSelectComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownSelectComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});