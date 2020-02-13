import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Extender } from 'src/shared/helpers/extender';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent extends Extender implements OnInit {
  /** capture user search data */
  public search: Subject<string> = new Subject<string>();

  /** emit event */
  @Output() public event: EventEmitter<any> = new EventEmitter<any>();
  public hasValue: boolean;

  constructor(protected injector: Injector) {
    super(injector);
  }

  /** subscribe to search events */
  public ngOnInit(): void {
    this._searchSubscription();
  }

  /** clear search input and send empty string */
  public clearSearch(input: { value: string }): void {
    this.search.next('');
    input.value = '';
  }

  /** subscribe to search input changes */
  private _searchSubscription(): void {
    this.subscriptions.push(
      this.search
        .pipe(
          map((value) => value),
          debounceTime(600),
          distinctUntilChanged()
        )
        .subscribe((searchPhrase) => {
          if (searchPhrase && searchPhrase.trim() !== '') {
            this.hasValue = true;
          } else {
            this.hasValue = false;
          }

          this.event.next(searchPhrase);
        })
    );
  }
}
