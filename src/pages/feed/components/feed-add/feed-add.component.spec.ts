import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedAddComponent } from './feed-add.component';

describe('FeedAddComponent', () => {
  let component: FeedAddComponent;
  let fixture: ComponentFixture<FeedAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedAddComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
