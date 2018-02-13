import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AgendamentoComponent } from './components/agendamento/agendamento.component';
import { MedicoComponent } from './components/medico/medico.component';
import { PacienteComponent } from './components/paciente/paciente.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { MedicoCreateComponent } from './components/medico/medico.create';
import { UsuarioCreateComponent } from './components/usuario/usuario.create';
import { PacienteCreateComponent } from './components/paciente/paciente.create';
import { AgendamentoCreateComponent } from './components/agendamento/agendamento.create';
import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTableModule } from 'primeng/datatable';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { GrowlModule } from 'primeng/growl';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        LoginComponent,
        MedicoComponent,
        PacienteComponent,
        UsuarioComponent,
        AgendamentoComponent,
        MedicoCreateComponent,
        UsuarioCreateComponent,
        PacienteCreateComponent,
        AgendamentoCreateComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        DataTableModule,
        MessagesModule,
        MessageModule,
        InputMaskModule,
        CalendarModule,
        GrowlModule,
        DropdownModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'agendamentos', component: AgendamentoComponent },
            { path: 'medicos', component: MedicoComponent },
            { path: 'pacientes', component: PacienteComponent },
            { path: 'usuarios', component: UsuarioComponent },
            { path: 'login', component: LoginComponent },
            { path: 'medico/create/:id', component: MedicoCreateComponent },
            { path: 'agendamento/create/:id', component: AgendamentoCreateComponent },
            { path: 'usuario/create/:id', component: UsuarioCreateComponent },
            { path: 'paciente/create/:id', component: PacienteCreateComponent },
            { path: '**', redirectTo: 'login' }
        ])
    ]
})
export class AppModuleShared {
}
