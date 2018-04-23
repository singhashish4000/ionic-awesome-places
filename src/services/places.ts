import { Place } from "../models/place";
import { Location } from "../models/location";
import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";
import { File } from '@ionic-native/file';
import { Cordova, cordovaWarn } from "@ionic-native/core";
import { DeclareFunctionStmt } from "@angular/compiler";

declare var cordova: any;

@Injectable()

export class PlacesService {
    private places: Place[] = [];

    constructor(private storage: Storage,private toastCtrl:ToastController,private file: File) {

    }

    addPlace(title: string, description: string, location: Location, imageUrl: string) {
       const place = new Place(title, description,location,imageUrl);
       this.places.push(place);
       this.storage.set('places',this.places)
        .then(data => {
           const toast = this.toastCtrl.create({
               message:'Added Successfully!',
               duration: 1500,
           });
           toast.present();
         }
        )
        .catch(error => {
            this.places.splice(this.places.indexOf(place),1);
            const toast = this.toastCtrl.create({
                message:error,
                duration: 1500,
            });
            toast.present();
        });
    }

    loadPlaces() {
        return this.places.slice();
    }


    fetchPlaces() {
        return this.storage.get('places')
          .then(
            (places: Place[]) => {
              this.places = places != null ? places : [];
              return this.places;
            }
          )
          .catch(
            err => console.log(err)
          );
      }

    deletePlace(index: number) {
        const place = this.places[index];
        this.places.splice(index, 1);
        this.storage.set('places',this.places)
        .then(() =>
             {
                 this.removeFile(place);
             }  
        )
        .catch(error => {
           console.log(error)
        });

    }

    private removeFile(place: Place) {
        const currentName = place.imagePath.replace(/^.*[\\\/]/,'');
        this.file.removeFile(cordova.file.dataDirectory, currentName)
         .then(data =>  console.log('Removed'))
         .catch(error=> {
             console.log(error)
             this.addPlace(place.title,place.description,place.location,place.imagePath);   
        });
    }
}