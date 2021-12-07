import { Injectable } from '@angular/core';
import { Place } from './places.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places : Place[] = [
    new Place('p1',
    'Munnar',
    "Munnar is a town in the Western Ghats mountain range in India’s Kerala state. A hill station and former resort for the British Raj elite, it's surrounded by rolling hills dotted with tea plantations established in the late 19th century. Eravikulam National Park, a habitat for the endangered mountain goat Nilgiri tahr, is home to the Lakkam Waterfalls, hiking trails and 2,695m-tall Anamudi Peak",
    'https://upload.wikimedia.org/wikipedia/commons/a/ad/Munnar_hillstation_kerala.jpg',
    202.25),
    new Place('p2',
    'Agra',
    "Agra is a city on the banks of the Yamuna river in the Indian state of Uttar Pradesh, about 210 kilometres south of the national capital New Delhi and 335km west of the state capital Lucknow.",
    'https://upload.wikimedia.org/wikipedia/commons/e/ed/Taj_Mahal_in_India.jpg',
    525.85),
    new Place('p3',
    'Manali',
    "Manali is a town in the Indian state of Himachal Pradesh.[2] It is situated in the northern end of the Kullu Valley, formed by the Beas River. The town is located in the Kullu district, approximately 270 kilometres (170 mi) north of the state capital of Shimla and 544 kilometres (338 mi) northeast of the national capital of Delhi. With a population of 8,096 people recorded in the 2011 Indian census Manali is the beginning of an ancient trade route through Lahaul and Ladakh, over the Karakoram Pass and onto Yarkand and Hotan in the Tarim Basin of China. Manali is a popular tourist destination in India and serves as the gateway to the Lahaul and Spiti district as well as the city of Leh in Ladakh.",
    'https://upload.wikimedia.org/wikipedia/commons/0/03/Manali_City.jpg',
    1025)
  ];

  constructor() { }

  get places(){
    return [...this._places]
  }

  getPlace(id:string) {
    // ... extracts all properties of the object
    return {...this._places.find(place => place.id === id)}
  }

}
