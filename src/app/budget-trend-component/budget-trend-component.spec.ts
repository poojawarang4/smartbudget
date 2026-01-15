import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTrendComponent } from './budget-trend-component';

describe('BudgetTrendComponent', () => {
  let component: BudgetTrendComponent;
  let fixture: ComponentFixture<BudgetTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetTrendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
