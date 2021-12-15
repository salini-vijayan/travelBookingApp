import { PlaceLocation } from "./location.models";

export class Place {
  constructor (
    public id :string,
    public title :string,
    public description :string,
    public imageUrl :string,
    public price :number,
    public availableFromDate: Date,
    public availableToDate: Date,
    public userId : string,
    public location: PlaceLocation,
    public image: string
  ) {}
}
