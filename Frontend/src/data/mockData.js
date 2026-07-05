// Mock data for development - remove when connecting to real API

export const mockCategories = [
  { _id: "1", name: "Web Development", slug: "web-development" },
  { _id: "2", name: "Mobile Development", slug: "mobile-development" },
  { _id: "3", name: "Data Science", slug: "data-science" },
  { _id: "4", name: "Design", slug: "design" },
  { _id: "5", name: "Business", slug: "business" },
  { _id: "6", name: "Marketing", slug: "marketing" },
];

export const mockCourses = [
  /**
   * Paste one or more documents here
   */
  // {
  //     "title": "Complete React Developer Course",
  //     "slug": "complete-react-developer",
  //     "shortDescription": "Master React from scratch and build real-world applications",
  //     "description": "Learn React from the ground up. This comprehensive course covers everything from basic concepts to advanced patterns. Build multiple projects and become job-ready.",
  //     "category": {  "name": "Web Development", "slug": "web-development" },
  //     "level": "beginner",
  //     "price": 49.99,
  //     "published": true,
  //     "thumbnail": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
  //     "tags": ["react", "javascript", "frontend"],
  //     "studentsCount": 12500,
  //     "author": { "name": "John Smith", "email": "john@example.com "},
  // "sections": [{"title": "Getting Started"},
  //   {"lessons" : [
  //     { "title": "Introduction to React", "videoUrl": "", "duration": 15 },
  //     { "title": "Setting Up Your Environment", "videoUrl": "", "duration": 20 }
  //   ]},
  //   {"title": "Getting Started"},
  //   {"lessons" : [
  //     { "title": "Introduction to React", "videoUrl": "", "duration": 15 },
  //     { "title": "Setting Up Your Environment", "videoUrl": "", "duration": 20 }
  //   ]}

  // ],
  //     "createdAt": "new Date().toISOString()"
  //   }
  {
    _id: "1",
    title: "Complete React Developer Course",
    slug: "complete-react-developer",
    shortDescription:
      "Master React from scratch and build real-world applications",
    description:
      "Learn React from the ground up. This comprehensive course covers everything from basic concepts to advanced patterns. Build multiple projects and become job-ready.",
    category: { _id: "1", name: "Web Development", slug: "web-development" },
    level: "beginner",
    price: 49.99,
    published: true,
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    tags: ["react", "javascript", "frontend"],
    studentsCount: 12500,
    author: { name: "John Smith", email: "john@example.com" },
    sections: [
      {
        title: "Getting Started",
        lessons: [
          { title: "Introduction to React", videoUrl: "", duration: 15 },
          { title: "Setting Up Your Environment", videoUrl: "", duration: 20 },
        ],
      },
      {
        title: "React Fundamentals",
        lessons: [
          { title: "Components and JSX", videoUrl: "", duration: 25 },
          { title: "Props and State", videoUrl: "", duration: 30 },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Python for Data Science",
    slug: "python-data-science",
    shortDescription:
      "Learn Python programming for data analysis and machine learning",
    description:
      "Start your data science journey with Python. Learn pandas, numpy, matplotlib, and machine learning basics.",
    category: { _id: "3", name: "Data Science", slug: "data-science" },
    level: "intermediate",
    price: 59.99,
    published: true,
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
    tags: ["python", "data-science", "machine-learning"],
    studentsCount: 8900,
    author: { name: "Sarah Johnson", email: "sarah@example.com" },
    sections: [
      {
        title: "Python Basics",
        lessons: [
          { title: "Variables and Data Types", videoUrl: "", duration: 20 },
          { title: "Control Flow", videoUrl: "", duration: 25 },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "UI/UX Design Masterclass",
    slug: "ui-ux-design-masterclass",
    shortDescription: "Create beautiful user interfaces and experiences",
    description:
      "Learn the principles of great design. Master Figma, create wireframes, prototypes, and build a portfolio.",
    category: { _id: "4", name: "Design", slug: "design" },
    level: "beginner",
    price: 39.99,
    published: true,
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    tags: ["design", "ui", "ux", "figma"],
    studentsCount: 6700,
    author: { name: "Emily Chen", email: "emily@example.com" },
    sections: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Node.js Backend Development",
    slug: "nodejs-backend-development",
    shortDescription:
      "Build scalable backend applications with Node.js and Express",
    description:
      "Master server-side JavaScript. Learn Express, MongoDB, authentication, and REST API development.",
    category: { _id: "1", name: "Web Development", slug: "web-development" },
    level: "intermediate",
    price: 54.99,
    published: true,
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    tags: ["nodejs", "express", "backend", "mongodb"],
    studentsCount: 9200,
    author: { name: "Mike Wilson", email: "mike@example.com" },
    sections: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "React Native Mobile Apps",
    slug: "react-native-mobile-apps",
    shortDescription: "Build cross-platform mobile apps with React Native",
    description:
      "Create iOS and Android apps with a single codebase using React Native.",
    category: {
      _id: "2",
      name: "Mobile Development",
      slug: "mobile-development",
    },
    level: "advanced",
    price: 69.99,
    published: true,
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    tags: ["react-native", "mobile", "ios", "android"],
    studentsCount: 5400,
    author: { name: "Alex Brown", email: "alex@example.com" },
    sections: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "6",
    title: "Digital Marketing Fundamentals",
    slug: "digital-marketing-fundamentals",
    shortDescription: "Master SEO, social media, and online advertising",
    description:
      "Learn how to grow businesses online with proven digital marketing strategies.",
    category: { _id: "6", name: "Marketing", slug: "marketing" },
    level: "beginner",
    price: 44.99,
    published: true,
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    tags: ["marketing", "seo", "social-media"],
    studentsCount: 7800,
    author: { name: "Lisa Taylor", email: "lisa@example.com" },
    sections: [],
    createdAt: new Date().toISOString(),
  },
];
