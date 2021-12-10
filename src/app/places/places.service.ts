import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Place } from './places.model';


interface PlaceData {
  availableFromDate: string;
  availableToDate: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionic-angular-49c28-default-rtdb.firebaseio.com/offeredPlace/${id}.json`
      )
      .pipe(
        map((placeData) => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFromDate),
            new Date(placeData.availableToDate),
            placeData.userId
          );
        })
      );
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://ionic-angular-49c28-default-rtdb.firebaseio.com/offeredPlace.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFromDate),
                  new Date(resData[key].availableToDate),
                  resData[key].userId
                )
              );
            }
          }
          return places;
        }),
        tap((place) => {
          this._places.next(place);
        })
      );
  }

  addPlaces(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://upload.wikimedia.org/wikipedia/commons/a/ad/Munnar_hillstation_kerala.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http
      .post<{ name: string }>(
        'https://ionic-angular-49c28-default-rtdb.firebaseio.com/offeredPlace.json',
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );

    /* to get the current array of data and
    to add add newly added data we use */
    /* delay provides adelay for observables,
    where settimeout won't work becoz subscribe will
    trigger before that */

    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(id: string, title: string, description: string) {
    let updatedPlace: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatePlaceIndex = places.findIndex((pl) => pl.id === id);
        updatedPlace = [...places];
        const oldPlaces = updatedPlace[updatePlaceIndex];
        updatedPlace[updatePlaceIndex] = new Place(
          oldPlaces.id,
          title,
          description,
          oldPlaces.imageUrl,
          oldPlaces.price,
          oldPlaces.availableFromDate,
          oldPlaces.availableToDate,
          oldPlaces.userId
        );
        return this.http.put(
          `https://ionic-angular-49c28-default-rtdb.firebaseio.com/offeredPlace/${id}.json`,
          {
            ...updatedPlace[updatePlaceIndex],
            id: null,
          }
        );
      }),
      tap(() => {
        this._places.next(updatedPlace);
      })
    );
  }
}
