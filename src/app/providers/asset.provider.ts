import { Injectable } from '@angular/core';
import { Asset } from '../model/asset';
import { FirestoreProvider } from './firestore.provider';

@Injectable()
export class AssetProvider extends FirestoreProvider<Asset> {
  constructor() {
    super('assets');
  }
}
