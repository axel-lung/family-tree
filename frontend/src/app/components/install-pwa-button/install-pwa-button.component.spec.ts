import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstallPwaButtonComponent } from './install-pwa-button.component';

describe('InstallPwaButtonComponent', () => {
  let component: InstallPwaButtonComponent;
  let fixture: ComponentFixture<InstallPwaButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstallPwaButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstallPwaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
