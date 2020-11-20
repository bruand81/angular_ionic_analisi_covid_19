import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraficiProvinceComponent } from './grafici-province.component';

describe('GraficiProvinceComponent', () => {
  let component: GraficiProvinceComponent;
  let fixture: ComponentFixture<GraficiProvinceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficiProvinceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraficiProvinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
