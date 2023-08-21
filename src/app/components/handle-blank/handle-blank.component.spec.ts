import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleBlankComponent } from './handle-blank.component';

describe('HandleBlankComponent', () => {
  let component: HandleBlankComponent;
  let fixture: ComponentFixture<HandleBlankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandleBlankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
