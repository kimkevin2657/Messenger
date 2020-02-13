import { AfterContentInit, Component, Injector, NgZone, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { MapFilterComponent } from 'src/shared/modals/map-filter/map-filter.component';

declare var google: any;

/**
 * https://cloud.google.com/maps-platform/?apis=maps,routes,places
 * setup google maps, use google places to get place predictions base on user search
 * locate current user
 * tutorial https://www.joshmorony.com/location-select-page-with-google-maps-and-ionic/
 * google place photos https://developers.google.com/places/web-service/photos
 * google places search https://developers.google.com/maps/documentation/javascript/places
 * add markers and drawings https://developers.google.com/maps/documentation/javascript/overlays
 */
@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent extends Extender implements AfterContentInit {
  public map: any;
  public showMap: boolean = true;
  public GoogleAutocomplete: any;
  public autocompleteItems: any;
  public geocoder;
  public markers;
  public googlePlaces: any;
  public currentLocation: any;
  public placeMarkers: any[] = [];
  public infoWindows: any[] = [];
  public filter: {
    radius: number;
    type?: string;
    openNow?: boolean;
    zoom: number;
  } = {
    radius: 5000,
    zoom: 8
  };
  @ViewChild('mapElement', null) public mapElement: { nativeElement: any };
  public user: IUser;

  constructor(protected injector: Injector, private ngZone: NgZone, private geolocation: Geolocation, private authService: AuthService) {
    super(injector);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder();
    this.markers = [];
  }

  /** get users current position using geolocation plugin, instantiate map and set the users location as params
   * then instantiate google places with google map object
   */
  public async ngAfterContentInit() {
    this.currentLocation = await this.geolocation.getCurrentPosition();
    this.user = await this.authService.getUser();

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {
        lat: this.currentLocation.coords.latitude,
        lng: this.currentLocation.coords.longitude
      },
      zoom: 12
    });

    this.googlePlaces = new google.maps.places.PlacesService(this.map);
  }

  /** locate user by current location co-ord and drop a marker in user position */
  public findMe() {
    const marker = new google.maps.Marker({
      map: this.map,
      icon: { path: google.maps.SymbolPath.CIRCLE, scale: 5 },
      title: this.user.displayName || 'Me',
      position: {
        lat: this.currentLocation.coords.latitude,
        lng: this.currentLocation.coords.longitude
      }
    });
  }

  /** open filter modal to set filters for places search */
  public async openFilter() {
    const modal = await this.openModal(MapFilterComponent, this.filter, 'custom-modal');
    modal.present();
    modal.onDidDismiss().then((filter: any) => {
      this.filter = filter.data;
    });
  }

  /** get search query, build up a search object with data from filter and coords
   * use google nearby search to get data based on search criteria and save search data in autocompleteItems.
   * add market for all items found, if not query, clear autocompleteItems data and remove markets
   */
  public onSearch(query: string) {
    const searchConf = {
      name: query,
      radius: this.filter.radius,
      zoom: this.filter.zoom || 8,
      type: this.filter.type,
      openNow: this.filter.openNow,
      location: new google.maps.LatLng(this.currentLocation.coords.latitude, this.currentLocation.coords.longitude)
    };

    if (query && query.trim() !== '') {
      this.status = 'load';
      this.googlePlaces.nearbySearch(searchConf, (predictions: any) => {
        this.autocompleteItems = [];
        this.removeMarkers();
        this.ngZone.run(() => {
          predictions.forEach((prediction) => {
            prediction.images = this.getPhotos(prediction);
            this.autocompleteItems.push(prediction);
            this.addMarker(prediction);
          });
        });
        this.status = '';
      });
    } else {
      this.autocompleteItems = [];
      this.removeMarkers();
      return;
    }
  }

  /** use google places object to get place photos and return place photos url */
  public getPhotos(place: any) {
    const photos = place.photos;
    if (!photos) {
      return;
    }
    const imageUrls = [];
    photos.forEach((image) => {
      imageUrls.push(image.getUrl({ maxWidth: 1600, maxHeight: 1350 }));
    });
    return imageUrls;
  }

  /** Add marker to place */
  public addMarker(place) {
    this.infoWindows.push(this.infoWindow(place));

    this.placeMarkers.push(
      new google.maps.Marker({
        map: this.map,
        title: place.name,
        place: {
          placeId: place.place_id,
          location: place.geometry.location
        }
      })
    );
    this.placeMarkers.forEach((item, index) => {
      item.addListener('click', () => {
        this.infoWindows[index].open(this.map, item);
      });
    });
  }

  /** remove place markers */
  public removeMarkers() {
    if (this.placeMarkers && this.placeMarkers.length > 0) {
      this.placeMarkers.forEach((marker) => {
        marker.setMap(null);
      });
    }
  }

  /** configure an info window with place data */
  public infoWindow(place: any) {
    const contentString = `
      <h2>${place.name}</h2>
      <p>${place.vicinity}</p>
    `;
    return new google.maps.InfoWindow({
      content: contentString,
      enableEventPropagation: true
    });
  }
}
