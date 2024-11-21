import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Municipio } from '../../../models/municipio.model';
import { MunicipioService } from '../../../services/municipio.service';

@Component({
  selector: 'app-municipio-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule
    , MatButtonModule, RouterModule],
  templateUrl: './municipio-list.component.html',
  styleUrl: './municipio-list.component.css'
})
export class MunicipioListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'estado', 'acao'];
  municipios: Municipio[] = [];

  totalRecords = 0;
  pageSize = 5;
  page = 0;

  constructor(private municipioService: MunicipioService) {

  }

  ngOnInit(): void {
    this.municipioService.findAll().subscribe(
      data => {
      this.municipios = data;
    })
  }

}
