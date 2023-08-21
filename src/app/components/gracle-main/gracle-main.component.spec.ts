import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GracleMainComponent } from './gracle-main.component';

describe('GracleMainComponent', () => {
  let component: GracleMainComponent;
  let fixture: ComponentFixture<GracleMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GracleMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GracleMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
