import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoBudget } from './no-budget';

describe('NoBudget', () => {
  let component: NoBudget;
  let fixture: ComponentFixture<NoBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoBudget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoBudget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
