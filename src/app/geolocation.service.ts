import { Injectable } from '@angular/core';
import { PlaceLocation } from './logic/PlaceLocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  requestLocation(callback:any){
    // W3C Geolocation API
    navigator.geolocation.getCurrentPosition(
      position => {
        callback(position.coords);
      },
      error => {
        callback(null);
      }
    )
  }

  getMapLink(location:PlaceLocation) {
    let query = "";
    if (location.latitude){
      query = location.latitude + "," + location.longitude;
    } else {
      query = `${location.address}, ${location.city}`;
    }

    // universal link : a way to open native apps through an http(s) URL on a mobile phone
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)){
      return `https://maps.apple.com/?q=${query}`
    } else {
      return `https://maps.google.com/?q=${query}`
    }
    // Universal Link
    //  <a href="https://maps.google.com/?q=Eiffel+Tower">
    //  <a href="https://maps.apple.com/?q=33.44,56.44">
  }
}
