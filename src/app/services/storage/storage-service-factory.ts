import { StorageService } from "src/app/models/storage";
import { LocalStorageService } from "./localStorage/storage.service";

export function storageServiceFactory(): StorageService {
  return new LocalStorageService();
}

