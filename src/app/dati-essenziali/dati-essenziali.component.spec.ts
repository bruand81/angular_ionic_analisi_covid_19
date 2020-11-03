import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatiEssenzialiComponent } from './dati-essenziali.component';

describe('DatiEssenzialiComponent', () => {
  let component: DatiEssenzialiComponent;
  let fixture: ComponentFixture<DatiEssenzialiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiEssenzialiComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DatiEssenzialiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
