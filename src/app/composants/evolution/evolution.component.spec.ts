import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionComponent } from './evolution.component';

describe('EvolutionComponent', () => {
  let component: EvolutionComponent;
  let fixture: ComponentFixture<EvolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
