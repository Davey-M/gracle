import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-handle-blank',
  templateUrl: './handle-blank.component.html',
  styleUrls: ['./handle-blank.component.css']
})
export class HandleBlankComponent implements OnInit {

  constructor(private _router: Router,
              private _storageService: StorageService) { }

  ngOnInit(): void {
    const dateString = this._storageService.getDateString();
    this._router.navigate([ 'date', dateString ]);
  }

}
