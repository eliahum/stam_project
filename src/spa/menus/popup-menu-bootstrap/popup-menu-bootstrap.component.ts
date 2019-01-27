import { Component, OnInit, Input } from '@angular/core';
import { MenuService, MenuItem } from '../../services/menu.service';

@Component({
  selector: 'spa-popup-menu-bootstrap',
  templateUrl: './popup-menu-bootstrap.component.html',
  styleUrls: ['./popup-menu-bootstrap.component.css']
})
export class PopupMenuBootstrapComponent implements OnInit {
  @Input() menu: Array<MenuItem>;
  constructor(private menuService: MenuService) { }

  ngOnInit() {
  }

}
