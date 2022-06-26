import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})
export class HomePage {

  public Waarde;

  constructor(public navCtrl: NavController) {


  }

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    getData(){
      this.Waarde = this.getRandomInt(1, 40);
    }

}
