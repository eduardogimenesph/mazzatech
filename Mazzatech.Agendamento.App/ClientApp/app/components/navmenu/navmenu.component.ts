import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent {

    constructor(public router: Router) {
  


    }

    sair() {
        localStorage.removeItem("login");
        this.router.navigate(["/login"]);
    }
}
