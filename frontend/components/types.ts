export interface Project {
  _id: string;
  projectId: string;
  images: string[];
  description: {
    az: string;
    en: string;
    ru: string;
  };
  title: {
    az: string;
    en: string;
    ru: string;
  };
  location: {
    az: string;
    en: string;
    ru: string;
  };
  area: number;
}
