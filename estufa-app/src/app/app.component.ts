import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RequestService } from './service/request.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  idInterval: any;
  
  constructor(private server: RequestService, ){}
  
  title = 'estufa-app';
  
  temperatura = 0;
  luminosidade = 0;
  humidade = 0;
  estado_lampada = 0;
  estado_cooler = 0;
  
  minLumens = '0';
	maxLumens = '0';
	maxTemperatura = '0';
	minTemperatura = '0';

  cardTemperatura = {
    title: 'Temperatura',
    info: this.temperatura + 'C°'
  }
  cardHumidade = {
    title: 'Humidade',
    info: this.humidade + '%'
  }
  cardLuminosidade = {
    title: 'Luminosidade',
    info: this.luminosidade + ' Lux'
  }
  cardLampadaEstado = {
    title: 'Lampada',
    info: this.estado_lampada == 1 ? 'Ligada' : 'Desligada' 
  }

  cardCoolerEstado = {
    title: 'Cooler',
    info: this.estado_cooler == 1 ? 'Ligado' : 'Desligado' 
  }

  
  atualizarInfo(){

    if(this.idInterval){
      clearInterval(this.idInterval);
    }

    this.getParams();

    this.server.getInfo().subscribe( (response) => {
      this.temperatura = response.temperatura;
      this.luminosidade = response.luminosidade;
      this.humidade = response.humidade;
      this.estado_lampada = response.lampada;
      this.estado_cooler = response.cooler;
    }, (erro: HttpErrorResponse) => {
      console.log(erro);
    });
    this.atualizarCard();
    this.idInterval = setInterval(() => {this.atualizarInfo(); }, 10 * 1000)

  }

  atualizarParametros(){
    let post =  this.minLumens + ',' + this.maxLumens + ',' + this.minTemperatura + ',' + this.maxTemperatura;
    console.log(post);
    this.server.postParam(post);


    setTimeout( () => {
      this.atualizarInfo();
    }, 2000);

  }


  atualizarCard(){
    this.cardTemperatura.info = this.temperatura + 'C°';
    this.cardHumidade.info = this.humidade + '%' ;
    this.cardLuminosidade.info = this.luminosidade + ' Lux';
    this.cardLampadaEstado.info = this.estado_lampada == 1 ? 'Ligada' : 'Desligada' ;
    this.cardCoolerEstado.info = this.estado_cooler == 1 ? 'Ligado' : 'Desligado' ;
  }


  getParams(){
    this.server.getParams().subscribe( response => {
      this.minLumens = response.min_lumens;
      this.maxLumens = response.max_lumens;
      this.maxTemperatura = response.max_temperatura;
      this.minTemperatura = response.min_temperatura;
  })
  }
  
  ngOnInit(): void {
    this.getParams();
    this.atualizarInfo();
  }

}



