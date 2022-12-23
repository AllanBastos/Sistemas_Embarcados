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
  public temperatura = 0;
  public luminosidade = 0;
  public humidade = 0;
  public Estado_lampada = 0;
  
  idInterval: any;
  
  constructor(private server: RequestService, ){}

  title = 'estufa-app';

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
    info: this.Estado_lampada == 1 ? 'Ligada' : 'Desligada' 
  }

  
  atualizarInfo(){

    if(this.idInterval){
      clearInterval(this.idInterval);
    }

    this.server.getInfo().subscribe( (response) => {
      this.temperatura = response.temperatura;
      this.luminosidade = response.luminosidade;
      this.humidade = response.humidade;
      this.Estado_lampada = response.lampada;
    }, (erro: HttpErrorResponse) => {
      console.log(erro);
    });
    this.atualizarCard();
    this.idInterval = setInterval(() => {this.atualizarInfo(); }, 5 * 1000)

  }

  atualizarParametros(){
    let post =  this.minLumens + ',' + this.maxLumens + ',' + this.minTemperatura + ',' + this.maxTemperatura;
    console.log(post);
    this.server.postParam(post);

    this.getParams();

  }


  atualizarCard(){
    this.cardTemperatura.info = this.temperatura + 'C°';
    this.cardHumidade.info = this.humidade + '%' ;
    this.cardLuminosidade.info = this.luminosidade + ' Lux';
    this.cardLampadaEstado.info = this.Estado_lampada == 1 ? 'Ligada' : 'Desligada' ;
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



