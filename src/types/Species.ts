import mongoose from "mongoose";
import { Point, Polygon } from "geojson";
import { Category } from "./Category";

type Species = {
  species_name: string;
  image: string;
  category: mongoose.Types.ObjectId | Category;
  location: Point;
};

type SpeciesModel = mongoose.Model<Species> & {
  findByCategory: (categoryId: mongoose.Types.ObjectId) => Promise<Species[]>;
  findByArea: (polygon: Polygon) => Promise<Species[]>;
};

export { Species, SpeciesModel };
