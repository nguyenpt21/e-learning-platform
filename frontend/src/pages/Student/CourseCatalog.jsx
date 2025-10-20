"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Star } from "lucide-react";
import { CardCatalog } from "@/components/student/courses-catalog/CardCatalog";
import { useBreakpoint } from "@/hooks/useBreakpoint";


const courses = [
  {
    id: 1,
    title: "Intro to N8N Agents: Automate Work Effortlessly",
    instructor: "Yash Thakker",
    rating: 4.3,
    reviews: 964,
    price: 279000,
    originalPrice: 390000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "1 total hour",
    level: "All Levels",
    hasSubtitles: true,
    description:
      "Build Powerful & Scalable AI Agents in n8n without writing a single line of Code",
    learningPoints: [
      "Set up and configure an n8n environment for building AI agents either through cloud services or self-hosting",
      "Implement LLM-powered agents that can process information, make decisions, and take actions within automated workflows",
    ],
  },
  {
    id: 2,
    title: "Complete React Developer Course",
    instructor: "Sarah Johnson",
    rating: 4.7,
    reviews: 2341,
    price: 349000,
    originalPrice: 499000,
    image: "/aws-cloud.jpg",
    updated: "February 2025",
    duration: "12 hours",
    level: "Intermediate",
    hasSubtitles: false,
    description:
      "React from basics to advanced",
    learningPoints: [
      "Build modern React applications using functional components and hooks",
      "Implement state management with Context API and Redux",
      "Optimize React applications for production deployment",
    ],
  },
  {
    id: 3,
    title: "Python for Data Science & Machine Learning",
    instructor: "Dr. Michael Chen",
    rating: 4.8,
    reviews: 5672,
    price: 399000,
    originalPrice: 599000,
    image: "/aws-cloud.jpg",
    updated: "January 2025",
    duration: "20 total hours",
    level: "Beginner",
    hasSubtitles: true,
    description:
      "Learn Python programming and apply it to data analysis, visualization, and machine learning",
    learningPoints: [
      "Master Python fundamentals and data structures",
      "Analyze and visualize data using Pandas, NumPy, and Matplotlib",
      "Build machine learning models with scikit-learn",
    ],
  },
  {
    id: 4,
    title: "Full Stack Web Development Bootcamp",
    instructor: "Alex Martinez",
    rating: 4.6,
    reviews: 3421,
    price: 449000,
    originalPrice: 699000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "35 total hours",
    level: "All Levels",
    hasSubtitles: true,
    description:
      "Become a full-stack developer by learning HTML, CSS, JavaScript, Node.js, and MongoDB",
    learningPoints: [
      "Build responsive websites with HTML5, CSS3, and JavaScript",
      "Create RESTful APIs with Node.js and Express",
      "Work with databases using MongoDB and Mongoose",
    ],
  },
  {
    id: 5,
    title: "UI/UX Design Masterclass",
    instructor: "Emma Wilson",
    rating: 4.9,
    reviews: 1876,
    price: 299000,
    originalPrice: 449000,
    image: "/aws-cloud.jpg",
    updated: "February 2025",
    duration: "8 total hours",
    level: "Beginner",
    hasSubtitles: true,
    description:
      "Learn the principles of user interface and user experience design with hands-on projects",
    learningPoints: [
      "Understand design thinking and user-centered design principles",
      "Create wireframes and prototypes using Figma",
      "Conduct user research and usability testing",
    ],
  },
  {
    id: 6,
    title: "AWS Cloud Practitioner Certification",
    instructor: "James Anderson",
    rating: 4.5,
    reviews: 4123,
    price: 329000,
    originalPrice: 479000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "15 total hours",
    level: "Beginner",
    hasSubtitles: true,
    description:
      "Prepare for AWS Cloud Practitioner certification and learn cloud computing fundamentals",
    learningPoints: [
      "Understand AWS core services and cloud concepts",
      "Learn about AWS security and compliance",
      "Master AWS pricing and billing models",
    ],
  },
  {
    id: 7,
    title: "Advanced JavaScript ES6+",
    instructor: "David Kim",
    rating: 4.6,
    reviews: 2890,
    price: 319000,
    originalPrice: 459000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "10 total hours",
    level: "Advanced",
    hasSubtitles: true,
    description:
      "Deep dive into modern JavaScript features and advanced programming patterns",
    learningPoints: [
      "Master ES6+ features including async/await, destructuring, and modules",
      "Understand closures, prototypes, and the event loop",
      "Write clean, maintainable JavaScript code",
    ],
  },
  {
    id: 8,
    title: "Docker & Kubernetes Complete Guide",
    instructor: "Robert Taylor",
    rating: 4.7,
    reviews: 3567,
    price: 379000,
    originalPrice: 549000,
    image: "/aws-cloud.jpg",
    updated: "February 2025",
    duration: "18 total hours",
    level: "Intermediate",
    hasSubtitles: true,
    description:
      "Master containerization and orchestration with Docker and Kubernetes",
    learningPoints: [
      "Build and deploy containerized applications with Docker",
      "Orchestrate containers at scale using Kubernetes",
      "Implement CI/CD pipelines with containers",
    ],
  },
  {
    id: 9,
    title: "Digital Marketing Masterclass 2025",
    instructor: "Lisa Brown",
    rating: 4.4,
    reviews: 1923,
    price: 289000,
    originalPrice: 429000,
    image: "/aws-cloud.jpg",
    updated: "January 2025",
    duration: "14 total hours",
    level: "All Levels",
    hasSubtitles: true,
    description:
      "Learn digital marketing strategies including SEO, social media, and content marketing",
    learningPoints: [
      "Create effective digital marketing campaigns",
      "Master SEO and content marketing strategies",
      "Analyze marketing metrics and ROI",
    ],
  },
  {
    id: 10,
    title: "iOS App Development with Swift",
    instructor: "Kevin Zhang",
    rating: 4.8,
    reviews: 2456,
    price: 429000,
    originalPrice: 629000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "25 total hours",
    level: "Intermediate",
    hasSubtitles: true,
    description: "Build native iOS applications using Swift and SwiftUI",
    learningPoints: [
      "Master Swift programming language fundamentals",
      "Build user interfaces with SwiftUI",
      "Publish apps to the App Store",
    ],
  },
  {
    id: 11,
    title: "Cybersecurity Fundamentals",
    instructor: "Amanda White",
    rating: 4.5,
    reviews: 3234,
    price: 349000,
    originalPrice: 499000,
    image: "/aws-cloud.jpg",
    updated: "February 2025",
    duration: "16 total hours",
    level: "Beginner",
    hasSubtitles: true,
    description:
      "Learn essential cybersecurity concepts and practices to protect systems and data",
    learningPoints: [
      "Understand common security threats and vulnerabilities",
      "Implement security best practices",
      "Use security tools for threat detection",
    ],
  },
  {
    id: 12,
    title: "Blockchain & Cryptocurrency Course",
    instructor: "Thomas Lee",
    rating: 4.3,
    reviews: 1567,
    price: 399000,
    originalPrice: 579000,
    image: "/aws-cloud.jpg",
    updated: "January 2025",
    duration: "12 total hours",
    level: "Intermediate",
    hasSubtitles: true,
    description:
      "Understand blockchain technology and cryptocurrency fundamentals",
    learningPoints: [
      "Learn how blockchain technology works",
      "Understand cryptocurrency trading and investment",
      "Build simple smart contracts",
    ],
  },
  {
    id: 13,
    title: "Angular Complete Guide",
    instructor: "Maria Garcia",
    rating: 4.6,
    reviews: 2789,
    price: 339000,
    originalPrice: 489000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "22 total hours",
    level: "All Levels",
    hasSubtitles: true,
    description: "Master Angular framework from basics to advanced concepts",
    learningPoints: [
      "Build single-page applications with Angular",
      "Implement routing and state management",
      "Create reusable components and services",
    ],
  },
  {
    id: 14,
    title: "SQL & Database Design",
    instructor: "John Smith",
    rating: 4.7,
    reviews: 4123,
    price: 299000,
    originalPrice: 439000,
    image: "/aws-cloud.jpg",
    updated: "February 2025",
    duration: "11 total hours",
    level: "Beginner",
    hasSubtitles: true,
    description:
      "Learn SQL and database design principles for efficient data management",
    learningPoints: [
      "Write complex SQL queries",
      "Design normalized database schemas",
      "Optimize database performance",
    ],
  },
  {
    id: 15,
    title: "Machine Learning A-Z",
    instructor: "Dr. Sarah Park",
    rating: 4.9,
    reviews: 6234,
    price: 449000,
    originalPrice: 699000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "40 total hours",
    level: "Advanced",
    hasSubtitles: true,
    description:
      "Comprehensive machine learning course covering algorithms and practical applications",
    learningPoints: [
      "Implement various ML algorithms from scratch",
      "Work with real-world datasets",
      "Deploy ML models to production",
    ],
  },
  {
    id: 16,
    title: "Vue.js 3 Course",
    instructor: "Chris Johnson",
    rating: 4.5,
    reviews: 1890,
    price: 329000,
    originalPrice: 469000,
    image: "/aws-cloud.jpg",
    updated: "January 2025",
    duration: "13 total hours",
    level: "Intermediate",
    hasSubtitles: true,
    description:
      "Build modern web applications with Vue.js 3 and the Composition API",
    learningPoints: [
      "Master Vue.js 3 fundamentals and Composition API",
      "Build reactive user interfaces",
      "Integrate with backend APIs",
    ],
  },
  {
    id: 17,
    title: "Graphic Design Bootcamp",
    instructor: "Jennifer Lee",
    rating: 4.8,
    reviews: 2345,
    price: 319000,
    originalPrice: 459000,
    image: "/aws-cloud.jpg",
    updated: "February 2025",
    duration: "17 total hours",
    level: "Beginner",
    hasSubtitles: true,
    description:
      "Learn graphic design principles and master Adobe Creative Suite",
    learningPoints: [
      "Master Photoshop, Illustrator, and InDesign",
      "Understand color theory and typography",
      "Create professional design projects",
    ],
  },
  {
    id: 18,
    title: "DevOps Engineering Complete Course",
    instructor: "Michael Brown",
    rating: 4.6,
    reviews: 3456,
    price: 399000,
    originalPrice: 599000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "28 total hours",
    level: "Advanced",
    hasSubtitles: true,
    description: "Master DevOps practices, tools, and automation techniques",
    learningPoints: [
      "Implement CI/CD pipelines",
      "Automate infrastructure with Terraform",
      "Monitor and optimize system performance",
    ],
  },
  {
    id: 19,
    title: "Content Writing & Copywriting",
    instructor: "Rachel Green",
    rating: 4.4,
    reviews: 1678,
    price: 269000,
    originalPrice: 399000,
    image: "/aws-cloud.jpg",
    updated: "January 2025",
    duration: "9 total hours",
    level: "All Levels",
    hasSubtitles: true,
    description: "Learn to write compelling content and copy that converts",
    learningPoints: [
      "Write engaging blog posts and articles",
      "Create persuasive sales copy",
      "Master SEO writing techniques",
    ],
  },
  {
    id: 20,
    title: "Flutter & Dart Complete Guide",
    instructor: "Daniel Kim",
    rating: 4.7,
    reviews: 2890,
    price: 379000,
    originalPrice: 549000,
    image: "/aws-cloud.jpg",
    updated: "February 2025",
    duration: "24 total hours",
    level: "Intermediate",
    hasSubtitles: true,
    description: "Build cross-platform mobile apps with Flutter and Dart",
    learningPoints: [
      "Master Flutter widgets and layouts",
      "Implement state management solutions",
      "Deploy apps to iOS and Android",
    ],
  },
  {
    id: 21,
    title: "Excel for Data Analysis",
    instructor: "Patricia Wilson",
    rating: 4.5,
    reviews: 3123,
    price: 249000,
    originalPrice: 369000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "10 total hours",
    level: "Beginner",
    hasSubtitles: true,
    description: "Master Excel for business analytics and data visualization",
    learningPoints: [
      "Create advanced formulas and pivot tables",
      "Build interactive dashboards",
      "Analyze data with Excel tools",
    ],
  },
  {
    id: 22,
    title: "Game Development with Unity",
    instructor: "Steven Martinez",
    rating: 4.8,
    reviews: 4567,
    price: 429000,
    originalPrice: 629000,
    image: "/aws-cloud.jpg",
    updated: "January 2025",
    duration: "32 total hours",
    level: "All Levels",
    hasSubtitles: true,
    description: "Create 2D and 3D games using Unity game engine",
    learningPoints: [
      "Master Unity interface and C# scripting",
      "Implement game mechanics and physics",
      "Publish games to multiple platforms",
    ],
  },
  {
    id: 23,
    title: "Photography Masterclass",
    instructor: "Laura Anderson",
    rating: 4.9,
    reviews: 2234,
    price: 339000,
    originalPrice: 489000,
    image: "/aws-cloud.jpg",
    updated: "February 2025",
    duration: "15 total hours",
    level: "Beginner",
    hasSubtitles: true,
    description:
      "Learn professional photography techniques and post-processing",
    learningPoints: [
      "Master camera settings and composition",
      "Edit photos with Lightroom and Photoshop",
      "Build a professional portfolio",
    ],
  },
  {
    id: 24,
    title: "Business Analytics & Intelligence",
    instructor: "Richard Taylor",
    rating: 4.6,
    reviews: 1890,
    price: 369000,
    originalPrice: 529000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "19 total hours",
    level: "Intermediate",
    hasSubtitles: true,
    description:
      "Learn business analytics tools and data-driven decision making",
    learningPoints: [
      "Use Power BI and Tableau for visualization",
      "Perform statistical analysis",
      "Create business intelligence reports",
    ],
  },
  {
    id: 25,
    title: "Ethical Hacking & Penetration Testing",
    instructor: "Marcus Johnson",
    rating: 4.7,
    reviews: 3456,
    price: 449000,
    originalPrice: 679000,
    image: "/aws-cloud.jpg",
    updated: "January 2025",
    duration: "26 total hours",
    level: "Advanced",
    hasSubtitles: true,
    description:
      "Learn ethical hacking techniques and penetration testing methodologies",
    learningPoints: [
      "Perform security assessments and penetration tests",
      "Use hacking tools like Metasploit and Burp Suite",
      "Write professional security reports",
    ],
  },
  {
    id: 26,
    title: "Project Management Professional (PMP)",
    instructor: "Nancy White",
    rating: 4.5,
    reviews: 2678,
    price: 389000,
    originalPrice: 569000,
    image: "/aws-cloud.jpg",
    updated: "February 2025",
    duration: "21 total hours",
    level: "All Levels",
    hasSubtitles: true,
    description: "Prepare for PMP certification and master project management",
    learningPoints: [
      "Understand PMBOK framework and methodologies",
      "Manage project scope, time, and budget",
      "Lead teams and stakeholder communication",
    ],
  },
  {
    id: 27,
    title: "Artificial Intelligence Fundamentals",
    instructor: "Dr. James Chen",
    rating: 4.8,
    reviews: 5123,
    price: 459000,
    originalPrice: 699000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "30 total hours",
    level: "Intermediate",
    hasSubtitles: true,
    description: "Comprehensive introduction to AI concepts and applications",
    learningPoints: [
      "Understand AI algorithms and neural networks",
      "Build AI applications with Python",
      "Explore computer vision and NLP",
    ],
  },
  {
    id: 28,
    title: "Social Media Marketing Strategy",
    instructor: "Emily Davis",
    rating: 4.4,
    reviews: 1567,
    price: 279000,
    originalPrice: 419000,
    image: "/aws-cloud.jpg",
    updated: "January 2025",
    duration: "11 total hours",
    level: "Beginner",
    hasSubtitles: true,
    description: "Master social media marketing across all major platforms",
    learningPoints: [
      "Create engaging social media content",
      "Run effective ad campaigns",
      "Analyze social media metrics",
    ],
  },
  {
    id: 29,
    title: "TypeScript Complete Developer Guide",
    instructor: "Andrew Wilson",
    rating: 4.7,
    reviews: 3234,
    price: 329000,
    originalPrice: 479000,
    image: "/aws-cloud.jpg",
    updated: "February 2025",
    duration: "14 total hours",
    level: "Intermediate",
    hasSubtitles: true,
    description:
      "Master TypeScript for building scalable JavaScript applications",
    learningPoints: [
      "Understand TypeScript type system",
      "Build type-safe applications",
      "Integrate TypeScript with React and Node.js",
    ],
  },
  {
    id: 30,
    title: "Video Editing with Premiere Pro",
    instructor: "Jessica Brown",
    rating: 4.6,
    reviews: 2456,
    price: 319000,
    originalPrice: 469000,
    image: "/aws-cloud.jpg",
    updated: "March 2025",
    duration: "16 total hours",
    level: "All Levels",
    hasSubtitles: true,
    description: "Learn professional video editing with Adobe Premiere Pro",
    learningPoints: [
      "Master Premiere Pro interface and tools",
      "Edit videos with professional techniques",
      "Add effects, transitions, and color grading",
    ],
  },
];

const categories = [
  "Lập trình",
  "Kinh doanh",
  "Thiết kế",
  "Tiếp thị",
  "CNTT & Phần mềm",
  "Phát triển cá nhân",
  "Nhiếp ảnh",
  "Âm nhạc",
];

const levels = ["Mọi cấp độ", "Người mới bắt đầu", "Trung cấp", "Nâng cao"];

const priceRanges = [
  { label: "Miễn phí", value: "free" },
  { label: "Trả phí", value: "paid" },
  { label: "Dưới ₫300,000", value: "under-300k" },
  { label: "₫300,000 - ₫500,000", value: "300k-500k" },
];

const durationOptions = [
  { value: "0-1", label: "0–1 giờ", count: 25 },
  { value: "1-3", label: "1–3 giờ", count: 80 },
  { value: "3-6", label: "3–6 giờ", count: 41 },
  { value: "6-17", label: "6–17 giờ", count: 26 },
];

const languageOptions = [
  { value: "english", label: "English", count: 342 },
  { value: "vietnamese", label: "Tiếng Việt", count: 156 },
  { value: "spanish", label: "Español", count: 89 },
  { value: "french", label: "Français", count: 67 },
  { value: "german", label: "Deutsch", count: 54 },
  { value: "japanese", label: "日本語", count: 43 },
];

export function CoursesCatalog() {
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showMoreDurations, setShowMoreDurations] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);

  const COURSES_PER_PAGE = 16;
  const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const currentCourses = courses.slice(startIndex, endIndex);

  const breakpoint = useBreakpoint();

// Tự động tính số cột theo kích thước màn hình
const columns =
  breakpoint === "xl" || breakpoint === "2xl"
    ? 4
    : breakpoint === "lg"
    ? 3
    : breakpoint === "md"
    ? 2
    : 1;

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleLevel = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const togglePrice = (price) => {
    setSelectedPrices((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  const toggleDuration = (duration) => {
    setSelectedDurations((prev) =>
      prev.includes(duration)
        ? prev.filter((d) => d !== duration)
        : [...prev, duration]
    );
  };

  const toggleLanguage = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
        ))}
        {hasHalfStar && (
          <Star
            className="h-4 w-4 fill-orange-400 text-orange-400"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        )}
        {[...Array(5 - Math.ceil(rating))].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="h-4 w-4 fill-none text-orange-400"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-foreground">Tất cả các khóa học</h1>
          <p className="mt-2 text-muted-foreground">
            Khám phá bộ sưu tập khóa học toàn diện của chúng tôi
          </p>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0">
            <div className=" top-8 space-y-6">
              {/* Category */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Danh mục</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={category} className="text-sm font-normal">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

        

              {/* Video Duration */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Thời gian video</h3>
                <div className="space-y-2">
                  {durationOptions
                    .slice(0, showMoreDurations ? durationOptions.length : 3)
                    .map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`duration-${option.value}`}
                          checked={selectedDurations.includes(option.value)}
                          onCheckedChange={() => toggleDuration(option.value)}
                        />
                        <Label
                          htmlFor={`duration-${option.value}`}
                          className="text-sm font-normal"
                        >
                          {option.label}{" "}
                          <span className="text-muted-foreground">
                            ({option.count})
                          </span>
                        </Label>
                      </div>
                    ))}
                </div>
                {durationOptions.length > 3 && (
                  <button
                    onClick={() => setShowMoreDurations(!showMoreDurations)}
                    className="mt-2 text-sm font-medium text-[#098be4] hover:text-[#066ab3]"
                  >
                    {showMoreDurations ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>

              {/* Language */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Ngôn ngữ</h3>
                <div className="space-y-2">
                  {languageOptions
                    .slice(0, showMoreLanguages ? languageOptions.length : 3)
                    .map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`language-${option.value}`}
                          checked={selectedLanguages.includes(option.value)}
                          onCheckedChange={() => toggleLanguage(option.value)}
                        />
                        <Label
                          htmlFor={`language-${option.value}`}
                          className="text-sm font-normal"
                        >
                          {option.label}{" "}
                          <span className="text-muted-foreground">
                            ({option.count})
                          </span>
                        </Label>
                      </div>
                    ))}
                </div>
                {languageOptions.length > 3 && (
                  <button
                    onClick={() => setShowMoreLanguages(!showMoreLanguages)}
                    className="mt-2 text-sm font-medium text-[#098be4] hover:text-[#066ab3]"
                  >
                    {showMoreLanguages ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>

              {/* Level */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Cấp độ</h3>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={level}
                        checked={selectedLevels.includes(level)}
                        onCheckedChange={() => toggleLevel(level)}
                      />
                      <Label htmlFor={level} className="text-sm font-normal">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Giá</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div
                      key={range.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={range.value}
                        checked={selectedPrices.includes(range.value)}
                        onCheckedChange={() => togglePrice(range.value)}
                      />
                      <Label
                        htmlFor={range.value}
                        className="text-sm font-normal"
                      >
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Course Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
Hiển thị {startIndex + 1}-{Math.min(endIndex, courses.length)} trong tổng số {courses.length} kết quả
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Phổ biến</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
                  <SelectItem value="price-high">Giá: Cao đến Thấp</SelectItem>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentCourses.map((course, index) => (
                <CardCatalog
                  key={course.id}
                  course={course}
                  index={index}
                  columns={columns}// cột hiện tại ở breakpoint xl (tuỳ chỉnh)
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNumber = i + 1;
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
