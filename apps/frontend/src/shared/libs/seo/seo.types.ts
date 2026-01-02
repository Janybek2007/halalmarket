export type MetaImage = {
  url: string;
  width?: number;
  height?: number;
  type?: string;
};

export type $MetaProps = {
  title?: string;
  description?: string;
  url?: string;
  applicationName?: string;
  image?: MetaImage;
};
