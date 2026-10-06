import React, { useState, useMemo } from 'react';
import {
  Search,
  Play,
  ArrowUpRight,
  Check,
  BookOpen,
  Award,
  ShieldCheck,
  SlidersHorizontal,
  Heart,
  X,
  Lock,
  Unlock,
  FileText,
  Clock,
  Briefcase,
  Layers,
} from 'lucide-react';
import {
  ASSETS,
  CareermizePackage,
  Course,
  DropServiceItem,
  UserProfile,
} from '../data/careermizeData';

interface PublicExploreViewProps {
  dropServices: DropServiceItem[];
  packages: CareermizePackage[];
  courses: Course[];
  currentUser: UserProfile;
  onSelectServiceForOrder: (service: DropServiceItem) => void;
  onSelectPackageForCheckout: (pkg: CareermizePackage, isUpgrade?: boolean) => void;
  onOpenCourseInLms: (courseId: string) => void;
  onToggleWishlist: (courseId: string) => void;
  onOpenRegisterModal: (prefillRefCode?: string) => void;
  onOpenCertificateVerify: (certId?: string) => void;
}

export const PublicExploreView: React.FC<PublicExploreViewProps> = ({
  dropServices,
  packages,
  courses,
  currentUser,
  onSelectServiceForOrder,
  onSelectPackageForCheckout,
  onOpenCourseInLms,
  onToggleWishlist,
  onOpenRegisterModal,
  onOpenCertificateVerify,
}) => {
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'duration'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [showComparisonMatrix, setShowComparisonMatrix] = useState<boolean>(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const activeUserPkg = useMemo(
    () => packages.find((p) => p.id === currentUser.activePackageId),
    [packages, currentUser.activePackageId]
  );

  const getCoverImage = (coverType: 'marketing' | 'finance' | 'elite') => {
    if (coverType === 'marketing') return ASSETS.pkgMarketingImg;
    if (coverType === 'finance') return ASSETS.pkgFinanceImg;
    return ASSETS.pkgEliteImg;
  };

  const serviceCategories = [
    'ALL',
    'Performance Marketing',
    'Web & SaaS Engineering',
    'Video & Creative Production',
    'SEO & Content Systems',
    'Financial Advisory & Modeling',
  ];

  const activeServices = useMemo(() => {
    return dropServices
      .filter((s) => s.status === 'Active')
      .filter((s) =>
        selectedServiceCategory === 'ALL' ? true : s.category === selectedServiceCategory
      );
  }, [dropServices, selectedServiceCategory]);

  const categories = [
    'ALL',
    'Digital Marketing',
    'Finance & Equity',
    'Full-Stack & AI',
    'Communication & Soft Skills',
    'Creator & Freelancing',
  ];

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => c.status === 'Published')
      .filter((c) => (selectedCategory === 'ALL' ? true : c.category === selectedCategory))
      .filter((c) => (selectedLanguage === 'ALL' ? true : c.language === selectedLanguage))
      .filter((c) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.instructorName.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.enrollmentCount - a.enrollmentCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-asc') return a.price - b.price;
        return b.durationHours - a.durationHours;
      });
  }, [courses, selectedCategory, selectedLanguage, sortBy, searchQuery]);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION — Single Dominant Visual Carrier + Proposition */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Proposition & Direct Actions */}
            <div className="space-y-6 lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span>ISO 9001:2015 Certified Execution & Skill Platform</span>
                <span aria-hidden="true">·</span>
                <span>Turnkey Digital Services & 42 Mastery Courses</span>
                <span aria-hidden="true">·</span>
                <span>Dedicated Account & Mentorship Desk</span>
              </div>

              <h1 className="font-display text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[52px]">
                Deploy turnkey digital services or master the skills in-house.
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-slate-300">
                Order vetted Done-For-You growth, engineering, video production, and financial
                modeling deliverables with guaranteed turnaround SLAs—or upskill your team with
                Careermize’s 6 career mastery bundles and verified partner ecosystem.
              </p>

              {/* Primary & Secondary Actions */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#dropservices-section"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0284C7] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0369A1] whitespace-nowrap"
                >
                  <span>Explore Turnkey Services</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <a
                  href="#packages-section"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-800 whitespace-nowrap"
                >
                  <span>View 6 Skill Bundles</span>
                </a>

                <button
                  onClick={() => onOpenCertificateVerify('CERT-2026-884920')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline whitespace-nowrap"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Verify Certificate ID</span>
                </button>
              </div>

              {/* Quantitative Proof Strip — Tabular Numerals */}
              <div className="grid grid-cols-3 gap-6 border-t border-slate-800 pt-8">
                <div>
                  <p className="font-mono text-2xl font-semibold text-white tabular-nums">
                    1,669+
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Done-For-You Client Service Projects Delivered On SLA
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-semibold text-white tabular-nums">
                    1,12,390+
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Active Learners Enrolled Across 28 Indian States
                  </p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-semibold text-white tabular-nums">
                    ₹4.82 Cr+
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Partner Commissions Settled via Instant UPI & NEFT
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact 16:9 Studio Visual Carrier */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                <div className="aspect-video w-full overflow-hidden bg-slate-800">
                  {!imgErrors['hero'] ? (
                    <img
                      src={ASSETS.heroStudioImg}
                      alt="Careermize digital skill academy and service fulfillment studio in Bengaluru"
                      referrerPolicy="no-referrer"
                      onError={() => setImgErrors((prev) => ({ ...prev, hero: true }))}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 p-6 text-center">
                      <BookOpen className="h-10 w-10 text-sky-400" />
                      <p className="mt-2 text-sm font-medium text-white">
                        Careermize Delivery & Learning Studio
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Measured Scrim Caption */}
                <div className="border-t border-slate-800 bg-slate-900/95 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={ASSETS.avatarInstructorImg}
                        alt="Vikramaditya Rathore"
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Vetted Specialist Delivery & Faculty
                        </p>
                        <p className="text-xs text-slate-400">
                          SLA-Backed Project Execution · Live Weekend Mentorship
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenCourseInLms('crs-meta-ads')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20 whitespace-nowrap"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Preview LMS</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DONE-FOR-YOU DROPSERVICING CATALOG (Client-Facing Only; Vendor Costs Hidden) */}
      <section id="dropservices-section" className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium text-sky-700">
              01. Turnkey Managed Digital Services (Done-For-You Execution)
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-slate-900">
              Order Production-Ready Agency Deliverables
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Select a standardized service package, submit your project brief at checkout, and
              track milestone delivery directly inside your Client Workspace.
            </p>
          </div>
        </div>

        {/* Interactive Service Category Filter */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-100 p-1.5">
          {serviceCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedServiceCategory(cat)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedServiceCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'ALL' ? 'All Turnkey Services' : cat}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeServices.map((srv) => (
            <div
              key={srv.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-slate-300"
            >
              <div>
                {/* Unboxed Metadata Line */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-medium text-sky-700">{srv.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{srv.turnaroundDays} Days Delivery</span>
                  <span aria-hidden="true">·</span>
                  <span>{srv.revisionsIncluded} Revisions</span>
                </div>

                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-slate-900">
                  {srv.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {srv.shortSummary}
                </p>

                {/* Concrete Deliverables */}
                <div className="mt-4 border-t border-slate-100 pt-3.5">
                  <p className="text-[11px] font-semibold text-slate-800">
                    Included Deliverables:
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                    {srv.deliverables.map((deliv, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
                      ₹{srv.clientPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="ml-2 font-mono text-xs text-slate-400 line-through tabular-nums">
                      ₹{srv.mrp.toLocaleString('en-IN')}
                    </span>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      GST Invoice Included · ★ {srv.rating.toFixed(1)} ({srv.completedOrdersCount} Delivered)
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectServiceForOrder(srv)}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap"
                  >
                    Order Service
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PACKAGE SYSTEM — The 6 Official Careermize Bundles */}
      <section id="packages-section" className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium text-sky-700">
              02. Structured Skill Bundles & Upgrade Path
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-slate-900">
              Six Career Mastery Packages
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Every higher package automatically includes all courses from previous bundles. Existing
              members can upgrade anytime by paying only the differential amount.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComparisonMatrix((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{showComparisonMatrix ? 'Hide Comparison Matrix' : 'Compare All 6 Bundles'}</span>
            </button>
          </div>
        </div>

        {/* Optional Full Package Comparison Matrix */}
        {showComparisonMatrix && (
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                  <th className="py-3.5 px-4">Bundle Specification</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="py-3.5 px-4 whitespace-nowrap">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-700">Offer Price (Inc. GST)</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="py-3 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                      ₹{pkg.price.toLocaleString('en-IN')}{' '}
                      <span className="font-normal text-slate-400 line-through">
                        ₹{pkg.mrp.toLocaleString('en-IN')}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-700">Total Included Courses</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="py-3 px-4 font-mono text-slate-800 tabular-nums">
                      {pkg.courseCount} Courses
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-700">Tier-1 Direct Referral Commission</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="py-3 px-4 font-mono font-semibold text-emerald-700 tabular-nums">
                      {pkg.directCommissionPct}% (₹{Math.round((pkg.price * pkg.directCommissionPct) / 100).toLocaleString('en-IN')})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-700">Tier-2 Passive Commission</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="py-3 px-4 font-mono text-slate-700 tabular-nums">
                      {pkg.passiveCommissionPct}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-700">Access Validity & Certificates</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="py-3 px-4 text-slate-700">
                      Lifetime · QR Verified
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 6 Package Cards Grid — Single-Elevation Depth, Zero-Pill Metadata */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, idx) => {
            const isCurrentPkg = currentUser.activePackageId === pkg.id;
            const canUpgrade =
              activeUserPkg && pkg.price > activeUserPkg.price && !isCurrentPkg;
            const upgradeDelta = canUpgrade ? pkg.price - activeUserPkg.price : pkg.price;
            const coverSrc = getCoverImage(pkg.coverType);

            return (
              <div
                key={pkg.id}
                className={`flex flex-col justify-between rounded-xl border bg-white transition-colors ${
                  pkg.badgeType === 'Flagship' || pkg.badgeType === 'Popular'
                    ? 'border-slate-900'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Package 16:9 Image Header */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl bg-slate-900 border-b border-slate-200">
                    {!imgErrors[pkg.id] ? (
                      <img
                        src={coverSrc}
                        alt={pkg.name}
                        referrerPolicy="no-referrer"
                        onError={() => setImgErrors((prev) => ({ ...prev, [pkg.id]: true }))}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800 text-white">
                        <span className="font-display text-lg">{pkg.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <p className="text-xs font-medium text-sky-300">
                          0{idx + 1}. {pkg.audienceLabel}
                        </p>
                        <h3 className="font-display text-xl font-semibold text-white">
                          {pkg.name}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-slate-200 tabular-nums">
                        {pkg.courseCount} Courses
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Unboxed Metadata Line */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                      <span>{pkg.language}</span>
                      <span aria-hidden="true">·</span>
                      <span>{pkg.durationLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {pkg.enrollmentsCount.toLocaleString('en-IN')} Enrolled
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {pkg.description}
                    </p>

                    {/* Pricing Block */}
                    <div className="mt-5 flex items-baseline justify-between border-y border-slate-100 py-3.5">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                          <span className="font-mono text-xs text-slate-400 line-through tabular-nums">
                            ₹{pkg.mrp.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Includes 18% GST Invoice · Lifetime Access
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-mono text-xs font-semibold text-emerald-700 tabular-nums">
                          {pkg.directCommissionPct}% Partner Share
                        </p>
                        <p className="text-[11px] text-slate-500">
                          +{pkg.passiveCommissionPct}% Tier-2 Passive
                        </p>
                      </div>
                    </div>

                    {/* Key Features List */}
                    <ul className="mt-4 space-y-2 text-xs text-slate-700">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="border-t border-slate-100 px-6 py-4">
                  {isCurrentPkg ? (
                    <button
                      onClick={() => onOpenCourseInLms(pkg.includedCourseIds[0])}
                      className="w-full rounded-lg border border-emerald-600 bg-emerald-50/70 px-4 py-2.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 whitespace-nowrap"
                    >
                      ✓ Active Package — Open My Courses
                    </button>
                  ) : canUpgrade ? (
                    <button
                      onClick={() => onSelectPackageForCheckout(pkg, true)}
                      className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap"
                    >
                      Upgrade for Differential ₹{upgradeDelta.toLocaleString('en-IN')}
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectPackageForCheckout(pkg, false)}
                      className="w-full rounded-lg bg-[#0284C7] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0369A1] whitespace-nowrap"
                    >
                      Enroll in {pkg.name} — ₹{pkg.price.toLocaleString('en-IN')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COURSE DISCOVERY & HIERARCHICAL CURRICULUM CATALOG */}
      <section id="courses-section" className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium text-sky-700">
              03. Individual Course Discovery & Curriculum Preview
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-slate-900">
              Explore Practical Video Courses
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Inspect chapter-by-chapter video durations, downloadable worksheets, and assessment
              criteria before enrolling.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, mentors, skills..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none"
              />
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              aria-label="Filter by language"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-sky-600 focus:outline-none"
            >
              <option value="ALL">All Languages</option>
              <option value="Hindi & English">Hindi & English</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort courses"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-sky-600 focus:outline-none"
            >
              <option value="popular">Sort: Most Enrolled</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-asc">Sort: Price Low to High</option>
              <option value="duration">Sort: Longest Duration</option>
            </select>
          </div>
        </div>

        {/* Interactive Category Filter Segmented Control */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-100 p-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm font-medium text-slate-800">
              No courses matched your filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white"
            >
              Reset Course Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
              const isWishlisted = currentUser.wishlistCourseIds.includes(course.id);
              const totalLessons = course.chapters.reduce(
                (acc, ch) => acc + ch.lessons.length,
                0
              );

              return (
                <div
                  key={course.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-slate-300"
                >
                  <div>
                    {/* Quiet 1-line text kicker with Wishlist button */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-medium text-sky-700">{course.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.level}</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.language}</span>
                      </div>

                      <button
                        onClick={() => onToggleWishlist(course.id)}
                        aria-label="Toggle course wishlist"
                        className={`rounded p-1 transition-colors ${
                          isWishlisted
                            ? 'text-rose-600'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`}
                        />
                      </button>
                    </div>

                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-slate-900">
                      {course.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {course.shortDescription}
                    </p>

                    {/* Instructor & Stats Unboxed Metadata */}
                    <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">{course.instructorName}</p>
                      <p className="text-[11px] text-slate-500">{course.instructorTitle}</p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-slate-500 tabular-nums">
                        <span>{course.durationHours}h total</span>
                        <span aria-hidden="true">·</span>
                        <span>{totalLessons} lessons</span>
                        <span aria-hidden="true">·</span>
                        <span>★ {course.rating.toFixed(1)} ({course.reviewCount})</span>
                        <span aria-hidden="true">·</span>
                        <span>{course.enrollmentCount.toLocaleString('en-IN')} learners</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
                          ₹{course.price.toLocaleString('en-IN')}
                        </span>
                        <span className="ml-1.5 font-mono text-xs text-slate-400 line-through tabular-nums">
                          ₹{course.mrp.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewCourse(course)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
                        >
                          Syllabus
                        </button>
                        <button
                          onClick={() => onOpenCourseInLms(course.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>{isEnrolled ? 'Resume' : 'Preview'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. ATTRIBUTABLE LEARNER & CLIENT OUTCOMES */}
      <section className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 gap-8 rounded-xl border border-slate-200 bg-white p-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            <p className="text-xs font-medium text-sky-700">
              04. Verified Client Deliverables & Learner Outcomes
            </p>
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Built for measurable business & career execution.
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Every service order and skill bundle includes dedicated WhatsApp Live Support and
              scheduled mentorship calls so clients and learners never get stuck on technical setups
              or project milestones.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenCertificateVerify('CERT-2026-884920')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 whitespace-nowrap"
              >
                <Award className="h-4 w-4 text-sky-700" />
                <span>Verify Issued Credential ID</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            <div className="rounded-lg border border-slate-200 p-5">
              <p className="font-mono text-xs font-semibold text-emerald-700">
                OUTCOME · ₹45,000/MO FREELANCE RETAINER
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                “Applied the 3:2:2 Meta Ads creative testing matrix for a diagnostic clinic in Pune.
                Reduced their cost-per-lead from ₹185 to ₹42 in two weeks and signed an ongoing
                retainer.”
              </p>
              <p className="mt-4 text-xs font-semibold text-slate-900">
                Rohan Kulkarni · Pune, Maharashtra
              </p>
              <p className="text-xs text-slate-500">
                Enrolled in Pro Package · Verified Certificate CERT-2026-771024
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-5">
              <p className="font-mono text-xs font-semibold text-emerald-700">
                OUTCOME · 3.4x BLENDED D2C ROAS IN 14 DAYS
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                “Ordered the Done-For-You Meta Pixel & CAPI Funnel Setup. Our Event Match Quality
                jumped from 5.1 to 8.8 within 72 hours and ad attribution stabilized immediately.”
              </p>
              <p className="mt-4 text-xs font-semibold text-slate-900">
                Ananya Verma · Founder, JaipurCrafts D2C
              </p>
              <p className="text-xs text-slate-500">
                Completed Service Order SRV-ORD-2026-341
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SYLLABUS PREVIEW MODAL */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs text-slate-500">
                  {previewCourse.category} · {previewCourse.language} · {previewCourse.durationHours} Hours
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-slate-900">
                  {previewCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewCourse(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs leading-relaxed text-slate-600">
                {previewCourse.description}
              </p>

              <div className="space-y-3">
                {previewCourse.chapters.map((ch) => (
                  <div key={ch.id} className="rounded-lg border border-slate-200 p-4">
                    <h4 className="text-sm font-semibold text-slate-900">{ch.title}</h4>
                    <p className="text-xs text-slate-500">{ch.description}</p>
                    <ul className="mt-3 divide-y divide-slate-100 text-xs">
                      {ch.lessons.map((les) => (
                        <li
                          key={les.id}
                          className="flex items-center justify-between py-2 text-slate-700"
                        >
                          <div className="flex items-center gap-2">
                            {les.isFreePreview ? (
                              <Unlock className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            <span>{les.title}</span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-slate-500 tabular-nums">
                            {les.resources.length > 0 && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-sky-700">
                                <FileText className="h-3 w-3" />
                                {les.resources.length} PDF
                              </span>
                            )}
                            <span>{les.duration}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                onClick={() => setPreviewCourse(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = previewCourse.id;
                  setPreviewCourse(null);
                  onOpenCourseInLms(id);
                }}
                className="rounded-lg bg-[#0284C7] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0369A1]"
              >
                Open in Interactive LMS Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
