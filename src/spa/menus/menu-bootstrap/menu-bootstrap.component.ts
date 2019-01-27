import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'spa-menu-bootstrap',
  templateUrl: './menu-bootstrap.component.html',
  styleUrls: ['./menu-bootstrap.component.css']
})
export class MenuBootstrapComponent implements OnInit {

  constructor(public menuService: MenuService) { }

  ngOnInit() {
  }

}
