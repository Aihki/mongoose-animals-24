import { WikiImage } from "../types/WikiImage";


const getWikiImage = async (name: string): Promise<string> => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${name}&prop=pageimages&format=json&pithumbsize=640&formatversion=2`;
  const response = await fetch(url);
  const data = await response.json() as WikiImage;
  if (!data.query.pages[0].thumbnail) {
    throw new Error('No specie found');
  }
  const image = data.query.pages[0].thumbnail.source;
  return image;
}


export default getWikiImage ;

