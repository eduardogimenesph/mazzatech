import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
@Component({
    selector: 'medico',
    templateUrl: './medico.component.html',
    styleUrls: ['./medico.component.scss'],
    providers: [MessageService]
})
export class MedicoComponent implements OnInit {


    constructor(public messageService: MessageService, public router: Router, public http: HttpClient) {
        this.medicos = [];
        this.msgs = [];
        let login: any = localStorage.getItem("login");
        let token = JSON.parse(login).token;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        let body = JSON.stringify(login);

        this.http.get<any>('http://mazzatechagendamentowebapi20180209011744.azurewebsites.net/api/medico', { headers: headers }).subscribe(data => {
            console.log(data);
            this.medicos = data.dados;
        }, err => {
            if (err.status == 401) {
                localStorage.removeItem("login");
                this.router.navigate(["/login"]);
            }
        });
    }
    msgs: any[];
    medicos: any[];

    novoMedico() {
        this.router.navigate(["/medico/create/0"]);
    }

    remover(medico: any) {
        let login: any = localStorage.getItem("login");
        let token = JSON.parse(login).token;
        medico.Status = 0;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

        let body = JSON.stringify(medico);

        this.http.put<any>('http://mazzatechagendamentowebapi20180209011744.azurewebsites.net/api/medico/' + medico.id, body, { headers: headers }).subscribe(data => {
            this.messageService.add({ severity: 'success', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
            this.http.get<any>('http://mazzatechagendamentowebapi20180209011744.azurewebsites.net/api/medico', { headers: headers }).subscribe(data => {
                console.log(data);
                this.medicos = data.dados;
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

    editar(medico: any) {
        this.router.navigate(['/medico/create/', medico.id]);
    }

    ngOnInit() {
        if (localStorage.getItem("login") == undefined)
            this.router.navigate(["/login"]);


    }
}
