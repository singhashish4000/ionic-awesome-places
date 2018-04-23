import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PlacesService } from '../../services/places';
import { File } from '@ionic-native/file';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };

  locationIsSet = false;
  imageUrl = '';

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private camera: Camera,
    private file: File,
    private placesService: PlacesService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlacePage');
  }

  onSubmit(form: NgForm) {
    console.log(form);
    this.placesService
    .addPlace(form.value.title,form.value.description,this.location,this.imageUrl);
    form.reset();
    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    };
    this.imageUrl = '';
    this.locationIsSet = false;
  }

  onOpenMap() {
    console.log('aa');
     const modal = this.modalCtrl.create(SetLocationPage, { location: location, isSet: this.locationIsSet});
     modal.present(); 
     modal.onDidDismiss(data => {
        if(data) {
          this.location = data.location,
          this.locationIsSet = true
        }
     });
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Getting your location',
    });
    loader.present();
    this.geolocation.getCurrentPosition()
    .then(location => {
      loader.dismiss();
      this.location.lat = location.coords.latitude;
      this.location.lng = location.coords.longitude;
      this.locationIsSet = true;
    })
    .catch(error => {
      loader.dismiss();
      const toast = this.toastCtrl.create({
        message: error.message,
        duration:2500,
      })      
      toast.present();
    });
  }

  onTakePhoto() {
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
      .then(
        imageData => {
          const currentName = imageData.replace(/^.*[\\\/]/, '');
          const path = imageData.replace(/[^\/]*$/, '');
          const newFileName = new Date().getUTCMilliseconds() + '.jpg';
          this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
            .then(
              (data) => {
                console.log('saved');
                console.log(data.nativeURL);
                this.imageUrl = data.nativeURL;
                this.camera.cleanup();
                // File.removeFile(path, currentName);
              }
            )
            .catch(
              (err) => {
                console.log('Error'+err);
                this.imageUrl = '';
                const toast = this.toastCtrl.create({
                  message: 'Could not save the image. Please try again',
                  duration: 2500
                });
                toast.present();
                this.camera.cleanup();
              }
            );
            console.log(this.im)
          this.imageUrl = imageData;
        }
      )
      .catch(
        err => {
          console.log(err);
          const toast = this.toastCtrl.create({
            message: 'Could not take the image. Please try again',
            duration: 2500
          });
          toast.present();
        }
      );
  }

}
