export type UnsplashPhoto = {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
};

export type MonkeyImageType = {
  id: string
  url: string
  favorite: boolean
}