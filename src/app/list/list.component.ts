import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { GeolocationService } from '../geolocation.service';
import { Coffee } from '../logic/Coffee';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  list: Coffee[] = [];

  constructor(private data: DataService,
              private router: Router,
              private geolocation: GeolocationService) { 
  }

  ngOnInit(): void {
    this.data.getList((list:any) => {
      this.list = list;
    })
  }

  goDetails(coffee:Coffee) {
    this.router.navigate(["/coffee", coffee._id]);
  }

  gotoMap(coffee: Coffee) {
    const mapURL = this.geolocation.getMapLink(coffee.location)
    location.href = mapURL;
  }

  share(coffee: Coffee) {
    const shareText = `I had this coffee at ${coffee.place} and for me it's a ${coffee.rating} star coffee.`;
    if ('share' in navigator) {
      navigator.share({
        title: coffee.name,
        text: shareText,
        url: window.location.href
      }).then( () => console.log("shared"))
        .catch( () => console.log("error sharing"));
    } else {
      const sharedURL = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
      location.href = sharedURL;
    }
  }

}
