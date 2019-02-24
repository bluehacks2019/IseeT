import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouncilorsComponent } from './councilors.component';

describe('CouncilorsComponent', () => {
  let component: CouncilorsComponent;
  let fixture: ComponentFixture<CouncilorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouncilorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouncilorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
