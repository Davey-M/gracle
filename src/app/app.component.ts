import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './services/storage/localStorage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gracle';

  constructor(private _storageService: LocalStorageService) { }

  ngOnInit(): void {
      this._storageService.getState();
  }
}
