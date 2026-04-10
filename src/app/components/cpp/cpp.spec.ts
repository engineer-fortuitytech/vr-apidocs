import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cpp } from './cpp';

describe('Cpp', () => {
  let component: Cpp;
  let fixture: ComponentFixture<Cpp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cpp],
    }).compileComponents();

    fixture = TestBed.createComponent(Cpp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
