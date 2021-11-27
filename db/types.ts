import Datastore from 'nedb';

export type VehicleClassType = number;

export type PlayerInDB = {
  name: string,
  waitTime: number,
  vehicleCLass: VehicleClassType,
}

export type DB = {
  lobby?: Datastore<PlayerInDB>,
}

export type Config = {
  [key in keyof DB]-?: string
}
