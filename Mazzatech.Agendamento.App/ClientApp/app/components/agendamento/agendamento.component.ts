import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
@Component({
    selector: 'agendamento',
    templateUrl: './agendamento.component.html',
    styleUrls: ['./agendamento.component.scss'],
    providers: [MessageService]
})
export class AgendamentoComponent implements OnInit {
    msgs: any[];
    constructor(public messageService: MessageService, public router: Router, public http: HttpClient) {
        this.agendamentos = [];
        this.msgs = [];
        let login: any = localStorage.getItem("login");
        let token = JSON.parse(login).token;

        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        let body = JSON.stringify(login);

        this.http.get<any>('http://mazzatechagendamentowebapi20180209011744.azurewebsites.net/api/agendamento', { headers: headers }).subscribe(data => {
            console.log(data);
            this.agendamentos = data.dados;
        }, err => {
            if (err.status == 401) {
                localStorage.removeItem("login");
                this.router.navigate(["/login"]);
            }
        });
    }
    agendamentos: any[];

    novo() {
        this.router.navigate(["/agendamento/create/0"]);
    }

    remover(agendamento: any) {
        let login: any = localStorage.getItem("login");
        let token = JSON.parse(login).token;
        agendamento.Status = 0;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        let body = JSON.stringify(agendamento);

        this.http.put<any>('http://mazzatechagendamentowebapi20180209011744.azurewebsites.net/api/agendamento/' + agendamento.id, body, { headers: headers}).subscribe(data => {
            this.messageService.add({ severity: 'success', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
            this.http.get <any>('http://mazzatechagendamentowebapi20180209011744.azurewebsites.net/api/agendamento', { headers: headers }).subscribe(data => {
                console.log(data);
                this.agendamentos = data.dados;
            }, err => {
                if (err.status == 401) {
                    localStorage.removeItem("login");
                    this.router.navigate(["/login"]);
                }
            });
        }, err => {
            if (err.status == 401) {
                localStorage.removeItem("login");
                this.router.navigate(["/login"]);
            }
        });
    }

    editar(agendamento: any) {
        this.router.navigate(['/agendamento/create/', agendamento.id]);
    }

    ngOnInit() {
        if (localStorage.getItem("login") == undefined)
            this.router.navigate(["/login"]);

     
    }
}
