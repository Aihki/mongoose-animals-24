import mongoose from "mongoose";
import { Point } from "geojson"

type Species = {
  species_name: string;
  image: string;
  category: mongoose.Types.ObjectId;
  location: Point;
};


export { Species };
