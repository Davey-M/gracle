import { iStorageService:w } from "src/app/models/storage";
import { LocalStorageService } from "./localStorage/storage.service";

export function storageServiceFactory(): Promise<iStorageService> {
  return new Promise<iStorageService:w>(resolve => {
    resolve(new LocalStorageService());
  })
}

