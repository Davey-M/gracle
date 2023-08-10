import { Component, OnInit } from '@angular/core';
import { StorageService } from './services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gracle';

  constructor(private _storageService: StorageService) { }

  ngOnInit(): void {
      this._storageService.getState();
  }
}
