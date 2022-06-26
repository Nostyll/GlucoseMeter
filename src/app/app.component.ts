import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Insomnia } from '@ionic-native/insomnia';
import { Http, Headers, RequestOptions } from '@angular/http';
import {AlertController, Platform} from "ionic-angular";

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private device: Device,
              private push: Push,
              private nfc: NFC,
              private ndef: Ndef,
              private alertCtrl: AlertController,
              private insomnia: Insomnia,
              private http: Http) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.insomnia.keepAwake()
        //  .then(
          //    () => console.log('keepAwake: success'),
            //  () => console.log('keepAwake: error')
          //);

      this.pushControle();

      this.readNFCNdefListener();
      console.log(this.fromHex("0xb0810000c006b081"));
    });

  }


  fromHex(s){
  var start = 0;
  var o = "";

  if( s.substr(0,2) == "0x" ){ start = 2; }

  if( typeof s != "string" ){ s = s.toString(); }
  for( var i=start; i<s.length; i+=2 ){
    var c = s.substr( i, 2 );

    o = o + String.fromCharCode( parseInt(c, 16) );
  }

  return o;
}

  readNFCNdefListener():void {
    //this.vibration.vibrate(100);
    this.nfc.addNdefFormatableListener().subscribe((tagEvent) => this.tagListenerSuccess(tagEvent));
    this.nfc.addNdefListener().subscribe((tagEvent) => this.tagListenerSuccess(tagEvent));
    this.nfc.addTagDiscoveredListener().subscribe((tagEvent:Event) => this.tagListenerSuccess(tagEvent));

  }

  tagListenerSuccess(tagEvent) {
    console.log(tagEvent.type);
    //console.log("Ceci est un putain de ndef : " + tagEvent);
    let confirmAlert = this.alertCtrl.create({
      title: 'Gevonden!',
      message: 'Wij hebben glucosewaarde gevonden!',
      buttons: [{
        text: 'cancel',
        role: 'cancel'
      }, {
        text: 'oke',
        handler: () => {
          //TODO: Your logic here
          //this.nav.push(DetailsPage, {message: data.message});
        }
      }]
    });
    confirmAlert.present();

  }

  pushControle():void{

    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }

    // to check if we have permission
    this.push.hasPermission()
        .then((res: any) => {

          if (res.isEnabled) {
            console.log('We have permission to send push notifications');
          } else {
            console.log('We do not have permission to send push notifications');
          }

        });
    const options: PushOptions = {
      android: {
        senderID: "322040153701"
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true"
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      //console.log("device token -> " + data.registrationId);
      this.registerpushuser(data);
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log(data.message);
      console.log(data.title);
      console.log(data.count);
      console.log(data.sound);
      console.log(data.image);
      let json = JSON.parse(JSON.stringify(data.additionalData));
      for (const key of Object.keys(json)) {
        console.log(key + json[key]);
      }
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              //this.nav.push(DetailsPage, {message: data.message});
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        //this.nav.push(DetailsPage, {message: data.message});
        console.log("Push notification clicked");
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  registerpushuser(userinfo):void{
    var link = 'http://nostyll.citadelcraft.com/register.php';
    var username = 'johnno';

    let obj = JSON.stringify({
      token: userinfo,
      username: username
    });
    let headers = new Headers({
      "Content-type" : "application/x-www-form-urlencoded; charset=UTF-8",
    });
    let options = new RequestOptions({ headers: headers, method: "post" });
    this.http
        .post(link, obj, options)
        .subscribe(
            data => {
              //Response is stored in variable data. Choose what to do at your will
              let json = JSON.parse(JSON.stringify(data));
              for (const key of Object.keys(json)) {
                console.log("Key -> " + key +" || " + "DATA -> "+ json[key]);
              }
              //console.log(data);
            },err => {
              console.log("error" + err);
            }
        );

}



}
