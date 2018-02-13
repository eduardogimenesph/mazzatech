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
    selector: 'medicoCreate',
    templateUrl: './medico.create.html',
    styleUrls: ['./medico-create.scss'],
    providers: [MessageService]
})
export class MedicoCreateComponent implements OnInit {
    public modelMedico = new Medico(0,"","","","","",1);
    addMedico: FormGroup;
    public url: string;
    id: number = 0;
    msgs: any[];

    constructor(public messageService: MessageService, public routerActive: ActivatedRoute, public router: Router, public http: HttpClient, public fb: FormBuilder) {
        this.url = "http://mazzatechagendamentowebapi20180209011744.azurewebsites.net";
        this.msgs = [];
        this.addMedico = this.fb.group({
            'especialidade': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
            'crm': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
            'nome': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
            'telefone': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
            'celular': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]]
        });
    }

    cancelar() {
        this.router.navigate(["/medicos"]);
    }

    salvar() {
        this.medicoSubmit(this.modelMedico);
    }

    ngOnInit() {
     
        this.routerActive.params.subscribe(params => {
            this.id = +params['id'];
        });

        if (this.id > 0) {
            let login: any = localStorage.getItem("login");
            let token = JSON.parse(login).token;

            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            this.http.get<any>(this.url + '/api/medico/' + this.id, {headers: headers}).subscribe(data => {
                console.log(data);
                if (data.dados.length == 0) {
                    alert("Não encontramos o id");
                    this.router.navigate(["/medicos"]);
                } else {
                    this.modelMedico = new Medico(data.dados[0].id, data.dados[0].especialidade, data.dados[0].crm, data.dados[0].nome, data.dados[0].telefone, data.dados[0].celular, data.dados[0].status);
                    this.addMedico = this.fb.group({
                        'especialidade': [data.dados[0].especialidade, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
                        'crm': [data.dados[0].crm, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
                        'nome': [data.dados[0].nome, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
                        'telefone': [data.dados[0].telefone, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
                        'celular': [data.dados[0].celular, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]]
                    });

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

    medicoSubmit(medico: Medico) {
        let login: any = localStorage.getItem("login");
        let token = JSON.parse(login).token;
        medico.Status = 1;
        medico.Id = this.id;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        let body = JSON.stringify(medico);
        if (this.id == 0) {
            return this.http.post<any>(this.url + '/api/medico', body, { headers: headers }).subscribe(data => {
                if (data.statusRetorno == 1) {
                    this.messageService.add({ severity: 'success', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                    setTimeout((router: Router) => {
                        this.router.navigate(["/medicos"]);
                    }, 2000);
                }
                else {
                    this.messageService.add({ severity: 'warn', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                }
            }, error => {
                this.errorHandler(error);
                });
        } else {
            return this.http.put<any>(this.url + '/api/medico/' + this.id, body, { headers: headers}).subscribe(data => {
                if (data.statusRetorno == 1) {
                    this.messageService.add({ severity: 'success', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                    setTimeout((router: Router) => {
                        this.router.navigate(["/medicos"]);
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
export class Medico {
    constructor(id: number, especialidade: string, crm: string, nome: string, telefone: string, celular: string, status: number) {
        this.Id = id;
        this.Especialidade = especialidade;
        this.CRM = crm;
        this.Nome = nome;
        this.Telefone = telefone;
        this.Celular = celular;
        this.Status = status;
    }
    Id: number;
    Especialidade: string;
    CRM: string;
    Nome: string;
    Telefone: string;
    Celular: string;
    Status: number;
}
