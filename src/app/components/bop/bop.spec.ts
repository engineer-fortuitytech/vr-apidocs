import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Bop } from './bop';

describe('Bop', () => {
  let component: Bop;
  let fixture: ComponentFixture<Bop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bop],
    }).compileComponents();

    fixture = TestBed.createComponent(Bop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
