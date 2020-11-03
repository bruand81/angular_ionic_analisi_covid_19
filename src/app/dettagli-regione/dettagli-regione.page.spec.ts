import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DettagliRegionePage } from './dettagli-regione.page';

describe('DettagliRegionePage', () => {
  let component: DettagliRegionePage;
  let fixture: ComponentFixture<DettagliRegionePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettagliRegionePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DettagliRegionePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
