import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { InfoModel } from '../model/info.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private uri = 'http://192.168.0.17/';

  constructor(private httpClient: HttpClient) { }


  getInfo(): Observable<InfoModel>{
    return this.httpClient.get<InfoModel>(this.uri + 'info')
  }

  getParams(): Observable<any>{
    return this.httpClient.get(this.uri + 'params')
  }

  postParam(body: string) {
    const headers = new HttpHeaders()
    .set('Content-Type', 'text/plain');
    console.log('fazendo o post com');
    console.log(body)
    return this.httpClient.post(this.uri + 'params', body, {headers}).subscribe( response => {
      console.log(response);
    } );
  }
}
