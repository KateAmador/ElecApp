import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Modulos
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

// Componentes
import { AppComponent } from './app.component';
import { BodyComponent } from '@components/body/body.component';
import { SidenavComponent } from '@components/sidenav/sidenav.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { SettingsComponent } from '@components/settings/settings.component';
import { CandidateComponent } from './components/candidate/candidate.component';
import { LeadersComponent } from './components/leaders/leaders.component';
import { SupportersComponent } from './components/supporters/supporters.component';
import { WitnessesComponent } from './components/witnesses/witnesses.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { Firestore } from 'firebase/firestore';
import { CreateCandidateComponent } from './components/create.candidate/create.candidate.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    SettingsComponent,
    CandidateComponent,
    LeadersComponent,
    SupportersComponent,
    WitnessesComponent,
    CreateCandidateComponent,
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
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
