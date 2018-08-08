import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartCampaignComponent } from './start-campaign.component';

describe('DashboardComponent', () => {
  let component: StartCampaignComponent;
  let fixture: ComponentFixture<StartCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
