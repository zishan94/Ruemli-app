import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import firebase from 'firebase';
import { CheckinPage } from '../checkin/checkin.page';
import * as moment from 'moment'



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  Date: any = new Date();
  CheckinList = [];
  checkinForm: FormGroup;
  currentUser: any;
  persons = 0;
  personsarray = [];
  checkinTimearray:number[] = [];


  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder,
    public modalController: ModalController,
  ) {
  }


  ngOnInit() {
    this.currentUser = firebase.auth().currentUser;
    this.getData();
  }

  getData(){
    this.firebaseService.read_checkins().subscribe(data => {

      this.CheckinList = data.map(e => {
        return {
          id: e.payload.doc.id,
          Name: e.payload.doc.data()['Name'],
          Begleitung: e.payload.doc.data()['Begleitung'],
          DatumUhrzeit: moment(e.payload.doc.data()['DatumUhrzeit']).format('DD.MM.YYYY, HH:mm'),
          DatumUhrzeitISO: e.payload.doc.data()['DatumUhrzeit'],
          // Zeit: moment(e.payload.doc.data()['Zeit']).format('HH:mm'),
          Activity: e.payload.doc.data()['Activity'],
        };
      })
      this.CheckinList = this.CheckinList.sort((a, b) => -a.DatumUhrzeitISO.localeCompare(b.DatumUhrzeitISO))
      this.getPersons()
      this.checkinTime()
    });
  }

  RemoveRecord(rowID) {
    {this.firebaseService.delete_checkin(rowID);};
    {this.checkinTimearray = []};
    {this.getData();};
  }

  RemoveAllRecords(){
    for (var i = 0; i < this.CheckinList.length; i++) {
    this.firebaseService.delete_checkin(this.CheckinList[i].id)
  }
}
checkinTime() {

  for (var i = 0; i < this.CheckinList.length; i++) {
  {
    var a = moment(this.Date.toISOString());
    var b = moment(this.CheckinList[i].DatumUhrzeitISO);
    this.checkinTimearray.push(((a.diff(b) / 60000)));
    this.checkinTimearray = this.checkinTimearray.sort(function(a, b) {
      return a - b;
    });
  }
  };
}

getPersons(){
  {
    this.persons = 0;
    this.personsarray = [];
    this.checkinTimearray = []

  };
  {
    for (var i = 0; i < this.CheckinList.length; i++) {
    this.personsarray.push(parseInt(this.CheckinList[i].Begleitung))
  };
  };
  {
    this.persons = this.personsarray.reduce(function(a, b){
      return a + b;
  }, 0);
  };
  {
    this.persons = this.persons + this.CheckinList.length
  }

}


  async openModal() {
    const modal = await this.modalController.create({
      component: CheckinPage,
    });
    return await modal.present();
  }
}
