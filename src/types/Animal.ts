import { Point } from "geojson";
import { Model, Types } from "mongoose";
import { Species } from "./Species";

type Animal = {
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId | Species;
  location: Point;
};

 type AnimalModel = Model<Animal> & {
  findBySpecies: (species_name: string) => Promise<Animal[]>;
};


export { Animal, AnimalModel };
