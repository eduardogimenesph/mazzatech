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
    selector: 'usuarioCreate',
    templateUrl: './usuario.create.html',
    styleUrls: ['./usuario.create.scss'],
    providers: [MessageService]
})
export class UsuarioCreateComponent implements OnInit {
    public model = new Usuario(0, "", "", 1, "");
    add: FormGroup;
    public url: string;
    id: number = 0;
    msgs: any[];

    constructor(public messageService: MessageService, public routerActive: ActivatedRoute, public router: Router, public http: HttpClient, public fb: FormBuilder) {
        this.url = "http://mazzatechagendamentowebapi20180209011744.azurewebsites.net";
        this.msgs = [];
        this.add = this.fb.group({
            'login': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            'senha': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
            'nome': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]]
        });
    }

    cancelar() {
        this.router.navigate(["/usuarios"]);
    }

    salvar() {
        this.usuarioSubmit(this.model);
    }

    ngOnInit() {

        this.routerActive.params.subscribe(params => {
            this.id = +params['id'];
        });

        if (this.id > 0) {
            let login: any = localStorage.getItem("login");
            let token = JSON.parse(login).token;

            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });

            this.http.get<any>(this.url + '/api/usuario/' + this.id, { headers: headers }).subscribe(data => {
                console.log(data);
                if (data.dados.length == 0) {
                    alert("Não encontramos o id");
                    this.router.navigate(["/usuarios"]);
                } else {

                    this.add = this.fb.group({
                        'login': [data.dados[0].login, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
                        'senha': [null, [Validators.minLength(2), Validators.maxLength(150)]],
                        'nome': [data.dados[0].nome, [Validators.required, Validators.minLength(2), Validators.maxLength(300)]]
                    });
                    this.model = new Usuario(data.dados[0].id, data.dados[0].login, "", data.dados[0].status, data.dados[0].nome);
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

    usuarioSubmit(entidade: Usuario) {
        let login: any = localStorage.getItem("login");
        let token = JSON.parse(login).token;
        entidade.Status = 1;
        entidade.Id = this.id;
        //let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        //let options = new RequestOptions({ headers: headers });
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
        let body = JSON.stringify(entidade);
        if (this.id == 0) {
            return this.http.post<any>(this.url + '/api/usuario', body, { headers: headers }).subscribe(data => {
                if (data.statusRetorno == 1) {
                    this.messageService.add({ severity: 'success', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                    setTimeout((router: Router) => {
                        this.router.navigate(["/usuarios"]);
                    }, 2000);
                }
                else {
                    this.messageService.add({ severity: 'warn', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                }
            }, error => {
                this.errorHandler(error);
            });
        } else {
            return this.http.put<any>(this.url + '/api/usuario/' + this.id, body, { headers: headers }).subscribe(data => {
                if (data.statusRetorno == 1) {
                    this.messageService.add({ severity: 'success', summary: 'Mensagem Sistema', detail: data.mensagem[0] });
                    setTimeout((router: Router) => {
                        this.router.navigate(["/usuarios"]);
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
export class Usuario {
    constructor(id: number, login: string, senha: string, status: number, nome: string) {
        this.Id = id;
        this.Login = login;
        this.Senha = senha;
        this.Status = status;
        this.Nome = nome;
    }

    Id: number;
    Login: string;
    Senha: string;
    Status: number;
    Nome: string;
}
