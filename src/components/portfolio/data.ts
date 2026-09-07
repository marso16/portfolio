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

export const profile: Profile = {
  name: "Marcelino Keyrouz",
  title: "Software engineer & AI engineer",
  bio: "I build production systems end to end, from typed backends and infra to the model pipelines and agents that sit on top of them.",
  aboutParagraphs: [
    "I spend most of my time in the space between traditional software engineering and applied AI: designing the services, data pipelines, and infrastructure that make model-backed features reliable enough to run in production, then iterating on the models and prompts that sit on top of them. I care most about systems that are easy to reason about, test, and hand off.",
    "Most of what I build sits at the boundary between two worlds that don't always speak the same language: the reliability expectations of traditional backend engineering, and the empirical, iterative nature of working with models. I like closing that gap: writing evaluation harnesses instead of eyeballing outputs, treating prompts and pipelines as versioned artifacts, and building the kind of tooling that makes an AI feature boring to operate.",
  ],
  email: "marcelino.keyrouz16@gmail.com",
  github: "https://github.com/marso16",
  linkedin: "https://www.linkedin.com/in/marcelino-keyrouz-0182b224b/",
};

export type ExperienceEntry = {
  hash: string;
  date: string;
  role: string;
  company: string;
  description: string;
  type?: "work" | "education";
};

export const experience: ExperienceEntry[] = [
  {
    hash: "a3f9c1e",
    date: "April 2024  -  Present",
    role: "Software Developer",
    company: "Capital Banking Solutions",
    description:
      "I started as an Oracle PL/SQL Developer, where I focused on building interfaces and regulatory reporting solutions for clients. As I grew within the company and gained more experience, my focus shifted toward developing web services using Spring Boot. Later, I expanded my skill set into frontend development, working on projects with Angular, which allowed me to transition into a Full-Stack Developer role.",
  },
  {
    hash: "7d2b4aa",
    date: "August 2023  -  April 2024",
    role: "Oracle Developer",
    company: "Valoores",
    description:
      "I started my professional career at this company as a fresh graduate, with little knowledge of the professional world. This is where I built my foundation in Oracle PL/SQL and gained hands-on experience working on various projects for different clients, primarily focused on KYC and Regulatory Reporting.",
  },
  {
    hash: "0a4d2f1",
    date: "April 2023  -  July 2023",
    role: "Internship Trainee",
    company: "Creoshift",
    description:
      "I started my professional journey with a frontend development internship during my final year of my BSc. Working on real-world projects gave me valuable hands-on experience, where I developed my skills with Next.js and Tailwind CSS while building modern UI components and designs.",
  },
];

export const projects: Project[] = [
  {
    name: "nahr-ibrahim-watershed",
    language: "Python",
    languageColor: "#e7a445",
    description:
      "Testing AI Models for Climate-Resilient Rainfall–Runoff Modeling in the Nahr Ibrahim Watershed, Lebanon",
    impact: "Cut manual eval time from hours to minutes per model change.",
    tags: ["pytorch", "scikit-learn", "pandas", "geojson"],
    link: "https://github.com/marso16/nahr_ibrahim_watershed",
  },
  {
    name: "infra-as-code-templates",
    language: "TypeScript",
    languageColor: "#5fd4d0",
    description:
      "Reusable Terraform + CDK modules for standing up ML training and inference infrastructure on AWS.",
    impact: "Reduced new environment setup from days to under an hour.",
    tags: ["terraform", "aws", "cdk"],
    link: "https://github.com/marso16/suplr",
  },
  {
    name: "agent-router",
    language: "Python",
    languageColor: "#e7a445",
    description:
      "Lightweight orchestration layer for routing tasks between specialized LLM agents with fallback and cost controls.",
    impact:
      "Cut per-request cost by defaulting to smaller models without hurting p95 latency.",
    tags: ["fastapi", "langgraph", "redis"],
    link: "https://github.com/marso16",
  },
  {
    name: "realtime-dashboard",
    language: "TypeScript",
    languageColor: "#5fd4d0",
    description:
      "Streaming metrics dashboard for model training runs: live loss curves, GPU utilization, and alerting.",
    impact:
      "Caught training regressions same-day instead of after the run finished.",
    tags: ["qwik", "websockets", "d3"],
    link: "https://github.com/marso16",
  },
];

export const skills: SkillGroup[] = [
  { key: "languages", values: ["Python", "Java", "JavaScript", "Rust"] },
  {
    key: "ai_ml",
    values: [
      "PyTorch",
      "Tensorflow",
      "Scikit-learn",
      "RAG pipelines",
      "Fine-tuning",
    ],
  },
  {
    key: "web",
    values: [
      "Angular",
      "Nextjs",
      "Qwik",
      "HTML",
      "CSS (with major frameworks)",
    ],
  },
  {
    key: "databases",
    values: ["Oracle", "PostgreSQL", "MongoDB"],
  },
  { key: "infra", values: ["AWS", "Docker", "Kubernetes", "Jenkins"] },
  { key: "tools", values: ["Git", "GitHub", "Linux", "CI/CD"] },
];
