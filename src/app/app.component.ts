import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { take, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UserFacade, Pagination, UserState } from './user.facade';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  showButton = true;
  searchTerm = new FormControl();
  vm$: Observable<UserState> = this.facade.vm$;

  constructor(public facade: UserFacade) { }

  ngOnInit() {
    this.facade.criteria$.pipe(take(1)).subscribe(criteria => {
      this.searchTerm.patchValue(criteria, { emitEvent: false });
    });

    this.searchTerm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => this.facade.updateSearchCriteria(value));
  }

  getPageSize() {
    this.showButton = false;
  }
}
