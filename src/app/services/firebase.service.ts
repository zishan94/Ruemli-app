import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

export interface User{
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  collectionName = 'Anwesenheit';
  currentUser: User = null;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) {
    this.afAuth.onAuthStateChanged(user => {
      console.log("Changed: ", user);
      this.currentUser = user;
    });
  }

  async signUp(email, password, realdisplayName) {
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    console.log("result: ", credential)
    const uid = credential.user.uid;

    credential.user.updateProfile({
      displayName: realdisplayName,
    }).then(function() {
      console.log("NEWresult: ", credential)
    }).catch(function(error) {
      // An error happened.
    });

    return this.firestore.doc(
      `users/${uid}`
    ).set({
      uid,
      email: credential.user.email,
    })
  }

  signIn({email, password}){
  return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(){
    return this.afAuth.signOut();
  }

  create_checkin(record) {
    return this.firestore.collection(this.collectionName).add(record);
  }

  read_checkins() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  // update_checkin(recordID, record) {
  //   this.firestore.doc(this.collectionName + '/' + recordID).update(record);
  // }

  delete_checkin(record_id) {
    this.firestore.doc(this.collectionName + '/' + record_id).delete();
  }
}
