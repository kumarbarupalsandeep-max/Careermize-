import heroStudioImg from '../assets/images/hero_careermize_studio_1791267352572.jpg';
import pkgMarketingImg from '../assets/images/pkg_marketing_mastery_1791267364843.jpg';
import pkgFinanceImg from '../assets/images/pkg_finance_mastery_1791267382089.jpg';
import pkgEliteImg from '../assets/images/pkg_elite_bundle_1791267393542.jpg';
import avatarInstructorImg from '../assets/images/avatar_instructor_lead_1791267406656.jpg';

export const ASSETS = {
  heroStudioImg,
  pkgMarketingImg,
  pkgFinanceImg,
  pkgEliteImg,
  avatarInstructorImg,
};

export type UserRole =
  | 'Student'
  | 'Affiliate'
  | 'Instructor'
  | 'Manager'
  | 'Admin'
  | 'Super Admin'
  | 'Finance Admin';

export interface LoginSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  timestamp: string;
  current: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  state: string;
  city: string;
  role: UserRole;
  referralCode: string;
  referredByCode: string;
  referredByName: string;
  activePackageId: string;
  enrolledCourseIds: string[];
  accountStatus: 'Active' | 'Pending OTP' | 'Suspended';
  emailVerified: boolean;
  mobileOtpVerified: boolean;
  kycStatus: 'Verified' | 'Pending' | 'Not Submitted';
  panNumber: string;
  bankAccount: string;
  ifscCode: string;
  upiId: string;
  joinedAt: string;
  streakDays: number;
  dailyGoalMinutes: number;
  todayWatchedMinutes: number;
  wishlistCourseIds: string[];
  sessions: LoginSession[];
}

export interface DropServiceItem {
  id: string;
  title: string;
  category: 'Performance Marketing' | 'Web & SaaS Engineering' | 'Video & Creative Production' | 'SEO & Content Systems' | 'Financial Advisory & Modeling';
  shortSummary: string;
  deliverables: string[];
  clientPrice: number; // What the client pays
  mrp: number;
  vendorCost: number; // Private fulfillment cost (visible ONLY in Manager Panel)
  turnaroundDays: number;
  revisionsIncluded: number;
  rating: number;
  completedOrdersCount: number;
  status: 'Active' | 'Archived';
  coverType: 'marketing' | 'finance' | 'elite';
}

export interface ServiceOrderRecord {
  id: string; // e.g., SRV-ORD-2026-401
  invoiceNumber: string;
  serviceId: string;
  serviceTitle: string;
  category: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectBrief: string;
  targetUrlOrBrand: string;
  clientPrice: number;
  gstAmount: number;
  finalAmount: number;
  vendorCost: number; // Private to Manager Panel
  netProfit: number; // Private to Manager Panel
  assignedSpecialist: string; // Fulfiller / Vendor name
  specialistStatus: 'Unassigned' | 'Assigned' | 'Working' | 'Submitted for QA' | 'Completed';
  orderStatus:
    | 'Order Placed'
    | 'Brief Verified'
    | 'In Production'
    | 'Quality Assurance'
    | 'Delivered'
    | 'Completed';
  deliverableUrl?: string;
  deliverableNotes?: string;
  clientFeedback?: string;
  gateway: 'Razorpay' | 'PhonePe PG' | 'Cashfree' | 'PayU';
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'PDF' | 'Worksheet' | 'Template' | 'External Link';
  size: string;
  url: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  durationMinutes: number;
  description: string;
  isFreePreview: boolean;
  isPublished: boolean;
  sortOrder: number;
  videoResolution: string;
  signedStreamId: string;
  resources: LessonResource[];
  keyTakeaways: string[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  isPublished: boolean;
  lessons: Lesson[];
}

export interface CourseReview {
  id: string;
  studentName: string;
  studentCity: string;
  rating: number;
  comment: string;
  date: string;
  outcomeMetric: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: 'Digital Marketing' | 'Communication & Soft Skills' | 'Finance & Equity' | 'Full-Stack & AI' | 'Creator & Freelancing';
  subCategory: string;
  language: 'Hindi & English' | 'Hindi' | 'English';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  price: number;
  mrp: number;
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  certificateEligible: boolean;
  status: 'Published' | 'Draft' | 'Pending Approval';
  packageTierId: string;
  coverType: 'marketing' | 'finance' | 'elite';
  seoTitle: string;
  seoKeywords: string;
  chapters: Chapter[];
  quiz: QuizQuestion[];
  assignmentPrompt: string;
  reviews: CourseReview[];
}

export interface CareermizePackage {
  id: string;
  name: string;
  tagline: string;
  audienceLabel: string;
  description: string;
  price: number;
  mrp: number;
  durationLabel: string;
  lifetimeAccess: boolean;
  courseCount: number;
  includedCourseIds: string[];
  certificateEligible: boolean;
  language: string;
  status: 'Active' | 'Archived';
  badgeType: 'Popular' | 'Recommended' | 'Flagship' | 'Starter';
  directCommissionPct: number;
  passiveCommissionPct: number;
  enrollmentsCount: number;
  coverType: 'marketing' | 'finance' | 'elite';
  features: string[];
}

export interface StudentNote {
  id: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  timestamp: string;
  content: string;
  createdAt: string;
}

export interface ReferralNode {
  id: string;
  userId: string;
  name: string;
  city: string;
  phone: string;
  packagePurchased: string;
  packageId: string;
  tier: 1 | 2;
  joinedDate: string;
  purchaseAmount: number;
  commissionEarned: number;
  commissionStatus: 'Pending' | 'Eligible' | 'Approved' | 'Payable' | 'Paid' | 'Rejected';
}

export interface ReferralClickLog {
  id: string;
  timestamp: string;
  source: 'WhatsApp Share' | 'Instagram Bio' | 'Direct QR Scan' | 'YouTube Description' | 'Telegram Channel';
  visitorIp: string;
  device: string;
  city: string;
  convertedToRegistration: boolean;
  convertedToPurchase: boolean;
  attributedUserId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  tdsDeducted: number;
  netPayable: number;
  method: 'UPI Instant' | 'NEFT / IMPS Bank';
  accountDetails: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  requestedAt: string;
  processedAt?: string;
  utrReference?: string;
}

export interface OrderRecord {
  id: string;
  invoiceNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userState: string;
  packageId: string;
  packageName: string;
  baseAmount: number;
  couponCode?: string;
  discountAmount: number;
  taxableAmount: number;
  gstAmount: number;
  finalAmount: number;
  gateway: 'Razorpay' | 'PhonePe PG' | 'Cashfree' | 'PayU';
  paymentMethod: 'UPI QR / Intent' | 'HDFC NetBanking' | 'RuPay / Visa Card' | 'EMI Wallet';
  transactionId: string;
  status: 'Success' | 'Pending' | 'Failed' | 'Refunded';
  referralCodeUsed?: string;
  commissionGenerated: number;
  createdAt: string;
  refundReason?: string;
}

export interface CertificateRecord {
  id: string;
  userId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  packageName: string;
  instructorName: string;
  issueDate: string;
  quizScorePct: number;
  status: 'Valid' | 'Revoked';
  verificationUrl: string;
}

export interface CouponCode {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  applicablePackageId: 'ALL' | string;
  usageCount: number;
  usageLimit: number;
  expiryDate: string;
  isActive: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  category: 'Service Order Delivery' | 'Package Upgrade' | 'Referral Payout' | 'Video Playback' | 'Certificate Issue' | 'GST Invoice';
  subject: string;
  message: string;
  priority: 'Normal' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  adminReply?: string;
}

export interface NotificationItem {
  id: string;
  channel: 'In-App' | 'WhatsApp' | 'Email' | 'SMS OTP';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  module: 'Auth & Security' | 'Dropservicing Fulfillment' | 'Commission Engine' | 'Payment Webhook' | 'Course LMS';
  ipAddress: string;
  timestamp: string;
}

export const INITIAL_DROPSERVICES: DropServiceItem[] = [
  {
    id: 'srv-meta-funnel',
    title: 'Done-For-You Meta & Google Ads Funnel Setup',
    category: 'Performance Marketing',
    shortSummary: 'Complete pixel + CAPI setup, 6 ad creatives, audience architecture, and 14-day live ROAS optimization.',
    deliverables: [
      'Meta Pixel & Server-Side Conversions API (EMQ 8.5+)',
      '6 High-Retention Ad Scripts & Visual Creatives',
      '3-Tier Campaign Structure (Prospecting + Retargeting)',
      'Live Looker Studio ROAS Reporting Dashboard',
    ],
    clientPrice: 14999,
    mrp: 24999,
    vendorCost: 5500,
    turnaroundDays: 5,
    revisionsIncluded: 3,
    rating: 4.9,
    completedOrdersCount: 342,
    status: 'Active',
    coverType: 'marketing',
  },
  {
    id: 'srv-saas-landing',
    title: 'High-Converting Custom Web Application & Payment Funnel',
    category: 'Web & SaaS Engineering',
    shortSummary: 'Production React/Next.js web platform with Razorpay/PhonePe checkout, fast SEO architecture, and admin dashboard.',
    deliverables: [
      'Custom Responsive Frontend & Backend API Architecture',
      'Razorpay / PhonePe Webhook & Automated GST Invoicing',
      'Sub-1.2s Largest Contentful Paint (LCP) Optimization',
      '30 Days Post-Launch Technical Support',
    ],
    clientPrice: 29999,
    mrp: 49999,
    vendorCost: 11000,
    turnaroundDays: 7,
    revisionsIncluded: 4,
    rating: 5.0,
    completedOrdersCount: 218,
    status: 'Active',
    coverType: 'elite',
  },
  {
    id: 'srv-video-pack',
    title: 'Commercial Retention Video Editing (12 Reels / YouTube Pack)',
    category: 'Video & Creative Production',
    shortSummary: 'Studio-grade Premiere Pro & After Effects editing with custom motion graphics, SFX layering, and bilingual captions.',
    deliverables: [
      '12 Short-Form Vertical Videos or 3 Long-Form Documentaries',
      'Custom Motion Graphics, B-Roll & Acoustic SFX Pacing',
      '3-Second Thumbstop Hook Variants for Paid Ads',
      'Source Project Files & Thumbnail Pack Included',
    ],
    clientPrice: 11999,
    mrp: 19999,
    vendorCost: 4200,
    turnaroundDays: 4,
    revisionsIncluded: 3,
    rating: 4.9,
    completedOrdersCount: 510,
    status: 'Active',
    coverType: 'elite',
  },
  {
    id: 'srv-seo-authority',
    title: 'Technical SEO Audit & 30-Page Topical Authority Engine',
    category: 'SEO & Content Systems',
    shortSummary: 'Complete site crawl remediation, schema.org JSON-LD deployment, and 30 commercial-intent keyword pillar briefs.',
    deliverables: [
      'Full Core Web Vitals & Indexation Remediation',
      '30 Commercial-Intent Keyword Cluster Content Briefs',
      'Internal Hub-and-Spoke Link Architecture',
      'Google Search Console & GA4 Conversion Tracking',
    ],
    clientPrice: 12999,
    mrp: 21999,
    vendorCost: 4500,
    turnaroundDays: 6,
    revisionsIncluded: 2,
    rating: 4.8,
    completedOrdersCount: 194,
    status: 'Active',
    coverType: 'marketing',
  },
  {
    id: 'srv-fin-valuation',
    title: 'Investor Pitch Deck & 5-Year DCF Financial Model',
    category: 'Financial Advisory & Modeling',
    shortSummary: 'CA-verified 3-statement financial projection model, unit economics sheet, and 15-slide institutional investor deck.',
    deliverables: [
      'Dynamic 5-Year Excel Financial Model (P&L, Balance Sheet, Cash Flow)',
      'CAC, LTV, Burn Rate & Sensitivity Matrix',
      '15-Slide Seed / Series-A Investor Pitch Deck',
      '1-on-1 Valuation Review Call with Chartered Accountant',
    ],
    clientPrice: 18999,
    mrp: 32999,
    vendorCost: 7000,
    turnaroundDays: 5,
    revisionsIncluded: 3,
    rating: 4.9,
    completedOrdersCount: 129,
    status: 'Active',
    coverType: 'finance',
  },
  {
    id: 'srv-whatsapp-crm',
    title: 'WhatsApp Cloud API & Automated Lead Nurture System',
    category: 'Web & SaaS Engineering',
    shortSummary: 'Official Meta WhatsApp Business API setup with automated abandoned-cart recovery, drip sequences, and CRM sync.',
    deliverables: [
      'Official Green-Tick Ready WhatsApp Cloud API Configuration',
      '7-Day Automated Lead Qualification & Payment Reminder Flows',
      'Webhook Integration with Razorpay / Shopify / Custom CRM',
      'Live Team Inbox & Broadcast Template Approval',
    ],
    clientPrice: 9999,
    mrp: 16999,
    vendorCost: 3200,
    turnaroundDays: 3,
    revisionsIncluded: 2,
    rating: 4.9,
    completedOrdersCount: 276,
    status: 'Active',
    coverType: 'marketing',
  },
];

export const INITIAL_SERVICE_ORDERS: ServiceOrderRecord[] = [
  {
    id: 'SRV-ORD-2026-401',
    invoiceNumber: 'INV-SRV-26-0401',
    serviceId: 'srv-meta-funnel',
    serviceTitle: 'Done-For-You Meta & Google Ads Funnel Setup',
    category: 'Performance Marketing',
    clientId: 'CM948201',
    clientName: 'Sandeep Kumar Barupal',
    clientEmail: 'kumarbarupalsandeep@gmail.com',
    clientPhone: '+91 98290 45120',
    projectBrief: 'Need complete Meta Pixel + CAPI setup and 3-tier lead generation campaign for our Jaipur D2C brand targeting 3.0x+ ROAS.',
    targetUrlOrBrand: 'https://jaipurcrafts.in',
    clientPrice: 14999,
    gstAmount: 2288,
    finalAmount: 14999,
    vendorCost: 5500,
    netProfit: 9499,
    assignedSpecialist: 'Rohan Kulkarni (Senior Performance Specialist)',
    specialistStatus: 'Working',
    orderStatus: 'In Production',
    deliverableUrl: 'https://careermize.in/deliverables/SRV-ORD-2026-401-capi-audit.pdf',
    deliverableNotes: 'Pixel + CAPI deduplication verified at 8.8/10 Event Match Quality. Ad creatives uploaded to Sandbox.',
    gateway: 'Razorpay',
    transactionId: 'pay_RzpSrv401992',
    createdAt: '02 Oct 2026, 03:20 PM',
    updatedAt: '05 Oct 2026, 06:10 PM',
  },
  {
    id: 'SRV-ORD-2026-389',
    invoiceNumber: 'INV-SRV-26-0389',
    serviceId: 'srv-video-pack',
    serviceTitle: 'Commercial Retention Video Editing (12 Reels / YouTube Pack)',
    category: 'Video & Creative Production',
    clientId: 'CM948201',
    clientName: 'Sandeep Kumar Barupal',
    clientEmail: 'kumarbarupalsandeep@gmail.com',
    clientPhone: '+91 98290 45120',
    projectBrief: '12 Hinglish brand reels with dynamic captions, J-cuts, and sub-bass transitions for Instagram and YouTube Shorts.',
    targetUrlOrBrand: '@careermize_official',
    clientPrice: 11999,
    gstAmount: 1830,
    finalAmount: 11999,
    vendorCost: 4200,
    netProfit: 7799,
    assignedSpecialist: 'Kabir Sen (Lead Motion Editor)',
    specialistStatus: 'Completed',
    orderStatus: 'Delivered',
    deliverableUrl: 'https://careermize.in/deliverables/SRV-ORD-2026-389-master-reels.zip',
    deliverableNotes: 'All 12 1080x1920 60fps master reels + Premiere Pro project files delivered.',
    clientFeedback: 'Crisp pacing and hook variations—ready for ad deployment.',
    gateway: 'PhonePe PG',
    transactionId: 'T260928884120',
    createdAt: '28 Sep 2026, 11:15 AM',
    updatedAt: '01 Oct 2026, 04:45 PM',
  },
  {
    id: 'SRV-ORD-2026-412',
    invoiceNumber: 'INV-SRV-26-0412',
    serviceId: 'srv-saas-landing',
    serviceTitle: 'High-Converting Custom Web Application & Payment Funnel',
    category: 'Web & SaaS Engineering',
    clientId: 'CM948104',
    clientName: 'Aarav Sharma',
    clientEmail: 'aarav.sharma@outlook.in',
    clientPhone: '+91 98112 77340',
    projectBrief: 'Custom B2B agency client portal with automated Razorpay GST invoice generation and onboarding forms.',
    targetUrlOrBrand: 'https://scaleops.in',
    clientPrice: 29999,
    gstAmount: 4576,
    finalAmount: 29999,
    vendorCost: 11000,
    netProfit: 18999,
    assignedSpecialist: 'Vikramaditya Rathore (Principal Architect)',
    specialistStatus: 'Submitted for QA',
    orderStatus: 'Quality Assurance',
    deliverableUrl: 'https://staging.scaleops.in',
    deliverableNotes: 'Staging build deployed with webhook verification; final QA in progress.',
    gateway: 'Cashfree',
    transactionId: 'cf_srv_9910241',
    createdAt: '04 Oct 2026, 01:05 PM',
    updatedAt: '05 Oct 2026, 09:00 PM',
  },
];

export const INITIAL_PACKAGES: CareermizePackage[] = [
  {
    id: 'pkg-marketing',
    name: 'Marketing Mastery',
    tagline: 'Foundational digital acquisition, Meta & Google Ads, and social media monetization.',
    audienceLabel: 'For students & beginner freelancers',
    description: 'Master performance marketing, high-converting landing pages, organic Instagram & YouTube growth, and client acquisition fundamentals.',
    price: 1499,
    mrp: 2999,
    durationLabel: 'Lifetime Access',
    lifetimeAccess: true,
    courseCount: 6,
    includedCourseIds: ['crs-meta-ads', 'crs-seo-content'],
    certificateEligible: true,
    language: 'Hindi & English',
    status: 'Active',
    badgeType: 'Starter',
    directCommissionPct: 60,
    passiveCommissionPct: 8,
    enrollmentsCount: 14280,
    coverType: 'marketing',
    features: [
      '6 Core Digital Marketing Courses',
      'Verified Course Completion Certificates',
      'WhatsApp & Live Call Support Access',
      '60% Direct Referral Commission Eligibility',
    ],
  },
  {
    id: 'pkg-soft-skills',
    name: 'Soft Skill Mastery',
    tagline: 'Executive communication, interview readiness, public speaking, and B2B closing.',
    audienceLabel: 'For job seekers & campus placements',
    description: 'Includes all Marketing Mastery courses plus corporate communication, high-ticket sales psychology, LinkedIn personal branding, and resume engineering.',
    price: 2499,
    mrp: 4999,
    durationLabel: 'Lifetime Access',
    lifetimeAccess: true,
    courseCount: 11,
    includedCourseIds: ['crs-meta-ads', 'crs-seo-content', 'crs-comm-sales'],
    certificateEligible: true,
    language: 'Hindi & English',
    status: 'Active',
    badgeType: 'Recommended',
    directCommissionPct: 62,
    passiveCommissionPct: 8,
    enrollmentsCount: 19450,
    coverType: 'marketing',
    features: [
      '11 Courses (Includes Marketing Mastery Free)',
      'Corporate Interview & Resume Blueprint',
      'Weekly Live Q&A Sessions',
      '62% Direct + 8% Tier-2 Referral Commission',
    ],
  },
  {
    id: 'pkg-pro',
    name: 'Pro Package',
    tagline: 'Full-spectrum creator production, Premiere Pro editing, agency freelancing & automation.',
    audienceLabel: 'For creators & digital agencies',
    description: 'Comprehensive 18-course bundle combining Marketing Mastery, Soft Skill Mastery, commercial video editing, freelance client retainers, and funnel building.',
    price: 3999,
    mrp: 7999,
    durationLabel: 'Lifetime Access',
    lifetimeAccess: true,
    courseCount: 18,
    includedCourseIds: ['crs-meta-ads', 'crs-seo-content', 'crs-comm-sales', 'crs-video-agency'],
    certificateEligible: true,
    language: 'Hindi & English',
    status: 'Active',
    badgeType: 'Popular',
    directCommissionPct: 65,
    passiveCommissionPct: 10,
    enrollmentsCount: 28910,
    coverType: 'elite',
    features: [
      '18 Courses (Includes Marketing + Soft Skills)',
      'Commercial Video Production & Agency Retainers',
      'Downloadable Agency Contracts & SOPs',
      '65% Direct + 10% Tier-2 Referral Commission',
    ],
  },
  {
    id: 'pkg-finance',
    name: 'Finance Mastery',
    tagline: 'Indian equity valuation, price-action trading, mutual funds, and corporate taxation.',
    audienceLabel: 'For retail investors & finance analysts',
    description: '24-course institutional-grade curriculum covering NSE/BSE technicals, fundamental balance-sheet reading, options hedging, and GST/Income Tax filing.',
    price: 5499,
    mrp: 9999,
    durationLabel: 'Lifetime Access',
    lifetimeAccess: true,
    courseCount: 24,
    includedCourseIds: ['crs-meta-ads', 'crs-seo-content', 'crs-comm-sales', 'crs-video-agency', 'crs-equity-finance'],
    certificateEligible: true,
    language: 'Hindi & English',
    status: 'Active',
    badgeType: 'Recommended',
    directCommissionPct: 68,
    passiveCommissionPct: 10,
    enrollmentsCount: 16320,
    coverType: 'finance',
    features: [
      '24 Courses (Includes Pro + Soft Skills + Marketing)',
      'NSE/BSE Equity Valuation & Excel Modeling',
      'GST & Personal Tax Planning Workbooks',
      '68% Direct + 10% Tier-2 Referral Commission',
    ],
  },
  {
    id: 'pkg-prime',
    name: 'Prime Package',
    tagline: 'Full-stack web development, No-Code SaaS automation, and e-commerce scaling.',
    audienceLabel: 'For tech builders & founders',
    description: '32-course powerhouse featuring React/Node engineering, Shopify D2C brand scaling, AI workflow automation, plus all Finance, Pro, and Marketing bundles.',
    price: 7999,
    mrp: 14999,
    durationLabel: 'Lifetime Access',
    lifetimeAccess: true,
    courseCount: 32,
    includedCourseIds: ['crs-meta-ads', 'crs-seo-content', 'crs-comm-sales', 'crs-video-agency', 'crs-equity-finance', 'crs-fullstack-ai'],
    certificateEligible: true,
    language: 'Hindi & English',
    status: 'Active',
    badgeType: 'Popular',
    directCommissionPct: 70,
    passiveCommissionPct: 12,
    enrollmentsCount: 11840,
    coverType: 'elite',
    features: [
      '32 Courses Across Tech, Finance & Marketing',
      'Full-Stack React & AI Workflow Engineering',
      'Priority Mentor Review & Portfolio Audit',
      '70% Direct + 12% Tier-2 Referral Commission',
    ],
  },
  {
    id: 'pkg-elite',
    name: 'Elite Package',
    tagline: 'All-access 42-course master Pass with 1-on-1 mentorship and highest affiliate tier.',
    audienceLabel: 'For serious career accelerators & top partners',
    description: 'Unlock all 42 Careermize courses with lifetime future updates, weekend live masterclasses, placement referral network, and maximum 72% affiliate payout.',
    price: 10999,
    mrp: 19999,
    durationLabel: 'Lifetime Access',
    lifetimeAccess: true,
    courseCount: 42,
    includedCourseIds: ['crs-meta-ads', 'crs-seo-content', 'crs-comm-sales', 'crs-video-agency', 'crs-equity-finance', 'crs-fullstack-ai'],
    certificateEligible: true,
    language: 'Hindi & English',
    status: 'Active',
    badgeType: 'Flagship',
    directCommissionPct: 72,
    passiveCommissionPct: 12,
    enrollmentsCount: 21590,
    coverType: 'elite',
    features: [
      'All 42 Current & Future Courses Included',
      '1-on-1 Career Roadmap & Placement Desk',
      'Dedicated WhatsApp VIP Relationship Manager',
      '72% Direct + 12% Tier-2 Referral Commission',
    ],
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-meta-ads',
    slug: 'performance-marketing-meta-google-ads',
    title: 'Performance Marketing: Meta & Google Ads Scaling Blueprint',
    shortDescription: 'Deploy profitable ad campaigns, pixel attribution, and ROAS optimization for Indian D2C & lead-gen brands.',
    description: 'Step-by-step practical training on campaign architecture, Conversion API setup, lookalike audience engineering, creative testing matrices, and scaling ad budgets from ₹500/day to ₹50,000/day without losing ROAS.',
    category: 'Digital Marketing',
    subCategory: 'Paid Acquisition',
    language: 'Hindi & English',
    level: 'Intermediate',
    durationHours: 14.5,
    price: 1499,
    mrp: 2999,
    instructorId: 'inst-1',
    instructorName: 'Vikramaditya Rathore',
    instructorTitle: 'Ex-Growth Lead, ₹40Cr+ Ad Spend Managed',
    enrollmentCount: 18420,
    rating: 4.9,
    reviewCount: 1240,
    certificateEligible: true,
    status: 'Published',
    packageTierId: 'pkg-marketing',
    coverType: 'marketing',
    seoTitle: 'Performance Marketing & Meta Ads Course in Hindi | Careermize',
    seoKeywords: 'meta ads, facebook ads india, performance marketing course, roas scaling',
    assignmentPrompt: 'Audit a real D2C brand landing page and submit a 3-tier Meta Ads campaign structure (TOF, MOF, BOF) with daily budget allocation for a ₹30,000 monthly budget.',
    chapters: [
      {
        id: 'ch-101',
        title: 'Chapter 1: Funnel Economics & Pixel Attribution',
        description: 'Understanding CAC, LTV, ROAS break-even math, and server-side tracking.',
        sortOrder: 1,
        isPublished: true,
        lessons: [
          {
            id: 'les-1001',
            title: '01. Break-Even ROAS & Unit Economics Calculator',
            duration: '19:20',
            durationMinutes: 19,
            description: 'Calculate exact target CPA and break-even ROAS before spending a single rupee on ads.',
            isFreePreview: true,
            isPublished: true,
            sortOrder: 1,
            videoResolution: '1080p Signed HLS',
            signedStreamId: 'cm-stream-meta-1001-signed',
            keyTakeaways: [
              'Gross Margin % dictates your Break-Even ROAS (1 / Gross Margin).',
              'Always separate Prospecting (Cold) budgets from Retargeting (Warm) budgets.',
              'Track Cost Per Unique Outbound Click alongside CPM and Hook Rate.',
            ],
            resources: [
              { id: 'res-1', title: 'D2C Unit Economics & ROAS Sheet.pdf', type: 'PDF', size: '1.4 MB', url: '#download-roas-sheet' },
              { id: 'res-2', title: 'UTM Naming Convention Template.pdf', type: 'Template', size: '640 KB', url: '#download-utm-template' },
            ],
          },
          {
            id: 'les-1002',
            title: '02. Meta Pixel & Conversions API (CAPI) Deep Setup',
            duration: '26:15',
            durationMinutes: 26,
            description: 'Configure event deduplication, Event Match Quality (EMQ > 8.0), and custom conversion triggers.',
            isFreePreview: false,
            isPublished: true,
            sortOrder: 2,
            videoResolution: '1080p Signed HLS',
            signedStreamId: 'cm-stream-meta-1002-signed',
            keyTakeaways: [
              'Browser Pixel alone loses 25-35% of iOS/ad-blocker conversions.',
              'Pass hashed email and phone (+91) parameters to boost Event Match Quality.',
            ],
            resources: [
              { id: 'res-3', title: 'CAPI Event Deduplication Checklist.pdf', type: 'PDF', size: '980 KB', url: '#download-capi' },
            ],
          },
        ],
      },
      {
        id: 'ch-102',
        title: 'Chapter 2: Creative Testing & CBO Budget Scaling',
        description: '3:2:2 dynamic creative testing and horizontal vs vertical budget scaling.',
        sortOrder: 2,
        isPublished: true,
        lessons: [
          {
            id: 'les-1003',
            title: '03. The 3-Second Video Hook & UGC Script Framework',
            duration: '22:40',
            durationMinutes: 23,
            description: 'How to write high-retention Hinglish ad scripts that achieve 35%+ thumbstop ratios.',
            isFreePreview: false,
            isPublished: true,
            sortOrder: 3,
            videoResolution: '1080p Signed HLS',
            signedStreamId: 'cm-stream-meta-1003-signed',
            keyTakeaways: [
              'Hook Rate = 3-Second Video Plays / Impressions (Target > 30%).',
              'Hold Rate = ThruPlays / 3-Second Plays (Target > 25%).',
            ],
            resources: [
              { id: 'res-4', title: '45 Proven Hinglish Ad Hooks Swipefile.pdf', type: 'PDF', size: '2.1 MB', url: '#download-hooks' },
            ],
          },
          {
            id: 'les-1004',
            title: '04. Scaling Winning Ad Sets Without Resetting Learning Phase',
            duration: '28:10',
            durationMinutes: 28,
            description: '20% every 48 hours rule, Advantage+ Shopping Campaigns (ASC), and automated stop-loss rules.',
            isFreePreview: false,
            isPublished: true,
            sortOrder: 4,
            videoResolution: '1080p Signed HLS',
            signedStreamId: 'cm-stream-meta-1004-signed',
            keyTakeaways: [
              'Wait for 50 optimization events per week to exit the Learning Phase.',
              'Use automated rules to pause ads exceeding 2x Target CPA with zero conversions.',
            ],
            resources: [
              { id: 'res-5', title: 'Automated Scaling Rules Blueprint.pdf', type: 'Worksheet', size: '1.1 MB', url: '#download-scaling' },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-1',
        question: 'If a product sells for ₹2,000 and costs ₹800 to manufacture and ship (60% gross margin), what is the exact Break-Even ROAS?',
        options: ['1.25x', '1.67x', '2.50x', '3.00x'],
        correctIndex: 1,
        explanation: 'Break-Even ROAS = 1 / Gross Margin = 1 / 0.60 = 1.67x.',
      },
      {
        id: 'q-2',
        question: 'Which metric directly measures the effectiveness of the first 3 seconds of your video ad creative?',
        options: ['Outbound CTR', 'Thumbstop / Hook Rate (3-Sec Views ÷ Impressions)', 'Frequency Ratio', 'CPM'],
        correctIndex: 1,
        explanation: 'Thumbstop (Hook Rate) measures how many impressions watched at least 3 seconds of the video.',
      },
      {
        id: 'q-3',
        question: 'How many optimization events are typically required within a 7-day window for a Meta Ad Set to exit the Learning Phase?',
        options: ['10 events', '25 events', '50 events', '200 events'],
        correctIndex: 2,
        explanation: 'Meta requires roughly 50 optimization events within 7 days to stabilize delivery and exit the Learning Phase.',
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        studentName: 'Rohan Kulkarni',
        studentCity: 'Pune, Maharashtra',
        rating: 5,
        comment: 'Applied the 3:2:2 creative testing structure for a local clinic client in Pune. Brought lead cost down from ₹185 to ₹42 within 14 days.',
        date: '18 Sep 2026',
        outcomeMetric: '₹45,000/mo Freelance Retainer Closed',
      },
      {
        id: 'rev-2',
        studentName: 'Ananya Verma',
        studentCity: 'Jaipur, Rajasthan',
        rating: 5,
        comment: 'The break-even ROAS spreadsheet alone saved our ethnic wear brand from burning money on low-margin SKUs.',
        date: '02 Oct 2026',
        outcomeMetric: '3.4x Blended ROAS in 30 Days',
      },
    ],
  },
  {
    id: 'crs-equity-finance',
    slug: 'indian-equity-valuation-financial-modeling',
    title: 'Institutional Equity Valuation, Price Action & Tax Mastery',
    shortDescription: 'Read NSE/BSE annual reports, build DCF models in Excel, and structure tax-efficient portfolios.',
    description: 'Designed for Indian retail investors and finance careers. Covers Cash Flow statement forensics, ROCE vs ROE screening, multi-timeframe price action, F&O hedging, and Income Tax / GST compliance.',
    category: 'Finance & Equity',
    subCategory: 'Equity Research',
    language: 'Hindi & English',
    level: 'Advanced',
    durationHours: 19.0,
    price: 3499,
    mrp: 5999,
    instructorId: 'inst-2',
    instructorName: 'CA Nidhi Singhania',
    instructorTitle: 'Chartered Accountant & Equity Research Strategist',
    enrollmentCount: 12390,
    rating: 4.9,
    reviewCount: 890,
    certificateEligible: true,
    status: 'Published',
    packageTierId: 'pkg-finance',
    coverType: 'finance',
    seoTitle: 'Equity Valuation & Financial Modeling Course India | Careermize',
    seoKeywords: 'stock market course hindi, financial modeling, equity research, ca nidhi',
    assignmentPrompt: 'Download the latest FY Annual Report of any Nifty 50 company and calculate Cash Flow from Operations (CFO) to EBITDA conversion ratio over the last 3 years.',
    chapters: [
      {
        id: 'ch-201',
        title: 'Chapter 1: Balance Sheet Forensics & Cash Flow Quality',
        description: 'Spotting accounting red flags, receivable bloat, and promoter pledge risks.',
        sortOrder: 1,
        isPublished: true,
        lessons: [
          {
            id: 'les-2001',
            title: '01. CFO vs Net Profit Divergence: Spotting Earnings Manipulation',
            duration: '24:15',
            durationMinutes: 24,
            description: 'Why paper profits mean nothing if Cash Flow from Operations (CFO) lags behind PAT.',
            isFreePreview: true,
            isPublished: true,
            sortOrder: 1,
            videoResolution: '1080p Signed HLS',
            signedStreamId: 'cm-stream-fin-2001-signed',
            keyTakeaways: [
              'Cumulative 5-year CFO / Cumulative EBITDA should exceed 70% for healthy industrial businesses.',
              'Watch out for rising Trade Receivables Days relative to revenue growth.',
            ],
            resources: [
              { id: 'res-201', title: 'Screener.in Custom Ratio Formula Pack.pdf', type: 'PDF', size: '1.2 MB', url: '#download-screener' },
            ],
          },
          {
            id: 'les-2002',
            title: '02. Building a 3-Statement DCF Valuation Model',
            duration: '31:50',
            durationMinutes: 32,
            description: 'Forecasting Free Cash Flow to Firm (FCFF), WACC calculation for Indian risk-free rates, and Terminal Value.',
            isFreePreview: false,
            isPublished: true,
            sortOrder: 2,
            videoResolution: '1080p Signed HLS',
            signedStreamId: 'cm-stream-fin-2002-signed',
            keyTakeaways: [
              'Use India 10-Year G-Sec yield as the baseline Risk-Free Rate.',
              'Always run a sensitivity matrix across WACC (±1%) and Terminal Growth Rate.',
            ],
            resources: [
              { id: 'res-202', title: 'Nifty50 DCF Valuation Template.pdf', type: 'Worksheet', size: '2.8 MB', url: '#download-dcf' },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-201',
        question: 'Which ratio best validates whether reported accounting profits are actually converting into real cash?',
        options: ['Current Ratio', 'CFO to EBITDA Ratio', 'Price to Book Value', 'Dividend Payout Ratio'],
        correctIndex: 1,
        explanation: 'Cash Flow from Operations (CFO) to EBITDA shows how much operating profit turns into actual cash flow.',
      },
      {
        id: 'q-202',
        question: 'In an Indian DCF model, what is the standard benchmark used for the Risk-Free Rate (Rf)?',
        options: ['Repo Rate', '10-Year Government of India Bond (G-Sec) Yield', 'Savings Bank Interest Rate', 'US Treasury Yield'],
        correctIndex: 1,
        explanation: 'The 10-Year Indian G-Sec yield reflects the sovereign risk-free return in INR terms.',
      },
    ],
    reviews: [],
  },
  {
    id: 'crs-fullstack-ai',
    slug: 'fullstack-saas-ai-automation-engineering',
    title: 'Full-Stack Web Engineering & AI Workflow Automation',
    shortDescription: 'Build production TypeScript/React SaaS apps, payment webhooks, and automated client workflows.',
    description: 'From modern React & Node architecture to Razorpay webhook verification, database schema design, and building high-margin AI automation workflows for global clients.',
    category: 'Full-Stack & AI',
    subCategory: 'Software Engineering',
    language: 'Hindi & English',
    level: 'Advanced',
    durationHours: 22.5,
    price: 4999,
    mrp: 8999,
    instructorId: 'inst-1',
    instructorName: 'Vikramaditya Rathore',
    instructorTitle: 'Principal Architect & EdTech Founder',
    enrollmentCount: 9840,
    rating: 4.9,
    reviewCount: 615,
    certificateEligible: true,
    status: 'Published',
    packageTierId: 'pkg-prime',
    coverType: 'elite',
    seoTitle: 'Full Stack Web Development & Automation Course | Careermize',
    seoKeywords: 'full stack course hindi, react nodejs, payment gateway integration, razorpay webhooks',
    assignmentPrompt: 'Design an idempotent Razorpay payment webhook handler that verifies HMAC-SHA256 signatures and provisions course access atomically.',
    chapters: [
      {
        id: 'ch-301',
        title: 'Chapter 1: Production Architecture & Payment Security',
        description: 'REST API design, JWT RBAC security, and HMAC signature validation.',
        sortOrder: 1,
        isPublished: true,
        lessons: [
          {
            id: 'les-3001',
            title: '01. Multi-Role RBAC & Signed Video URL Architecture',
            duration: '27:30',
            durationMinutes: 28,
            description: 'How LMS platforms protect video assets with expiring signed tokens and role permissions.',
            isFreePreview: true,
            isPublished: true,
            sortOrder: 1,
            videoResolution: '1080p Signed HLS',
            signedStreamId: 'cm-stream-tech-3001-signed',
            keyTakeaways: [
              'Never expose raw S3/CDN bucket URLs; generate short-lived signed playback tokens.',
              'Enforce RBAC middleware on both API routes and UI views.',
            ],
            resources: [
              { id: 'res-301', title: 'LMS Database Schema Blueprint (34 Tables).pdf', type: 'PDF', size: '1.9 MB', url: '#download-schema' },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-301',
        question: 'Why must an LMS backend verify the HMAC-SHA256 webhook signature from Razorpay/Cashfree before unlocking a package?',
        options: [
          'To speed up frontend CSS rendering',
          'To prevent spoofed client-side POST requests from unlocking paid packages without real payment',
          'To compress video files',
          'To reduce GST rate',
        ],
        correctIndex: 1,
        explanation: 'Cryptographic webhook signature verification guarantees the payment confirmation genuinely came from the payment gateway.',
      },
    ],
    reviews: [],
  },
  {
    id: 'crs-comm-sales',
    slug: 'executive-communication-high-ticket-closing',
    title: 'Executive English, Public Speaking & High-Ticket B2B Closing',
    shortDescription: 'Overcome hesitation, pitch international clients on Zoom, and close high-value consulting deals.',
    description: 'Practical communication drills, objection handling scripts, salary negotiation frameworks, and outbound LinkedIn discovery call mastery.',
    category: 'Communication & Soft Skills',
    subCategory: 'Executive Presence',
    language: 'Hindi & English',
    level: 'Beginner',
    durationHours: 10.5,
    price: 1999,
    mrp: 3999,
    instructorId: 'inst-3',
    instructorName: 'Meera Deshmukh',
    instructorTitle: 'Corporate Communication Coach (Trained 15,000+ Professionals)',
    enrollmentCount: 22100,
    rating: 4.8,
    reviewCount: 1590,
    certificateEligible: true,
    status: 'Published',
    packageTierId: 'pkg-soft-skills',
    coverType: 'marketing',
    seoTitle: 'Communication & High Ticket Sales Course | Careermize',
    seoKeywords: 'public speaking course, sales closing, interview preparation india',
    assignmentPrompt: 'Record or script a 90-second discovery call opener addressing the "Your price is too high" client objection using the Feel-Felt-Found + ROI reframe.',
    chapters: [
      {
        id: 'ch-401',
        title: 'Chapter 1: The Consultative Discovery Call Framework',
        description: 'Diagnosing client pain points before pitching price.',
        sortOrder: 1,
        isPublished: true,
        lessons: [
          {
            id: 'les-4001',
            title: '01. Controlling the Frame on Zoom Client Calls',
            duration: '16:45',
            durationMinutes: 17,
            description: 'Setting the agenda, uncovering budget authority, and handling price objections gracefully.',
            isFreePreview: true,
            isPublished: true,
            sortOrder: 1,
            videoResolution: '1080p Signed HLS',
            signedStreamId: 'cm-stream-comm-4001-signed',
            keyTakeaways: [
              'Never quote a price before quantifying the cost of inaction with the prospect.',
              'Use calibrated "How" and "What" questions to guide negotiations.',
            ],
            resources: [
              { id: 'res-401', title: 'B2B Discovery Call Script & Objection Matrix.pdf', type: 'PDF', size: '890 KB', url: '#download-sales-script' },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-401',
        question: 'When a prospect asks for your price in the first 2 minutes of a call, what is the strongest consultative response?',
        options: [
          'Immediately offer a 40% discount',
          'Provide a broad range, then pivot to diagnosing their exact scope and revenue goals first',
          'End the call immediately',
          'Send a 50-page PDF without explanation',
        ],
        correctIndex: 1,
        explanation: 'Anchoring a range and diagnosing scope ensures your proposal is tied to measurable client ROI.',
      },
    ],
    reviews: [],
  },
  {
    id: 'crs-video-agency',
    slug: 'commercial-video-editing-premiere-after-effects',
    title: 'Commercial Video Editing & Retention Storytelling Mastery',
    shortDescription: 'Edit high-retention Reels, YouTube documentaries, and brand commercials with Premiere Pro & After Effects.',
    description: 'Master sound design, J-cuts/L-cuts, motion graphics pacing, color grading, and building a ₹1 Lakh/month video editing agency for global creators.',
    category: 'Creator & Freelancing',
    subCategory: 'Video Production',
    language: 'Hindi & English',
    level: 'Intermediate',
    durationHours: 16.0,
    price: 2999,
    mrp: 5499,
    instructorId: 'inst-1',
    instructorName: 'Vikramaditya Rathore',
    instructorTitle: 'Creative Director & Growth Strategist',
    enrollmentCount: 19300,
    rating: 4.9,
    reviewCount: 1120,
    certificateEligible: true,
    status: 'Published',
    packageTierId: 'pkg-pro',
    coverType: 'elite',
    seoTitle: 'Video Editing & Agency Building Course | Careermize',
    seoKeywords: 'video editing course hindi, premiere pro mastery, freelance video editor',
    assignmentPrompt: 'Create a 45-second retention-edited sequence breakdown specifying visual pattern interrupts every 4 seconds and layered SFX cues.',
    chapters: [
      {
        id: 'ch-501',
        title: 'Chapter 1: Acoustic Pacing, Rhythm & Retention Graphs',
        description: 'Why sound design accounts for 50% of viewer retention.',
        sortOrder: 1,
        isPublished: true,
        lessons: [
          {
            id: 'les-5001',
            title: '01. J-Cuts, L-Cuts & Sub-Bass Riser Transitions',
            duration: '21:10',
            durationMinutes: 21,
            description: 'Seamless narrative flow that keeps viewers locked past the 30-second drop-off cliff.',
            isFreePreview: true,
            isPublished: true,
            sortOrder: 1,
            videoResolution: '1080p Signed HLS',
            signedStreamId: 'cm-stream-vid-5001-signed',
            keyTakeaways: [
              'Lead with audio 4-6 frames before the visual cut (J-Cut) for natural conversational flow.',
              'Change visual framing or B-roll layer every 3.5 to 5 seconds.',
            ],
            resources: [
              { id: 'res-501', title: 'Studio SFX & LUTs Starter Index.pdf', type: 'PDF', size: '1.5 MB', url: '#download-sfx' },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-501',
        question: 'What is a J-Cut in timeline editing?',
        options: [
          'When the audio of the next clip starts playing before its video frame appears',
          'Deleting all audio tracks',
          'Exporting in 480p resolution',
          'Applying a black and white filter',
        ],
        correctIndex: 0,
        explanation: 'A J-Cut introduces the incoming clip audio slightly ahead of the visual cut, creating smooth narrative anticipation.',
      },
    ],
    reviews: [],
  },
  {
    id: 'crs-seo-content',
    slug: 'programmatic-seo-organic-growth-systems',
    title: 'Search Engine Dominance: Technical SEO & Content Funnels',
    shortDescription: 'Rank high-intent commercial pages on Google and build compounding organic traffic assets.',
    description: 'Complete guide to keyword clustering, topical authority maps, Core Web Vitals optimization, schema markup, and backlink outreach.',
    category: 'Digital Marketing',
    subCategory: 'Organic Search',
    language: 'Hindi & English',
    level: 'Beginner',
    durationHours: 11.0,
    price: 1499,
    mrp: 2999,
    instructorId: 'inst-3',
    instructorName: 'Meera Deshmukh',
    instructorTitle: 'Organic Growth & Content Strategist',
    enrollmentCount: 11400,
    rating: 4.8,
    reviewCount: 740,
    certificateEligible: true,
    status: 'Published',
    packageTierId: 'pkg-marketing',
    coverType: 'marketing',
    seoTitle: 'Technical SEO & Content Marketing Course | Careermize',
    seoKeywords: 'seo course hindi, keyword research, technical seo, blog monetization',
    assignmentPrompt: 'Submit a 15-keyword topical authority cluster map separating Informational, Commercial Investigation, and Transactional search intent.',
    chapters: [
      {
        id: 'ch-601',
        title: 'Chapter 1: Commercial Search Intent & Topical Clustering',
        description: 'Targeting keywords that convert visitors into paying customers.',
        sortOrder: 1,
        isPublished: true,
        lessons: [
          {
            id: 'les-6001',
            title: '01. High-Intent Keyword Mining & Hub-and-Spoke Architecture',
            duration: '18:05',
            durationMinutes: 18,
            description: 'Structuring pillar pages and internal link silos for rapid indexing.',
            isFreePreview: true,
            isPublished: true,
            sortOrder: 1,
            videoResolution: '1080p Signed HLS',
            signedStreamId: 'cm-stream-seo-6001-signed',
            keyTakeaways: [
              'Prioritize bottom-of-funnel comparison keywords before broad high-volume terms.',
              'Every spoke article must link back to the commercial pillar page with descriptive anchor text.',
            ],
            resources: [
              { id: 'res-601', title: 'Topical Map Spreadsheet Template.pdf', type: 'Worksheet', size: '920 KB', url: '#download-seo-map' },
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        id: 'q-601',
        question: 'Which keyword shows the highest commercial buying intent?',
        options: [
          'what is marketing',
          'history of internet',
          'best CRM software for real estate agencies in India pricing',
          'free wallpaper download',
        ],
        correctIndex: 2,
        explanation: 'Specific industry + "best/pricing" modifiers signal bottom-of-funnel commercial buying intent.',
      },
    ],
    reviews: [],
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'CM948201',
  name: 'Sandeep Kumar Barupal',
  email: 'kumarbarupalsandeep@gmail.com',
  password: 'ClientPassword123',
  phone: '+91 98290 45120',
  state: 'Rajasthan',
  city: 'Jaipur',
  role: 'Student',
  referralCode: 'SANDEEP90',
  referredByCode: 'CM-VIKRAM01',
  referredByName: 'Vikramaditya Rathore',
  activePackageId: 'pkg-pro',
  enrolledCourseIds: ['crs-meta-ads', 'crs-seo-content', 'crs-comm-sales', 'crs-video-agency'],
  accountStatus: 'Active',
  emailVerified: true,
  mobileOtpVerified: true,
  kycStatus: 'Verified',
  panNumber: 'BXKPB8421M',
  bankAccount: 'HDFC0001492 •••• 7821',
  ifscCode: 'HDFC0001492',
  upiId: 'sandeep.barupal@okhdfcbank',
  joinedAt: '12 Aug 2026',
  streakDays: 14,
  dailyGoalMinutes: 45,
  todayWatchedMinutes: 35,
  wishlistCourseIds: ['crs-equity-finance', 'crs-fullstack-ai'],
  sessions: [
    {
      id: 'ses-1',
      device: 'MacBook Pro 16" (macOS Sequoia)',
      browser: 'Chrome 134.0',
      ip: '103.212.144.88',
      location: 'Jaipur, Rajasthan, IN',
      timestamp: 'Active now',
      current: true,
    },
    {
      id: 'ses-2',
      device: 'iPhone 16 Pro (iOS 19)',
      browser: 'Mobile Safari / PWA',
      ip: '49.36.182.19',
      location: 'Jaipur, Rajasthan, IN',
      timestamp: 'Yesterday, 09:42 PM',
      current: false,
    },
  ],
};

export const INITIAL_MANAGER_USER: UserProfile = {
  id: 'CM000001',
  name: 'Vikramaditya Rathore (Operations Manager)',
  email: 'manager@careermize.in',
  password: 'ManagerPassword#2026',
  phone: '+91 99001 88210',
  state: 'Karnataka',
  city: 'Bengaluru',
  role: 'Manager',
  referralCode: 'CM-VIKRAM01',
  referredByCode: 'ROOT',
  referredByName: 'Careermize Direct',
  activePackageId: 'pkg-elite',
  enrolledCourseIds: ['crs-meta-ads', 'crs-seo-content', 'crs-comm-sales', 'crs-video-agency', 'crs-equity-finance', 'crs-fullstack-ai'],
  accountStatus: 'Active',
  emailVerified: true,
  mobileOtpVerified: true,
  kycStatus: 'Verified',
  panNumber: 'AAACR8812F',
  bankAccount: 'HDFC0000120 •••• 1100',
  ifscCode: 'HDFC0000120',
  upiId: 'vikram@hdfcbank',
  joinedAt: '01 Jan 2026',
  streakDays: 95,
  dailyGoalMinutes: 60,
  todayWatchedMinutes: 60,
  wishlistCourseIds: [],
  sessions: [
    {
      id: 'ses-mgr-1',
      device: 'Studio Workstation (Bengaluru HQ)',
      browser: 'Chrome 134.0',
      ip: '106.51.82.19',
      location: 'Bengaluru, Karnataka, IN',
      timestamp: 'Active now',
      current: true,
    },
  ],
};

export const INITIAL_ALL_USERS: UserProfile[] = [
  INITIAL_USER,
  INITIAL_MANAGER_USER,
  {
    id: 'CM948104',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@outlook.in',
    password: 'ClientPassword123',
    phone: '+91 98112 77340',
    state: 'Delhi NCR',
    city: 'New Delhi',
    role: 'Affiliate',
    referralCode: 'AARAVPRO',
    referredByCode: 'SANDEEP90',
    referredByName: 'Sandeep Kumar Barupal',
    activePackageId: 'pkg-elite',
    enrolledCourseIds: ['crs-meta-ads', 'crs-seo-content', 'crs-comm-sales', 'crs-video-agency', 'crs-equity-finance', 'crs-fullstack-ai'],
    accountStatus: 'Active',
    emailVerified: true,
    mobileOtpVerified: true,
    kycStatus: 'Verified',
    panNumber: 'AKLPS4419Q',
    bankAccount: 'ICIC0000912 •••• 3310',
    ifscCode: 'ICIC0000912',
    upiId: 'aaravpro@icici',
    joinedAt: '04 Sep 2026',
    streakDays: 21,
    dailyGoalMinutes: 60,
    todayWatchedMinutes: 60,
    wishlistCourseIds: [],
    sessions: [],
  },
  {
    id: 'CM948319',
    name: 'Priya Patel',
    email: 'priya.patel.design@gmail.com',
    password: 'ClientPassword123',
    phone: '+91 97240 11890',
    state: 'Gujarat',
    city: 'Ahmedabad',
    role: 'Student',
    referralCode: 'PRIYA26',
    referredByCode: 'SANDEEP90',
    referredByName: 'Sandeep Kumar Barupal',
    activePackageId: 'pkg-finance',
    enrolledCourseIds: ['crs-meta-ads', 'crs-seo-content', 'crs-comm-sales', 'crs-video-agency', 'crs-equity-finance'],
    accountStatus: 'Active',
    emailVerified: true,
    mobileOtpVerified: true,
    kycStatus: 'Pending',
    panNumber: 'BPLPP9912K',
    bankAccount: 'SBIN0004122 •••• 9012',
    ifscCode: 'SBIN0004122',
    upiId: 'priyapatel@sbi',
    joinedAt: '19 Sep 2026',
    streakDays: 7,
    dailyGoalMinutes: 30,
    todayWatchedMinutes: 20,
    wishlistCourseIds: ['crs-fullstack-ai'],
    sessions: [],
  },
];

export const INITIAL_REFERRAL_TREE: ReferralNode[] = [
  {
    id: 'ref-1',
    userId: 'CM948104',
    name: 'Aarav Sharma',
    city: 'New Delhi, DL',
    phone: '+91 98112 •••40',
    packagePurchased: 'Elite Package',
    packageId: 'pkg-elite',
    tier: 1,
    joinedDate: '04 Sep 2026',
    purchaseAmount: 10999,
    commissionEarned: 7149,
    commissionStatus: 'Paid',
  },
  {
    id: 'ref-2',
    userId: 'CM948319',
    name: 'Priya Patel',
    city: 'Ahmedabad, GJ',
    phone: '+91 97240 •••90',
    packagePurchased: 'Finance Mastery',
    packageId: 'pkg-finance',
    tier: 1,
    joinedDate: '19 Sep 2026',
    purchaseAmount: 5499,
    commissionEarned: 3574,
    commissionStatus: 'Paid',
  },
  {
    id: 'ref-3',
    userId: 'CM948611',
    name: 'Karanveer Gill',
    city: 'Chandigarh, PB',
    phone: '+91 98765 •••12',
    packagePurchased: 'Prime Package',
    packageId: 'pkg-prime',
    tier: 1,
    joinedDate: '27 Sep 2026',
    purchaseAmount: 7999,
    commissionEarned: 5199,
    commissionStatus: 'Approved',
  },
  {
    id: 'ref-4',
    userId: 'CM948740',
    name: 'Sneha Reddy',
    city: 'Hyderabad, TS',
    phone: '+91 90004 •••55',
    packagePurchased: 'Pro Package',
    packageId: 'pkg-pro',
    tier: 1,
    joinedDate: '01 Oct 2026',
    purchaseAmount: 3999,
    commissionEarned: 2599,
    commissionStatus: 'Payable',
  },
  {
    id: 'ref-5',
    userId: 'CM948812',
    name: 'Devansh Joshi (Referred by Aarav)',
    city: 'Indore, MP',
    phone: '+91 94250 •••81',
    packagePurchased: 'Prime Package',
    packageId: 'pkg-prime',
    tier: 2,
    joinedDate: '03 Oct 2026',
    purchaseAmount: 7999,
    commissionEarned: 800,
    commissionStatus: 'Eligible',
  },
  {
    id: 'ref-6',
    userId: 'CM948905',
    name: 'Harshvardhan Singh',
    city: 'Lucknow, UP',
    phone: '+91 88002 •••19',
    packagePurchased: 'Marketing Mastery',
    packageId: 'pkg-marketing',
    tier: 1,
    joinedDate: '05 Oct 2026',
    purchaseAmount: 1499,
    commissionEarned: 974,
    commissionStatus: 'Pending',
  },
];

export const INITIAL_CLICK_LOGS: ReferralClickLog[] = [
  {
    id: 'clk-1',
    timestamp: '05 Oct 2026, 10:14 PM',
    source: 'WhatsApp Share',
    visitorIp: '49.36.210.14',
    device: 'Android 15 • Chrome Mobile',
    city: 'Lucknow, UP',
    convertedToRegistration: true,
    convertedToPurchase: true,
    attributedUserId: 'CM948905',
  },
  {
    id: 'clk-2',
    timestamp: '05 Oct 2026, 08:40 PM',
    source: 'Instagram Bio',
    visitorIp: '106.215.88.102',
    device: 'iOS 19 • Instagram In-App',
    city: 'Bhopal, MP',
    convertedToRegistration: true,
    convertedToPurchase: false,
  },
  {
    id: 'clk-3',
    timestamp: '04 Oct 2026, 04:12 PM',
    source: 'Direct QR Scan',
    visitorIp: '103.88.14.91',
    device: 'Android 14 • Samsung Internet',
    city: 'Jaipur, RJ',
    convertedToRegistration: true,
    convertedToPurchase: true,
    attributedUserId: 'CM948740',
  },
  {
    id: 'clk-4',
    timestamp: '03 Oct 2026, 11:25 AM',
    source: 'YouTube Description',
    visitorIp: '157.42.190.11',
    device: 'Windows 11 • Edge',
    city: 'Pune, MH',
    convertedToRegistration: false,
    convertedToPurchase: false,
  },
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'WD-2026-409',
    userId: 'CM948201',
    userName: 'Sandeep Kumar Barupal',
    amount: 10723,
    tdsDeducted: 536,
    netPayable: 10187,
    method: 'UPI Instant',
    accountDetails: 'sandeep.barupal@okhdfcbank',
    status: 'Paid',
    requestedAt: '21 Sep 2026',
    processedAt: '21 Sep 2026, 04:15 PM',
    utrReference: 'UTR626419884210',
  },
  {
    id: 'WD-2026-512',
    userId: 'CM948201',
    userName: 'Sandeep Kumar Barupal',
    amount: 5199,
    tdsDeducted: 260,
    netPayable: 4939,
    method: 'NEFT / IMPS Bank',
    accountDetails: 'HDFC0001492 •••• 7821',
    status: 'Pending',
    requestedAt: '04 Oct 2026',
  },
  {
    id: 'WD-2026-518',
    userId: 'CM948104',
    userName: 'Aarav Sharma',
    amount: 14200,
    tdsDeducted: 710,
    netPayable: 13490,
    method: 'UPI Instant',
    accountDetails: 'aaravpro@icici',
    status: 'Pending',
    requestedAt: '05 Oct 2026',
  },
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ORD-2026-8812',
    invoiceNumber: 'INV-CM-26-0812',
    userId: 'CM948201',
    userName: 'Sandeep Kumar Barupal',
    userEmail: 'kumarbarupalsandeep@gmail.com',
    userState: 'Rajasthan (08)',
    packageId: 'pkg-pro',
    packageName: 'Pro Package (18 Courses Bundle)',
    baseAmount: 3389,
    couponCode: 'CAREER20',
    discountAmount: 0,
    taxableAmount: 3389,
    gstAmount: 610,
    finalAmount: 3999,
    gateway: 'Razorpay',
    paymentMethod: 'UPI QR / Intent',
    transactionId: 'pay_Rzp9948120041',
    status: 'Success',
    referralCodeUsed: 'CM-VIKRAM01',
    commissionGenerated: 2599,
    createdAt: '12 Aug 2026, 02:18 PM',
  },
  {
    id: 'ORD-2026-9104',
    invoiceNumber: 'INV-CM-26-0904',
    userId: 'CM948104',
    userName: 'Aarav Sharma',
    userEmail: 'aarav.sharma@outlook.in',
    userState: 'Delhi (07)',
    packageId: 'pkg-elite',
    packageName: 'Elite Package (All 42 Courses)',
    baseAmount: 9321,
    discountAmount: 0,
    taxableAmount: 9321,
    gstAmount: 1678,
    finalAmount: 10999,
    gateway: 'PhonePe PG',
    paymentMethod: 'UPI QR / Intent',
    transactionId: 'T26090418299012',
    status: 'Success',
    referralCodeUsed: 'SANDEEP90',
    commissionGenerated: 7149,
    createdAt: '04 Sep 2026, 06:45 PM',
  },
  {
    id: 'ORD-2026-9388',
    invoiceNumber: 'INV-CM-26-0988',
    userId: 'CM948319',
    userName: 'Priya Patel',
    userEmail: 'priya.patel.design@gmail.com',
    userState: 'Gujarat (24)',
    packageId: 'pkg-finance',
    packageName: 'Finance Mastery (24 Courses)',
    baseAmount: 4660,
    discountAmount: 0,
    taxableAmount: 4660,
    gstAmount: 839,
    finalAmount: 5499,
    gateway: 'Cashfree',
    paymentMethod: 'HDFC NetBanking',
    transactionId: 'cf_txn_88412095',
    status: 'Success',
    referralCodeUsed: 'SANDEEP90',
    commissionGenerated: 3574,
    createdAt: '19 Sep 2026, 11:30 AM',
  },
];

export const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'CERT-2026-884920',
    userId: 'CM948201',
    studentName: 'Sandeep Kumar Barupal',
    courseId: 'crs-comm-sales',
    courseTitle: 'Executive English, Public Speaking & High-Ticket B2B Closing',
    packageName: 'Pro Package',
    instructorName: 'Meera Deshmukh',
    issueDate: '28 Aug 2026',
    quizScorePct: 100,
    status: 'Valid',
    verificationUrl: 'https://careermize.in/certificate/CERT-2026-884920',
  },
  {
    id: 'CERT-2026-901245',
    userId: 'CM948104',
    studentName: 'Aarav Sharma',
    courseId: 'crs-meta-ads',
    courseTitle: 'Performance Marketing: Meta & Google Ads Scaling Blueprint',
    packageName: 'Elite Package',
    instructorName: 'Vikramaditya Rathore',
    issueDate: '15 Sep 2026',
    quizScorePct: 100,
    status: 'Valid',
    verificationUrl: 'https://careermize.in/certificate/CERT-2026-901245',
  },
];

export const INITIAL_COUPONS: CouponCode[] = [
  {
    id: 'cpn-1',
    code: 'CAREER20',
    discountType: 'Percentage',
    value: 20,
    minOrderAmount: 1499,
    maxDiscount: 2200,
    applicablePackageId: 'ALL',
    usageCount: 342,
    usageLimit: 1000,
    expiryDate: '31 Dec 2026',
    isActive: true,
  },
  {
    id: 'cpn-2',
    code: 'ELITE1500',
    discountType: 'Fixed',
    value: 1500,
    minOrderAmount: 7999,
    maxDiscount: 1500,
    applicablePackageId: 'pkg-elite',
    usageCount: 128,
    usageLimit: 500,
    expiryDate: '30 Nov 2026',
    isActive: true,
  },
  {
    id: 'cpn-3',
    code: 'WELCOME500',
    discountType: 'Fixed',
    value: 500,
    minOrderAmount: 2499,
    maxDiscount: 500,
    applicablePackageId: 'ALL',
    usageCount: 890,
    usageLimit: 2000,
    expiryDate: '31 Dec 2026',
    isActive: true,
  },
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-9042',
    userId: 'CM948201',
    userName: 'Sandeep Kumar Barupal',
    category: 'Service Order Delivery',
    subject: 'Custom UTM tracking request for SRV-ORD-2026-401 Meta Funnel',
    message: 'Hi team, please include dynamic campaign_id and adset_name parameters in our Meta Ads setup for JaipurCrafts.',
    priority: 'High',
    status: 'Resolved',
    createdAt: '03 Oct 2026',
    adminReply: 'Updated! Our specialist Rohan Kulkarni has configured dynamic UTM parameters across all 6 ad sets.',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-0',
    channel: 'In-App',
    title: 'Service Order SRV-ORD-2026-401 Update: CAPI Audit Uploaded',
    body: 'Specialist Rohan Kulkarni attached the Event Match Quality (8.8/10) verification report to your order.',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'notif-1',
    channel: 'WhatsApp',
    title: 'New Tier-1 Referral Commission Credited (+₹974)',
    body: 'Harshvardhan Singh (CM948905) enrolled in Marketing Mastery using your code SANDEEP90.',
    timestamp: '18 mins ago',
    read: false,
  },
  {
    id: 'notif-3',
    channel: 'Email',
    title: 'Tax Invoice INV-CM-26-0812 Generated',
    body: 'Your GST-compliant invoice is available for PDF download.',
    timestamp: '2 days ago',
    read: true,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-0',
    actor: 'Vikramaditya Rathore',
    role: 'Manager',
    action: 'Assigned specialist Rohan Kulkarni to Dropservicing Order SRV-ORD-2026-401 (Margin ₹9,499)',
    module: 'Dropservicing Fulfillment',
    ipAddress: '106.51.82.19',
    timestamp: '05 Oct 2026, 10:20 PM',
  },
  {
    id: 'aud-1',
    actor: 'Razorpay Webhook Engine',
    role: 'System',
    action: 'Verified HMAC-SHA256 signature for pay_Rzp9948120041 & unlocked Pro Package',
    module: 'Payment Webhook',
    ipAddress: '52.66.141.10',
    timestamp: '05 Oct 2026, 10:15 PM',
  },
  {
    id: 'aud-2',
    actor: 'Commission Attribution Engine',
    role: 'System',
    action: 'Attributed Tier-1 (65%) + Tier-2 (10%) referral split for ref=SANDEEP90',
    module: 'Commission Engine',
    ipAddress: '10.0.4.12',
    timestamp: '05 Oct 2026, 10:15 PM',
  },
];
