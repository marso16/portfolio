export interface Profile {
  name: string;
  title: string;
  bio: string;
  aboutParagraphs: string[];
  email: string;
  github: string;
  linkedin: string;
}

export interface Project {
  name: string;
  language: string;
  languageColor: string;
  description: string;
  impact: string;
  tags: string[];
  link: string;
}

export interface SkillGroup {
  key: string;
  values: string[];
}

export type ExperienceEntry = {
  hash: string;
  date: string;
  role: string;
  company: string;
  description: string;
  type?: "work" | "education";
};
