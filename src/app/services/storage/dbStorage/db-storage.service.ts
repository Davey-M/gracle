import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/models/storage';

const DATABASE_NAME = "gracle-db";

@Injectable({
  providedIn: 'root',
})
export class DbStorageService implements StorageService {

  db: IDBDatabase;

  constructor(db: IDBDatabase) {
    this.db = db;
  }
}

