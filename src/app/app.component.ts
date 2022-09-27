import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'PWA';

  constructor(private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    if ((navigator as any).standalone === false) {
      /*
      * if (navigator.standalone) {
      * navigator.standalone is used to identify the mode(fullscreen means installed or it's opened in browser) in iOS.
      * standalone is non standard property in JS and that's why we are receiving error that works only on iOS that 
      * will give us a boolean. True means standalone mode and false means we are inside a browser.
      * 
      * On non iOS devices such as Android or desktop computers, this will give us undefined.
      */

      //  So if we reach here that means it's an iOS device and the app is opened in a browser.
      this.snackBar.open("You can add this PWA to the Home Screen", null, { duration: 3000 });
    }

    if ((navigator as any).standalone === undefined) {
      // It's not iOS
      if(window.matchMedia("display-mode: browser").matches) {
        //  We are in the browser
        //  We don't have a means to find which device it is among android and desktop. So we need to use matchMedia query 
        //  which basically matches the css media query
        window.addEventListener("beforeinstallprompt", event => {
          event.preventDefault(); // abort the banner before it's shown
          const sb = this.snackBar.open("Do you want to install this App?", "Install", { duration: 5000 });
          sb.onAction().subscribe( () => {
            (event as any).prompt();
            (event as any).userChoice.then((result:any) => {
              if (result.outcome === "dismissed") {
                // TODO: Track no installation
              } else {
                // TODO: It was installed
              }
            })
          })
          return false;
        })
      }
    }
  }
}
