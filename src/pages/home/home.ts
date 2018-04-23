import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';
import { Place } from '../../models/place';
import { PlacesService } from '../../services/places';
import { PlacePage } from '../place/place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  addPlacePage = AddPlacePage;
  places :Place[] = [];

  constructor(public navCtrl: NavController,
    private placeService: PlacesService, 
    private modalCtrl: ModalController) {

  }

  ngOnInit() {
    this.placeService.fetchPlaces().then(
      (places: Place[]) => this.places = places
    );
  }

  ionViewWillEnter() {
    this.places = this.placeService.loadPlaces();
  }

  onOpenPlace(place: Place,index: number) {
    console.log(place.imagePath);
    const modal = this.modalCtrl.create(PlacePage, {place: place, index: index});
    modal.present();
    modal.onDidDismiss(
      () => {
        this.places = this.placeService.loadPlaces();
      }
    );
  }
  }


