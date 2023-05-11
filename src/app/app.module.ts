import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

// Componentes
import { AppComponent } from './app.component';
import { BodyComponent } from '@components/body/body.component';
import { SidenavComponent } from '@components/sidenav/sidenav.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { CandidateComponent } from './components/candidate/candidate.component';
import { LeadersComponent } from './components/campaign/leaders/leaders.component';
import { SupportersComponent } from './components/campaign/supporters/supporters.component';
import { WitnessesComponent } from './components/elections/witnesses/witnesses.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { CreateCandidateComponent } from './components/create.candidate/create.candidate.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CampaignComponent } from './components/campaign/campaign.component';
import { ElectionsComponent } from './components/elections/elections.component';
import { SublevelMenuComponent } from './components/sidenav/sublevel-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    CandidateComponent,
    LeadersComponent,
    SupportersComponent,
    WitnessesComponent,
    CreateCandidateComponent,
    LoginComponent,
    ResetPasswordComponent,
    CampaignComponent,
    ElectionsComponent,
    SublevelMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgxChartsModule,
    RouterModule
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
