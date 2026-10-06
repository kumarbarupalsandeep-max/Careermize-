import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Award,
  MessageSquare,
  CheckCircle2,
  Send,
  FileText,
  Scale,
  Cookie,
  RefreshCcw,
  Star,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { ASSETS, Course, CareermizePackage } from '../data/careermizeData';

export type PublicPageType =
  | 'about'
  | 'instructors'
  | 'testimonials'
  | 'faq'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'refund'
  | 'cookies';

interface PublicPagesModalProps {
  initialPage: PublicPageType;
  courses: Course[];
  packages: CareermizePackage[];
  onClose: () => void;
  onSubmitContactTicket: (payload: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => void;
}

export const PublicPagesView: React.FC<PublicPagesModalProps> = ({
  initialPage,
  courses,
  packages,
  onClose,
  onSubmitContactTicket,
}) => {
  const [activeTab, setActiveTab] = useState<PublicPageType>(initialPage);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('+91 ');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const navItems: Array<{ id: PublicPageType; label: string }> = [
    { id: 'about', label: 'About Us' },
    { id: 'instructors', label: 'Instructors' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact Support' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'refund', label: 'Refund Policy' },
    { id: 'cookies', label: 'Cookie Policy' },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 space-y-8">
      {/* Header & Sub-Nav */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
            Careermize Official Information & Legal Compliance Portal
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-900">
            Organization, Faculty, Student Reviews & Legal Policies
          </h1>
        </div>
        <button
          onClick={onClose}
          className="self-start rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 lg:self-auto"
        >
          ← Back to Catalog & Bundles
        </button>
      </div>

      {/* Horizontal Tab Selector */}
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
              activeTab === item.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 1. ABOUT US */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 gap-8 rounded-xl border border-slate-200 bg-white p-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              ISO 9001:2015 Certified Indian Skill Ecosystem
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900">
              Empowering India’s Next Generation of Digital Operators & Agency Founders
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Careermize EdTech & Digital Fulfillment Pvt. Ltd. (CIN: U80904KA2024PTC182910 · GSTIN:
              29AABCC8841K1Z5) is an execution-first career acceleration and turnkey dropservicing
              platform headquartered in HSR Layout, Bengaluru.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Unlike theoretical video libraries, Careermize combines{' '}
              <strong>{packages.length} structured skill mastery bundles</strong> ({courses.length}{' '}
              deep-dive courses in Hinglish & English), practical graded assignments, QR-verifiable
              certifications, and a transparent multi-tier partner commission engine with statutory
              GST & TDS compliance.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 font-mono">
              <div>
                <p className="text-2xl font-bold text-slate-900">42,800+</p>
                <p className="font-sans text-xs text-slate-500">Enrolled Learners across India</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">₹4.8 Cr+</p>
                <p className="font-sans text-xs text-slate-500">Verified Partner Payouts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-sky-700">99.4%</p>
                <p className="font-sans text-xs text-slate-500">Certificate Verification Uptime</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <img
              src={ASSETS.heroStudioImg}
              alt="Careermize Bengaluru Studio"
              className="h-full w-full rounded-xl object-cover border border-slate-200"
            />
          </div>
        </div>
      )}

      {/* 2. INSTRUCTORS */}
      {activeTab === 'instructors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                name: 'Vikramaditya Rathore',
                role: 'Founder & Lead Performance Marketing Architect',
                exp: '11+ Years · Managed ₹85Cr+ Meta & Google Ad Spend',
                skills: ['Meta CAPI & ROAS Scaling', 'High-Ticket B2B Closings', 'Agency Systems'],
                bio: 'Former Growth Lead at top Indian D2C unicorn. Trains students on live ad managers and server-side pixel attribution.',
                coursesCount: courses.filter((c) => c.instructorName.includes('Vikramaditya'))
                  .length,
              },
              {
                name: 'CA Nidhi Singhania',
                role: 'Lead Faculty — Equity Research, Valuation & GST Compliance',
                exp: '9+ Years · Chartered Accountant & Former Institutional Analyst',
                skills: ['DCF Financial Modeling', 'Nifty Options Hedging', 'Corporate Taxation'],
                bio: 'Specializes in practical balance-sheet forensics, intrinsic valuation, and risk-managed portfolio construction.',
                coursesCount: courses.filter((c) => c.instructorName.includes('Nidhi')).length,
              },
              {
                name: 'Rohan Kulkarni',
                role: 'Principal AI & Full-Stack SaaS Instructor',
                exp: '8+ Years · Ex-Staff Engineer & Video Agency Mentor',
                skills: ['Next.js + TypeScript', 'AI Agent Workflows', 'DaVinci Resolve Retention'],
                bio: 'Helps non-traditional engineers ship production SaaS apps and high-retention commercial video pipelines.',
                coursesCount: courses.filter(
                  (c) =>
                    !c.instructorName.includes('Vikramaditya') &&
                    !c.instructorName.includes('Nidhi')
                ).length,
              },
            ].map((inst) => (
              <div
                key={inst.name}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6"
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <img
                      src={ASSETS.avatarInstructorImg}
                      alt={inst.name}
                      className="h-14 w-14 rounded-full object-cover border border-slate-300"
                    />
                    <div>
                      <h3 className="font-display text-lg font-semibold text-slate-900">
                        {inst.name}
                      </h3>
                      <p className="text-xs font-medium text-sky-700">{inst.role}</p>
                    </div>
                  </div>
                  <p className="mt-3 font-mono text-[11px] font-semibold text-slate-600">
                    {inst.exp}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{inst.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {inst.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Active Database Courses: {inst.coursesCount || 2}</span>
                  <span className="font-semibold text-emerald-700">★ 4.9 Faculty Rating</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              name: 'Sandeep Kumar Barupal',
              city: 'Jaipur, Rajasthan',
              bundle: 'Pro Package + Dropservicing Agency',
              quote:
                'The Meta Ads CAPI module and ROAS calculator helped me land 3 retainer clients in Jaipur within 45 days. The certificate QR verification gave my agency instant credibility.',
              rating: 5,
              verifiedId: 'CERT-2026-884920',
            },
            {
              name: 'Aarav Sharma',
              city: 'New Delhi, NCR',
              bundle: 'Elite Package Partner',
              quote:
                'Both the Full-Stack AI SaaS curriculum and the transparent Tier-1/Tier-2 referral ledger work seamlessly. My IMPS withdrawals were settled with proper UTR numbers.',
              rating: 5,
              verifiedId: 'CERT-2026-901245',
            },
            {
              name: 'Priya Patel',
              city: 'Ahmedabad, Gujarat',
              bundle: 'Finance Mastery Bundle',
              quote:
                'CA Nidhi’s DCF valuation workbook and option hedging modules are better than courses costing 5x more. Highly practical Hinglish explanations.',
              rating: 5,
              verifiedId: 'CM948319',
            },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-slate-200 bg-white p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-mono text-[11px] text-emerald-700 font-semibold">
                  ✓ Verified ID: {t.verifiedId}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">“{t.quote}”</p>
              <div className="border-t border-slate-100 pt-3">
                <p className="font-semibold text-xs text-slate-900">{t.name}</p>
                <p className="text-[11px] text-slate-500">
                  {t.city} · {t.bundle}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. FAQ */}
      {activeTab === 'faq' && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 space-y-5">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Frequently Asked Questions (Packages, LMS, Certificates & Referrals)
          </h2>
          <div className="divide-y divide-slate-200">
            {[
              {
                q: '1. If I enroll in a higher package like Pro or Elite, do I get lower-tier courses included?',
                a: 'Yes! Careermize bundles are cumulative. Enrolling in Pro Package unlocks Marketing Mastery and Soft Skill Mastery courses automatically. Moreover, you can upgrade anytime by paying only the differential amount.',
              },
              {
                q: '2. How are Careermize Certificates generated and verified by employers?',
                a: 'Once you complete all lessons in a course or score 60%+ on the course assessment quiz, the backend automatically issues a unique Certificate ID (e.g., CERT-2026-884920) with a public verification URL (/certificate/{id}).',
              },
              {
                q: '3. How does the Referral / Affiliate commission and payout system work?',
                a: 'Every registered user receives a unique User ID and Refer Code. When a learner registers via your referral link and completes a verified payment, Tier-1 direct commission (up to 70%) and Tier-2 passive commission (up to 12%) are credited. Withdrawals are processed via UPI or NEFT/IMPS with statutory 5% TDS deduction.',
              },
              {
                q: '4. Do I receive a GST-compliant Tax Invoice for my package or service purchase?',
                a: 'Yes. Every order verified by our HMAC-SHA256 payment webhook generates an instant SAC 999293 / 998314 GST Tax Invoice with 18% GST breakup.',
              },
            ].map((item) => (
              <div key={item.q} className="py-4">
                <h3 className="text-sm font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CONTACT US (Connected to Real Support Ticket Backend) */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 lg:col-span-5">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Careermize Live Support Desk
            </h2>
            <p className="text-xs text-slate-600">
              Have questions about bundle enrollment, corporate invoicing, or referral payouts?
              Submit a ticket directly to our database queue or reach us on WhatsApp.
            </p>
            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-sky-700" />
                <span>24th Main, HSR Layout Sector 2, Bengaluru, Karnataka — 560102</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-sky-700" />
                <span className="font-mono">+91 98290-45120 (Mon–Sat, 10 AM – 7 PM IST)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-sky-700" />
                <span className="font-mono">support@careermize.in</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
            <h3 className="font-display text-lg font-semibold text-slate-900">
              Send Direct Support Inquiry (Creates Live Ticket)
            </h3>
            {contactSent && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-900">
                ✓ Your inquiry has been logged in the Careermize Support Ticket database. Our team
                will respond shortly.
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
                onSubmitContactTicket({
                  name: contactName.trim(),
                  email: contactEmail.trim(),
                  phone: contactPhone.trim(),
                  subject: contactSubject.trim() || 'General Public Inquiry',
                  message: contactMessage.trim(),
                });
                setContactSent(true);
                setContactSubject('');
                setContactMessage('');
              }}
              className="mt-4 space-y-3"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Full Name *"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Email Address *"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 Mobile *"
                  className="rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>
              <input
                type="text"
                required
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Subject (e.g., Package Upgrade / GST Invoice / Affiliate KYC) *"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
              />
              <textarea
                rows={4}
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Write your detailed message..."
                className="w-full rounded-lg border border-slate-300 p-3 text-xs"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0284C7] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0369A1]"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. LEGAL POLICIES: TERMS, PRIVACY, REFUND, COOKIES */}
      {(activeTab === 'terms' ||
        activeTab === 'privacy' ||
        activeTab === 'refund' ||
        activeTab === 'cookies') && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 space-y-4 text-xs leading-relaxed text-slate-700">
          {activeTab === 'terms' && (
            <>
              <div className="flex items-center gap-2 text-sky-700 font-semibold">
                <Scale className="h-4 w-4" />
                <span>Effective Date: 01 January 2026 · Careermize Terms of Service</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Terms & Conditions of Use
              </h2>
              <p>
                <strong>1. License & Course Access:</strong> Upon verified payment settlement,
                Careermize grants you a non-exclusive, non-transferable individual license to
                access the courses included in your enrolled Skill Bundle. Sharing login credentials
                or scraping signed HLS video streams will trigger automatic session revocation.
              </p>
              <p>
                <strong>2. Ethical Affiliate & Partner Compliance:</strong> Partners must represent
                course curriculum and commission structures truthfully. Earnings depend on verified
                skill bundle or service referrals; Careermize is an educational and digital
                fulfillment platform, not a passive investment or get-rich-quick scheme.
              </p>
              <p>
                <strong>3. Intellectual Property:</strong> All video lectures, downloadable
                templates, financial models, and assessments remain the exclusive property of
                Careermize EdTech Pvt. Ltd.
              </p>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <div className="flex items-center gap-2 text-sky-700 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>DPDP Act 2023 Compliant · Data Protection Notice</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Privacy Policy</h2>
              <p>
                <strong>1. Information We Collect:</strong> We collect your name, email address,
                WhatsApp mobile number, state/city (for GST place-of-supply compliance), and PAN/Bank
                details (strictly for partners requesting commission payouts under Section 194H TDS
                rules).
              </p>
              <p>
                <strong>2. Cryptographic Security:</strong> Passwords are hashed using PBKDF2-SHA256.
                Payment transactions are processed via PCI-DSS compliant gateways (Razorpay, PhonePe
                PG, Cashfree, PayU) and verified via HMAC-SHA256 webhooks.
              </p>
              <p>
                <strong>3. Zero Third-Party Selling:</strong> We never sell student or client PII to
                external brokers.
              </p>
            </>
          )}

          {activeTab === 'refund' && (
            <>
              <div className="flex items-center gap-2 text-sky-700 font-semibold">
                <RefreshCcw className="h-4 w-4" />
                <span>Transparent Cancellation, Refund & Commission Clawback Policy</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Refund & Cancellation Policy
              </h2>
              <p>
                <strong>1. Skill Bundle Refund Window:</strong> Learners may request a refund within
                7 calendar days of purchase provided less than 20% of the bundle video content has
                been consumed and no completion certificate has been generated.
              </p>
              <p>
                <strong>2. Automatic Commission Reversal:</strong> When a gateway refund or partial
                refund is processed by the Finance Admin, any Tier-1 or Tier-2 referral commission
                attributed to that order ID is automatically reversed in the affiliate ledger.
              </p>
              <p>
                <strong>3. Settlement Timeline:</strong> Approved refunds are credited back to the
                original UPI ID, NetBanking account, or card within 5–7 working days.
              </p>
            </>
          )}

          {activeTab === 'cookies' && (
            <>
              <div className="flex items-center gap-2 text-sky-700 font-semibold">
                <Cookie className="h-4 w-4" />
                <span>Session & Referral Attribution Cookie Policy</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">Cookie Policy</h2>
              <p>
                <strong>1. Essential Authentication Tokens:</strong> Careermize uses encrypted bearer
                session tokens to keep your Student, Instructor, or Manager session authenticated
                and to remember your exact video playback timestamp across devices.
              </p>
              <p>
                <strong>2. 30-Day Referral Attribution Window:</strong> When a visitor clicks a
                partner link (<code>?ref=CODE</code>), a first-party attribution token stores the
                Sponsor Refer Code so the referrer receives proper credit upon registration and
                checkout.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
