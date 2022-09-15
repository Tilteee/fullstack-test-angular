import { Component, OnInit, SimpleChanges } from '@angular/core';

import { catchError } from 'rxjs/operators';

import { ApiService } from '../services/api.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-pagina',
  templateUrl: './pagina.component.html',
  styleUrls: ['./pagina.component.scss']
})
export class PaginaComponent{

  checkoutForm = this.formBuilder.group({
    text: '',
  });

  public apiGreeting = '';
  public nowTime = '';
  public text = '';
  private gettingApiData = new BehaviorSubject<boolean>(false)  ;
  public isGettingApiData$ = this.gettingApiData.asObservable();

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ){}

  async ngOnInit(): Promise<any> {
    await this.getHello()
    await this.getNow()
  }
  getHello(){
    this.gettingApiData.next(true)
    this.apiService.getHello().pipe(
      catchError((err) => {
        this.apiGreeting = 'Falha na comunicação com o servidor.';
        this.gettingApiData.next(false)
        return [];
      })
    ).subscribe((response) => {
      if (response) {
        this.apiGreeting = response.mensagem;
        this.gettingApiData.next(false)

      }
    });
  }

  getNow(){
    this.gettingApiData.next(true)
    this.apiService.getNow().subscribe((response) => {
      if (response) {
        var date = new Date(response.horaAtual);
        this.nowTime = date.toLocaleDateString();
        this.gettingApiData.next(false)
      }(
      catchError((err) => {
        this.nowTime = 'Não foi possível buscar a data atual.';
        this.gettingApiData.next(false)
        return err;
      })
    )
    });
  }

  onSubmit(): void {
    this.gettingApiData.next(true)
    this.apiService.sendText(this.checkoutForm.value.text).subscribe((response) => {
      if(response){
        this.text = response.text;
        this.gettingApiData.next(false)
      }(
        catchError((err) => {
          this.text = 'Problema de comunicação com a api';
          this.gettingApiData.next(false)
          return err;
        })
      )
    });
  }
}
