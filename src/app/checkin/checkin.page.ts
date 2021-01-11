import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import firebase from 'firebase';
import * as moment from 'moment'

interface CheckinData {
  Name: string;
  Begleitung: string;
  DatumUhrzeit: string;
  Activity: string;
}


@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage implements OnInit {
  
  Date: any = new Date();
  CheckinList = [];
  checkinData: CheckinData;
  checkinForm: FormGroup;
  currentUser: any;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder,
    public modalController: ModalController
  ) {
    this.checkinData = {} as CheckinData;
  }


  ngOnInit() {
      this.currentUser = firebase.auth().currentUser
      this.checkinForm = this.fb.group({
      Name: [this.currentUser.displayName, [Validators.required]],
      Begleitung: ['0'],
      DatumUhrzeit: [this.Date.toISOString(), [Validators.required]],
      // Zeit: [this.Date.toISOString(), [Validators.required]],
      Activity: ['', [Validators.required]]
    })
  }

  CreateRecord() {
    this.firebaseService.create_checkin(this.checkinForm.value).then(resp => {
      this.checkinForm.reset();
    })
      .catch(error => {
        console.log(error);
      });
      this.dismissModal()
  }


  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
