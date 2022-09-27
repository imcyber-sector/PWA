import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush, SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'PWA';

  constructor(private snackBar: MatSnackBar,
              private ngswUpdate: SwUpdate,
              private ngswPush: SwPush) {

  }

  ngOnInit() {
    // Checking SW update Status
    this.ngswUpdate.versionUpdates.subscribe(evt => {
      switch(evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          const sb = this.snackBar.open("There is an update available", "Install Now", { duration: 4000 });
          sb.onAction().subscribe( () => {
            // Calling SwUpdate#activateUpdate() updates a tab to the latest version without reloading the page, 
            // but this could break the application.
            // this.ngsw.activateUpdate();

            // Reload the page to update to the latest version.
            console.log("The App was updated");
            
            document.location.reload();
          })
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
          break;
      }
    })
    this.ngswUpdate.checkForUpdate();

    // checking network status
    this.updateNetworkStatusUI();
    window.addEventListener("online", this.updateNetworkStatusUI);
    window.addEventListener("offline", this.updateNetworkStatusUI);

    // checking Installation status
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

  updateNetworkStatusUI() {
    if(navigator.onLine) {
      //you might be online
      (document.querySelector("body") as any).style = "";
    } else {
      // 100% Sure you are offline
      (document.querySelector("body") as any).style = "filter: grayscale(1)";
    }
  }

  subscribeToPush() {
    // For push notifications
    console.log("inside push to subscribe");
    
    Notification.requestPermission( permission => {
      console.log(permission);
      if(permission === "granted") {
        const sub = this.ngswPush.requestSubscription( {serverPublicKey: "PUBLIC_VAPID_KEY_OF_SERVER" });
        // TODO: Send to server.
        // this.ngswPush.subscription;
        // this.ngswPush.messages;
      }
    })
  }
}
