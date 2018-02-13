import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
@Component({
    selector: 'agendamentoCreate',
    templateUrl: './agendamento.create.html',
    styleUrls: ['./agendamento.create.scss'],
    providers: [MessageService]
})
export class AgendamentoCreateComponent implements OnInit {
    public model = new Agendamento(0,"","",1,new Date());
    add: FormGroup;
    public url: string;
    id: number = 0;
    pt: any;
    msgs: any[];
    pacientes: any[];
    medicos: any[];


    constructor(public messageService: MessageService, public routerActive: ActivatedRoute, public router: Router, public http: HttpClient, public fb: FormBuilder) {
        this.url = "http://mazzatechagendamentowebapi20180209011744.azurewebsites.net";
        let login: any = localStorage.getItem("login");
        let token = JSON.parse(login).token;
        this.msgs = [];
        this.medicos = [];
        this.pacientes = [];

        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.http.get<any>(this.url + '/api/paciente/', { headers: headers }).subscribe(data => {
            this.pacientes = data.dados;
        });
        this.http.get<any>(this.url + '/api/medico/', { headers: headers }).subscribe(data => {
            this.medicos = data.dados;
        });

        this.pt = {
            firstDayOfWeek: 0,
            dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado"],
            dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Se", "Sa"],
            dayNamesMin: ["Dm", "Sg", "Tr", "Qa", "Qt", "Se", "Sa"],
            monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            today: 'Hoje',
            clear: 'Limpar'
        };

        this.add = this.fb.group({
            'medicoId': [null, [Validators.required]],
            'pacienteId': [null, [Validators.required]],
            'dataConsulta': [null, [Validators.required]]
        });
    }

    cancelar() {
        this.router.navigate(["/agendamentos"]);
    }

    salvar() {
        this.agendamentoSubmit(this.model);
    }

    ngOnInit() {
        let login: any = localStorage.getItem("login");
        let token = JSON.parse(login).token;



        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        this.routerActive.params.subscribe(params => {
            this.id = +params['id'];
        });

        if (this.id > 0) {
            let login: any = localStorage.getItem("login");
            let token = JSON.parse(login).token;
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            this.http.get<any>(this.url + '/api/agendamento/' + this.id, { headers: headers }).subscribe(data => {
                console.log(data);
                if (data.dados.length == 0) {
                    alert("Não encontramos o id");
                    this.router.navigate(["/agendamentos"]);
                } else {

                    this.add = this.fb.group({
                        'medicoId': [data.dados[0].medicoId, [Validators.required]],
                        'pacienteId': [data.dados[0].pacienteId, [Validators.required]],
                        'dataConsulta': [new Date(data.dados[0].dataConsulta), [Validators.required]]
                    });
                    this.model = new Agendamento(data.dados[0].id, data.dados[0].medicoId, data.dados[0].pacienteId, data.dados[0].status, data.dados[0].dataConsulta);
                }
            }, err => {
                if (err.status == 401) {
                    localStorage.removeItem("login");
                    this.router.navigate(["/login"]);
                }
            });
        }
        if (localStorage.getItem("login") == undefined)
            this.router.navigate(["/login"]);
    }

    agendamentoSubmit(agendamento: Agendamento) {
        debugger;
        console.log(agendamento);
        let login: any = localStorage.getItem("login");
        let token = JSON.parse(login).token;
        agendamento.Status = 1;
        agendamento.Id = this.id;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        let body = JSON.stringify(agendamento);
        if (this.id == 0) {
            return this.http.post<any>(this.url + '/api/agendamento', body, { headers: headers }).subscribe(data => {
                if (data.statusRetorno == 1) {
                    this.messageService.add({ severity: 'success', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                    setTimeout((router: Router) => {
                        this.router.navigate(["/agendamentos"]);
                    }, 2000);
                }
                else {
                    this.messageService.add({ severity: 'warn', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                }
            }, error => {
                this.errorHandler(error);
                });
        } else {
            return this.http.put<any>(this.url + '/api/agendamento/' + this.id, body, { headers: headers }).subscribe(data => {
                if (data.statusRetorno == 1) {
                    this.messageService.add({ severity: 'success', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                    setTimeout((router: Router) => {
                        this.router.navigate(["/agendamentos"]);
                    }, 2000);
                }
                else {
                    this.messageService.add({ severity: 'warn', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                }
            }, error => {
                this.errorHandler(error);
            });
        }
    }

    errorHandler(error: any): void {
        if (error.status == 401) {
            localStorage.removeItem("login");
            this.router.navigate(["/login"]);
        }
    }
}
export class Agendamento {
    constructor(id: number, medicoId: string, pacienteId: string, status: number,dataConsulta: Date) {
        this.Id = id;
        this.MedicoId = medicoId;
        this.PacienteId = pacienteId;
        this.Status = status;
        this.DataConsulta = dataConsulta;
    }

    Id: number;
    MedicoId: string;
    PacienteId: string;
    Status: number;
    DataConsulta: Date;
}
