type Normalized = {
  fromencoded: boolean;
  from: string;
  to: string;
};

type Thumbnail = {
  source: string;
  width: number;
  height: number;
};

type Page = {
  pageid: number;
  ns: number;
  title: string;
  thumbnail: Thumbnail;
  pageimage: string;
};

type Query = {
  normalized: Normalized[];
  pages: Page[];
};

type WikiImage = {
  batchcomplete: boolean;
  query: Query;
};

export { WikiImage };
