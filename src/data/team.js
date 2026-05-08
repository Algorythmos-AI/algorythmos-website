// src/data/team.js
// Note: role, tagline, and blurb use i18n keys like "team.{slug}.role"
// Components should use t(`team.${person.slug}.role`) to get translated text
export const TEAM = [
  {
    slug: "sam-kalaliya",
    name: "Sam Kalaliya",
    roleKey: "team.sam-kalaliya.role",
    taglineKey: "team.sam-kalaliya.tagline",
    blurbKey: "team.sam-kalaliya.blurb",
    links: {
      linkedin: "https://www.linkedin.com/in/samkalaliya/",
      x: "https://x.com/sam_kalaliya",
      github: "https://github.com/skalaliya",
    },
    // file expected at: src/assets/team/sam-kalaliya.jpg
    image: "sam-kalaliya.jpg",
  },
  {
    slug: "marcus-neural",
    name: "Marcus Neural",
    roleKey: "team.marcus-neural.role",
    taglineKey: "team.marcus-neural.tagline",
    blurbKey: "team.marcus-neural.blurb",
    links: {
      linkedin: "#",
      x: "#",
      github: "#",
    },
    image: "marcus-neural.jpg",
  },
  {
    slug: "elena-fusion",
    name: "Dr. Elena Fusion",
    roleKey: "team.elena-fusion.role",
    taglineKey: "team.elena-fusion.tagline",
    blurbKey: "team.elena-fusion.blurb",
    links: {
      linkedin: "#",
      x: "#",
      github: "#",
    },
    image: "elena-fusion.jpg",
  },
  {
    slug: "ali-algan",
    name: "Ali Algan",
    roleKey: "team.ali-algan.role",
    taglineKey: "team.ali-algan.tagline",
    blurbKey: "team.ali-algan.blurb",
    links: {
      linkedin: "https://www.linkedin.com/in/ali-ümit-algan/",
      x: "#",
      github: "#",
    },
    image: "ali-algan.png",
  },
];
