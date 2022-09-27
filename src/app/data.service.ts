import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coffee } from './logic/Coffee';
import { PlaceLocation } from './logic/PlaceLocation';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  public endPoint = "http://localhost:3000"

  getList(callback:any) {
    // const list = [
    //   new Coffee('Double Espresso', 'Sunny Cafe', new PlaceLocation("123 MArket St", 'San Francisco')),
    //   new Coffee('Caramel Americano', 'Starcoffee', new PlaceLocation('Gran Via 34', 'Madrid')),
    // ];
    // callback(list);
    this.http.get(`${this.endPoint}/coffees`).subscribe((data:any) => {
      callback(data);
    })
  }

  get(coffeeId:string, callback:any){
    this.http.get(`${this.endPoint}/coffees/${coffeeId}`).subscribe((res:any) => {
      callback(res);
    })
  }

  save(coffee:Coffee, callback:any) {
    // TODO : Cjange it with a real web service
    if(coffee._id) {
      //it's an update
      this.http.put(`${this.endPoint}/coffees/${coffee._id}`, coffee)
        .subscribe(response => {
          callback(true);
        });
    } else {
      //It's an insert
      this.http.post(`${this.endPoint}/coffees`, coffee)
        .subscribe(response => {
          callback(true);
        })
    }
  }
}
