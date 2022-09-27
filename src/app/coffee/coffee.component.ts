import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { GeolocationService } from '../geolocation.service';
import { Coffee } from '../logic/Coffee';
import { TastingRating } from '../logic/TastingRating';

@Component({
  selector: 'app-coffee',
  templateUrl: './coffee.component.html',
  styleUrls: ['./coffee.component.sass']
})
export class CoffeeComponent implements OnInit, AfterViewInit {

  routingSubscription: any;
  coffee: Coffee = new Coffee();
  types = ["Espresso", "Ristretto", "Americano", "Cappuccino", "Frappe"];
  tastingEnabled: Boolean = false;

  constructor(private route: ActivatedRoute,
              private geolocation: GeolocationService,
              private router: Router,
              private data: DataService) { }

  ngOnInit(): void {
    this.geolocation.requestLocation((location:any)=> {
      if (location) {
        if(this.coffee.location){
          this.coffee.location.latitude = location.latitude;
          this.coffee.location.longitude = location.longitude;
        }
      }
    })
  }

  ngAfterViewInit() {
    this.routingSubscription = this.route.params.subscribe(params => {
      console.log(params["id"]);
      if(params["id"]) {
        this.data.get(params["id"], (response:any) => {
          const res = response
          this.coffee = response;
          if(Object.keys(res.tastingRating).some(item => res.tastingRating[item]>0)) {
            this.tastingEnabled = true;
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.routingSubscription.unsubscribe();
  }

  tastingRatingChanged(checked:boolean) {
    (checked)
      ? this.coffee.tastingRating = new TastingRating()
      : this.coffee.tastingRating = null;
  }

  cancel() {
    this.router.navigate(['/'])
  }

  save() {
    this.data.save(this.coffee, (result:any)=>{
      if(result) {
        this.router.navigate(['/'])
      }
    })
  }

}
