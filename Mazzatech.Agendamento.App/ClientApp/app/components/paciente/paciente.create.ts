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
    selector: 'pacienteCreate',
    templateUrl: './paciente.create.html',
    styleUrls: ['./paciente.create.scss'],
    providers: [MessageService]
})
export class PacienteCreateComponent implements OnInit {
    public model = new Paciente(0,"",new Date(),"","","","","",1);
    add: FormGroup;
    public url: string;
    id: number = 0;
    msgs: any[];
    pt: any;


    constructor(public messageService: MessageService, public routerActive: ActivatedRoute, public router: Router, public http: HttpClient, public fb: FormBuilder) {
        this.url = "http://mazzatechagendamentowebapi20180209011744.azurewebsites.net";
        this.msgs = [];
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
            'nome': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            'dataNascimento': [null],
            'telefone': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
            'celular': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
            'cpf': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(14)]],
            'email': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
            'enderecoCompleto': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]]
        });
    }



    cancelar() {
        this.router.navigate(["/pacientes"]);
    }

    salvar() {

        this.pacienteSubmit(this.model);
    }

    ngOnInit() {


        this.routerActive.params.subscribe(params => {
            this.id = +params['id'];
        });

        if (this.id > 0) {
            let login: any = localStorage.getItem("login");
            let token = JSON.parse(login).token;


            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
            this.http.get<any>(this.url + '/api/paciente/' + this.id, { headers: headers }).subscribe(data => {
                console.log(data);
                if (data.dados.length == 0) {
                    alert("Não encontramos o id");
                    this.router.navigate(["/pacientes"]);
                } else {
                    this.add = this.fb.group({
                        'nome': [data.dados[0].nome, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
                        'dataNascimento': [new Date(data.dados[0].dataNascimento)],
                        'telefone': [data.dados[0].telefone, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
                        'celular': [data.dados[0].celular, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
                        'cpf': [data.dados[0].cpf, [Validators.required, Validators.minLength(2), Validators.maxLength(14)]],
                        'email': [data.dados[0].email, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
                        'enderecoCompleto': [data.dados[0].enderecoCompleto, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]]
                    });
                    this.model = new Paciente(data.dados[0].id, data.dados[0].nome, new Date(data.dados[0].dataNascimento), data.dados[0].email, data.dados[0].enderecoCompleto, data.dados[0].cpf, data.dados[0].telefone, data.dados[0].celular, data.dados[0].status);
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

    pacienteSubmit(entidade: Paciente) {
        let login: any = localStorage.getItem("login");
        let token = JSON.parse(login).token;
        entidade.Status = 1;
        entidade.Id = this.id;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        let body = JSON.stringify(entidade);
        if (this.id == 0) {
            return this.http.post<any>(this.url + '/api/paciente', body, { headers: headers }).subscribe(data => {
                if (data.statusRetorno == 1) {
                    this.messageService.add({ severity: 'success', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                    setTimeout((router: Router) => {
                        this.router.navigate(["/pacientes"]);
                    }, 2000);
                }
                else {
                    this.messageService.add({ severity: 'warn', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                }
            }, error => {
                this.errorHandler(error);
                });
        } else {
            return this.http.put<any>(this.url + '/api/paciente/' + this.id, body, { headers: headers }).subscribe(data => {
                if (data.statusRetorno == 1) {
                    this.messageService.add({ severity: 'success', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                    setTimeout((router: Router) => {
                        this.router.navigate(["/pacientes"]);
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
export class Paciente {

    constructor(id: number, nome: string, dataNascimento: Date, email: string, enderecoCompleto: string, cpf: string, telefone: string, celular: string, status: number) {
        this.Id = id;
        this.Nome = nome;
        this.DataNascimento = dataNascimento;
        this.Email = email;
        this.EnderecoCompleto = enderecoCompleto;
        this.Cpf = cpf;
        this.Telefone = telefone;
        this.Celular = celular;
        this.Status = status;
    }

    Id: number;
    Nome: string;
    DataNascimento: Date;
    Email: string;
    EnderecoCompleto: string;
    Cpf: string;
    Telefone: string;
    Celular: string;
    Status: number;
}
