import mongoose from 'mongoose';
import {Animal, AnimalModel} from '../../types/Animal';


const animalSchema = new mongoose.Schema<Animal>({
  animal_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  birthdate: {
    type: Date,
    required: true,
    max: Date.now(),
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

animalSchema.statics.findBySpecies = function (
  species_name: string,
): Promise<Animal[]> {
  return this.aggregate([
    {
      $lookup: {
        from: 'species',
        localField: 'species',
        foreignField: '_id',
        as: 'species',
      },
    },
    {$unwind: '$species'},
    {
      $lookup: {
        from: 'categories',
        localField: 'species.category',
        foreignField: '_id',
        as: 'species.category',
      },
    },
    {$unwind: '$species.category'},
    {
      $match: {
        'species.species_name': species_name,
      },
    },
    {
      $project: {
        __v: 0,
        'species.__v': 0,
        'species.category.__v': 0,
      },
    },
  ]);
};

animalSchema.index({location: '2dsphere'});

export default mongoose.model<Animal, AnimalModel>('Animal', animalSchema);
