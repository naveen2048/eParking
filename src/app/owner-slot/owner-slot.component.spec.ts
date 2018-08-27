import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerSlotComponent } from './owner-slot.component';

describe('OwnerSlotComponent', () => {
  let component: OwnerSlotComponent;
  let fixture: ComponentFixture<OwnerSlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerSlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
