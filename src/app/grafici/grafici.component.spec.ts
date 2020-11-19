import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraficiComponent } from './grafici.component';

describe('GraficiComponent', () => {
  let component: GraficiComponent;
  let fixture: ComponentFixture<GraficiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficiComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraficiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
