import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { YelpService } from '../../services/yelp.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

export interface UserData {
  location: string;
  offset: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  search = new FormControl();
  loading = false;
  showSearch = true;
  user = null;
  userCollection: AngularFirestoreDocument<UserData> = null;
  location: string = null;
  offset = '0';
  places = null;

  constructor(
    private yelp: YelpService,
    private _afs: AngularFirestore,
    public AfAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.loading = true;
    this.AfAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.userCollection = this._afs.doc(`users/${user.uid}`);
        this.userCollection.valueChanges().subscribe(async (data) => {
          this.location = data.location;
          this.offset = data.offset;

          if (this.location) {
            const { businesses }  = await this.getPlaces(this.location, '6', data.offset);
            this.places = businesses;
            this._afs.collection(`users/${this.user.uid}/places`)
              .valueChanges()
              .subscribe((userPlaces) => {
                this.places = this.places.map((place) => {
                  const currentPlace = userPlaces
                    .filter(thePlace => thePlace['id'] === place.id)[0];
                  if (currentPlace && (place['id'] === currentPlace['id'])) {
                    place = { ...place,  currentPlace };
                  } else {
                    place = { ...place, currentPlace: {
                      id: place.id, [this.getPeriod(new Date())]: { going: false }
                    } };
                  }

                  return place;
                });
              });

            this._afs.collection('/places')
              .valueChanges()
              .subscribe((allPlaces) => {
                this.places = this.places.map((place) => {
                  const placeCount = allPlaces
                    .filter(thePlace => thePlace['id'] === place.id)[0];
                  if (placeCount && (place['id'] === placeCount['id'])) {
                    place = { ...place,  placeCount };
                  } else {
                    place = { ...place, placeCount: { id: place.id, count: 0 } };
                  }

                  return place;
                });
              });
            this.showSearch = false;
          }
          this.loading = false;
        });
      } else {
        this.loading = false;
        this.showSearch = true;
      }
    });
  }

  getPeriod(date) {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  }

  async getPlaces(address, limit = '6', offset = '0') {
    return await this.yelp.searchYelpPlaces(address, limit, offset).toPromise();
  }

  async searchYelp(location, limit = '6', offset = '0') {
    this.loading = true;
    const { businesses }  = await this.getPlaces(location, limit, offset);
    this.places = businesses;
    if (this.user) {
      await this.userCollection.set({ location, offset });
    }
    this.offset = offset;
    this.loading = false;
    this.showSearch = false;
  }

  async loadMore(offset) {
    return await this.searchYelp(this.location + ' ', '6', offset);
  }
}
