import { StorageService } from "src/app/models/storage";
import { LocalStorageService } from "./localStorage/storage.service";

export function storageServiceFactory(): Promise<StorageService> {
  return new Promise<StorageService>(resolve => {
    resolve(new LocalStorageService());
  })
}

