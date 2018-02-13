import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService]
})
export class LoginComponent implements OnInit {
    public model: any;
    public modelLogin = new Login("","");
    public addLogin: FormGroup;
    public url: string;
    msgs: any[];

    constructor(public messageService: MessageService,public router: Router, public http: HttpClient, @Inject('BASE_URL') baseUrl: string, public fb: FormBuilder) {
        this.msgs = [];
        this.addLogin = this.fb.group({
            'usuario': [null, [Validators.required, Validators.minLength(2)]],
            'senha': [null, [Validators.required, Validators.minLength(2)]]
        });
        this.url = "http://mazzatechagendamentowebapi20180209011744.azurewebsites.net";
    }

    ngOnInit() {
   
        if (localStorage.getItem("login") != undefined) 
            this.router.navigate(["/agendamentos"]);
    }



    onSubmit() {
        this.loginSubmit(this.modelLogin);
    }


    loginSubmit(login: Login) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        //let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(login);
        this.http.post<any>(this.url + '/api/usuario/login', body, { headers: headers }).subscribe(result => {
            if (result.authenticated) {
                localStorage.setItem("login", JSON.stringify(result));
                this.router.navigate(["/agendamentos"]);
            } else {
                this.messageService.add({ severity: 'warn', summary: 'Mensagem Sistema', detail: "Não encontrado usuário cadastrado!" });
            }
        }, error => console.error(error));
        //return this.http.post(, body, options).map(res => res);
    }

}
export class Login {
    Usuario: string;
    Senha: string;

    constructor(usuario: string, senha: string) {
        this.Usuario = usuario;
        this.Senha = senha;
    }
  
}

