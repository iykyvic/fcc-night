import { Component, OnInit, Input, EventEmitter, Output  } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  @Input() places;
  @Input() user;
  @Input() parentLoading = false;
  @Input() parentOffset;
  @Output() loadMore = new EventEmitter();
  loading = {};
  offset = 0;
  placeData = null;
  date = new Date();

  constructor(
    private _sanitizer: DomSanitizer,
    private _afs: AngularFirestore,
    public snackBar: MatSnackBar,
    public AfAuth: AngularFireAuth
  ) { }

  ngOnInit() {}

  getPeriod(date) {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  }

  getAddress(place) {
    const {
      address1 = '', address2 = '', address3 = '', city = '', country = ''
    } = place.location;

    return `${address1} ${address2} ${address3} ${city} ${country}`;
  }

  getImageStyle(place) {
    return this._sanitizer
      .bypassSecurityTrustStyle(`#ddd url(${place.image_url}) no-repeat right top`);
  }

  async indicateGoing(place, index, going) {
    try {
      this.loading[place.id] = true;
      const placeCollection = this._afs.doc(`places/${place.id}`);
      const userCollection = this._afs.doc(`users/${this.user.uid}/places/${place.id}`);
      await userCollection.set({ id: place.id,  [this.getPeriod(new Date())]: { going: !going } });
      const currentPlace = await placeCollection.ref.get();
      await placeCollection.set({ count: 0, id: place.id });
      if (!currentPlace.exists) {
        await placeCollection.set({ count: 0, id: place.id });
      } else {
        let count = currentPlace.data()['count'];
        if (!going) {
          count += 1;
        } else {
          count -= 1;
          if (count < 0) {
            count = 0;
          }
        }
        await placeCollection.update({ count });
      }
      this.loading[place.id] = false;
    } catch (error) {
      this.loading[place.id] = false;
      return this.snackBar.open('something went wrong', 'error', {
        duration: 3000,
      });
    }
  }

  login() {
    return this.AfAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loadBars(offset) {
    this.offset += offset;
    if (this.offset < 0) {
      this.offset = 0;
    }

    this.loadMore.emit(this.offset);
  }
}
