import React, { useState, useMemo, useEffect } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Lock,
  FileText,
  Download,
  Bookmark,
  Award,
  MessageSquare,
  PhoneCall,
  Shield,
  Bell,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Trash2,
  Send,
  ExternalLink,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import {
  CareermizePackage,
  CertificateRecord,
  Course,
  DropServiceItem,
  NotificationItem,
  OrderRecord,
  ServiceOrderRecord,
  StudentNote,
  SupportTicket,
  UserProfile,
} from '../data/careermizeData';

interface StudentLmsViewProps {
  currentUser: UserProfile;
  dropServices: DropServiceItem[];
  serviceOrders: ServiceOrderRecord[];
  onSelectServiceForOrder: (service: DropServiceItem) => void;
  onClientApproveServiceOrder: (orderId: string, feedback: string) => void;
  packages: CareermizePackage[];
  courses: Course[];
  selectedCourseId: string;
  onSelectCourseId: (courseId: string) => void;
  completedLessons: string[];
  onToggleLessonComplete: (lessonId: string, courseId: string) => void;
  notes: StudentNote[];
  onAddNote: (note: Omit<StudentNote, 'id' | 'createdAt'>) => void;
  onDeleteNote: (noteId: string) => void;
  quizScores: Record<string, number>;
  onSubmitQuizScore: (courseId: string, scorePct: number) => void;
  assignmentsSubmitted: Record<string, { content: string; submittedAt: string; status: string }>;
  onSubmitAssignment: (courseId: string, content: string) => void;
  certificates: CertificateRecord[];
  orders: OrderRecord[];
  notifications: NotificationItem[];
  supportTickets: SupportTicket[];
  onCreateTicket: (category: SupportTicket['category'], subject: string, message: string) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onRevokeSession: (sessionId: string) => void;
  onOpenCertificateModal: (cert: CertificateRecord) => void;
  onOpenInvoiceModal: (order: OrderRecord) => void;
  onSelectPackageForCheckout: (pkg: CareermizePackage, isUpgrade?: boolean) => void;
}

export const StudentLmsView: React.FC<StudentLmsViewProps> = ({
  currentUser,
  dropServices,
  serviceOrders,
  onSelectServiceForOrder,
  onClientApproveServiceOrder,
  packages,
  courses,
  selectedCourseId,
  onSelectCourseId,
  completedLessons,
  onToggleLessonComplete,
  notes,
  onAddNote,
  onDeleteNote,
  quizScores,
  onSubmitQuizScore,
  assignmentsSubmitted,
  onSubmitAssignment,
  certificates,
  orders,
  notifications,
  supportTickets,
  onCreateTicket,
  onUpdateProfile,
  onRevokeSession,
  onOpenCertificateModal,
  onOpenInvoiceModal,
  onSelectPackageForCheckout,
}) => {
  const [subTab, setSubTab] = useState<
    'dashboard' | 'service-orders' | 'player' | 'profile' | 'support'
  >('dashboard');
  const [feedbackInputs, setFeedbackInputs] = useState<Record<string, string>>({});
  const [deliverableToast, setDeliverableToast] = useState<string | null>(null);

  const myServiceOrders = useMemo(
    () => serviceOrders.filter((so) => so.clientId === currentUser.id),
    [serviceOrders, currentUser.id]
  );

  const activeCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) || courses[0],
    [courses, selectedCourseId]
  );

  const allCourseLessons = useMemo(
    () => activeCourse.chapters.flatMap((ch) => ch.lessons),
    [activeCourse]
  );

  const [activeLessonId, setActiveLessonId] = useState<string>(
    allCourseLessons[0]?.id || 'les-1001'
  );

  useEffect(() => {
    const firstLesson = activeCourse.chapters[0]?.lessons[0];
    if (firstLesson) {
      setActiveLessonId(firstLesson.id);
    }
  }, [activeCourse.id]);

  const activeLesson = useMemo(
    () => allCourseLessons.find((l) => l.id === activeLessonId) || allCourseLessons[0],
    [allCourseLessons, activeLessonId]
  );

  // Interactive Video Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(38);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1x' | '1.25x' | '1.5x' | '2x'>('1x');
  const [resolution, setResolution] = useState<'1080p Signed HLS' | '720p HD' | '480p Data Saver'>(
    '1080p Signed HLS'
  );
  const [playerWorkspaceTab, setPlayerWorkspaceTab] = useState<
    'notes' | 'resources' | 'quiz' | 'assignment'
  >('notes');

  // Notes input state
  const [noteInput, setNoteInput] = useState('');
  const [resourceToast, setResourceToast] = useState<string | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResultMessage, setQuizResultMessage] = useState<string | null>(null);

  // Assignment state
  const [assignmentText, setAssignmentText] = useState('');

  // Profile Edit State
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editState, setEditState] = useState(currentUser.state);
  const [editCity, setEditCity] = useState(currentUser.city);
  const [editUpi, setEditUpi] = useState(currentUser.upiId);
  const [editPan, setEditPan] = useState(currentUser.panNumber);
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);

  // Support Ticket State
  const [ticketCategory, setTicketCategory] =
    useState<SupportTicket['category']>('Service Order Delivery');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [whatsappBanner, setWhatsappBanner] = useState<string | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setProgressPct((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 1;
      });
    }, 650);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const enrolledCourses = useMemo(
    () => courses.filter((c) => currentUser.enrolledCourseIds.includes(c.id)),
    [courses, currentUser.enrolledCourseIds]
  );

  const getCourseCompletionPct = (course: Course) => {
    const lessons = course.chapters.flatMap((c) => c.lessons);
    if (lessons.length === 0) return 0;
    const done = lessons.filter((l) => completedLessons.includes(l.id)).length;
    return Math.round((done / lessons.length) * 100);
  };

  const overallProgressPct = useMemo(() => {
    if (enrolledCourses.length === 0) return 0;
    const sum = enrolledCourses.reduce((acc, c) => acc + getCourseCompletionPct(c), 0);
    return Math.round(sum / enrolledCourses.length);
  }, [enrolledCourses, completedLessons]);

  const activePackage = useMemo(
    () => packages.find((p) => p.id === currentUser.activePackageId) || packages[2],
    [packages, currentUser.activePackageId]
  );

  const elitePackage = useMemo(
    () => packages.find((p) => p.id === 'pkg-elite') || packages[packages.length - 1],
    [packages]
  );

  const currentLessonIndex = allCourseLessons.findIndex((l) => l.id === activeLesson?.id);

  const formatTimestampFromPct = (pct: number, totalMin: number = 20) => {
    const totalSec = totalMin * 60;
    const currentSec = Math.floor((pct / 100) * totalSec);
    const mm = String(Math.floor(currentSec / 60)).padStart(2, '0');
    const ss = String(currentSec % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const handleGradeQuiz = () => {
    const questions = activeCourse.quiz;
    if (questions.length === 0) return;
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct += 1;
      }
    });
    const pct = Math.round((correct / questions.length) * 100);
    onSubmitQuizScore(activeCourse.id, pct);
    if (pct >= 60) {
      setQuizResultMessage(
        `Assessment Passed with ${pct}%! Your verified Careermize Certificate is now unlocked.`
      );
    } else {
      setQuizResultMessage(
        `You scored ${pct}%. Review the lesson takeaways and retry to achieve 60%+ for certification.`
      );
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8">
      {/* Workspace Header & Sub-Navigation */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Client & Student Workspace</span>
            <span aria-hidden="true">/</span>
            <span className="font-mono text-slate-700">{currentUser.id}</span>
            <span aria-hidden="true">·</span>
            <span>Active Bundle: {activePackage.name}</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-semibold text-slate-900">
            Welcome back, {currentUser.name}
          </h1>
        </div>

        {/* Interactive Workspace Switcher */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setSubTab('dashboard')}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === 'dashboard'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSubTab('service-orders')}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === 'service-orders'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Service Orders ({myServiceOrders.length})
          </button>
          <button
            onClick={() => setSubTab('player')}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === 'player'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Course Player (LMS)
          </button>
          <button
            onClick={() => setSubTab('profile')}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Account & KYC
          </button>
          <button
            onClick={() => setSubTab('support')}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === 'support'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Support Desk
          </button>
        </div>
      </div>

      {/* TAB 1: CLIENT & STUDENT DASHBOARD */}
      {subTab === 'dashboard' && (
        <div className="mt-8 space-y-8">
          {/* Top Metric Grid — Tabular Numerals */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Active Service Projects</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                {myServiceOrders.length} Orders
              </p>
              <button
                onClick={() => setSubTab('service-orders')}
                className="mt-1 text-xs font-semibold text-sky-700 hover:underline"
              >
                Track Project Milestones →
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Enrolled Bundle & Courses</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                {enrolledCourses.length} / {courses.length}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {activePackage.name} · Lifetime Access
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Overall Curriculum Completion</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-sky-700 tabular-nums">
                {overallProgressPct}%
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-sky-600 transition-all"
                  style={{ width: `${overallProgressPct}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Verified Certificates Issued</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-emerald-700 tabular-nums">
                {certificates.filter((c) => c.userId === currentUser.id).length}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                QR-Verified Public Credentials
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* My Enrolled Courses Progress List */}
            <div className="space-y-4 lg:col-span-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  My Enrolled Courses & Progress
                </h2>
                <span className="text-xs text-slate-500">
                  Click any course to launch the interactive video player
                </span>
              </div>

              <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {courses.map((course) => {
                  const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
                  const pct = getCourseCompletionPct(course);
                  const cert = certificates.find(
                    (c) => c.courseId === course.id && c.userId === currentUser.id
                  );

                  return (
                    <div
                      key={course.id}
                      className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-medium text-sky-700">{course.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{course.instructorName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{course.durationHours}h</span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900">{course.title}</h3>
                        <div className="flex items-center gap-3 pt-1">
                          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full bg-emerald-600 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-slate-600 tabular-nums">
                            {pct}% Completed
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {cert && (
                          <button
                            onClick={() => onOpenCertificateModal(cert)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 whitespace-nowrap"
                          >
                            <Award className="h-3.5 w-3.5" />
                            <span>Certificate</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onSelectCourseId(course.id);
                            setSubTab('player');
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                            isEnrolled
                              ? 'bg-slate-900 text-white hover:bg-slate-800'
                              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>{isEnrolled ? 'Continue Learning' : 'Preview Free Lesson'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Package Status, Certificates & Notifications */}
            <div className="space-y-6 lg:col-span-4">
              {/* Package Upgrade Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <p className="text-xs font-medium text-sky-700">Current Package Tier</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-slate-900">
                  {activePackage.name}
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Direct Referral Commission: {activePackage.directCommissionPct}% · Tier-2:{' '}
                  {activePackage.passiveCommissionPct}%
                </p>

                {activePackage.id !== 'pkg-elite' && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-600">
                      Upgrade to <strong>Elite Package (42 Courses)</strong> and unlock 72%
                      commission eligibility by paying only the differential:
                    </p>
                    <button
                      onClick={() => onSelectPackageForCheckout(elitePackage, true)}
                      className="mt-3 w-full rounded-lg bg-[#0284C7] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0369A1] whitespace-nowrap"
                    >
                      Upgrade to Elite — Pay ₹
                      {(elitePackage.price - activePackage.price).toLocaleString('en-IN')}
                    </button>
                  </div>
                )}
              </div>

              {/* Purchase & GST Invoice History */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Purchase & GST Invoices
                </h3>
                <div className="mt-3 divide-y divide-slate-100 text-xs">
                  {orders
                    .filter((o) => o.userId === currentUser.id)
                    .map((ord) => (
                      <div key={ord.id} className="py-3">
                        <div className="flex items-center justify-between font-medium text-slate-900">
                          <span>{ord.packageName}</span>
                          <span className="font-mono tabular-nums">
                            ₹{ord.finalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                          {ord.invoiceNumber} · {ord.gateway} · {ord.status}
                        </p>
                        <button
                          onClick={() => onOpenInvoiceModal(ord)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>View / Print GST Tax Invoice</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Notifications Feed */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    Recent Alerts
                  </h3>
                  <Bell className="h-4 w-4 text-slate-400" />
                </div>
                <div className="mt-3 divide-y divide-slate-100 text-xs">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5">
                      <p className="text-[11px] font-medium text-sky-700">
                        {n.channel} · {n.timestamp}
                      </p>
                      <p className="mt-0.5 font-semibold text-slate-900">{n.title}</p>
                      <p className="mt-0.5 text-slate-600">{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY DROPSERVICING SERVICE ORDERS & DELIVERABLES (Client View Only) */}
      {subTab === 'service-orders' && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium text-sky-700">
                Done-For-You Project Fulfillment Tracker
              </p>
              <h2 className="mt-0.5 font-display text-xl font-semibold text-slate-900">
                My Managed Service Orders & Deliverables
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Inspect specialist deliverables, download completed project assets, or approve final
                milestones.
              </p>
            </div>
            <button
              onClick={() => onSelectServiceForOrder(dropServices[0])}
              className="rounded-lg bg-[#0284C7] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0369A1] whitespace-nowrap"
            >
              + Order New Turnkey Service
            </button>
          </div>

          {deliverableToast && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-900">
              ✓ {deliverableToast}
            </div>
          )}

          {myServiceOrders.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <Briefcase className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-900">
                No active service orders yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Choose a Done-For-You digital service to launch your first project.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myServiceOrders.map((so) => (
                <div
                  key={so.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-semibold text-slate-900">{so.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{so.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>Target: {so.targetUrlOrBrand}</span>
                        <span aria-hidden="true">·</span>
                        <span>Ordered: {so.createdAt}</span>
                      </div>
                      <h3 className="mt-1 font-display text-lg font-semibold text-slate-900">
                        {so.serviceTitle}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-base font-semibold text-slate-900 tabular-nums">
                        ₹{so.finalAmount.toLocaleString('en-IN')}
                      </span>
                      <p className="font-mono text-[11px] font-semibold text-emerald-700">
                        Status: {so.orderStatus}
                      </p>
                    </div>
                  </div>

                  {/* Milestone Pipeline Stepper */}
                  <div className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-xs">
                    {(
                      [
                        'Order Placed',
                        'Brief Verified',
                        'In Production',
                        'Quality Assurance',
                        'Delivered',
                        'Completed',
                      ] as const
                    ).map((step, idx, arr) => {
                      const activeIdx = arr.indexOf(so.orderStatus);
                      const isDoneOrCurrent = idx <= activeIdx;
                      return (
                        <React.Fragment key={step}>
                          <span
                            className={
                              isDoneOrCurrent
                                ? 'font-semibold text-slate-900'
                                : 'text-slate-400'
                            }
                          >
                            {isDoneOrCurrent ? '✓ ' : ''}
                            {step}
                          </span>
                          {idx < arr.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-slate-300" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="font-semibold text-slate-800">Submitted Project Brief:</p>
                      <p className="mt-1 text-slate-600 leading-relaxed">{so.projectBrief}</p>
                      <p className="mt-2 text-[11px] text-slate-500">
                        Assigned Specialist: <strong>{so.assignedSpecialist}</strong>
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="font-semibold text-slate-800">
                        Deliverable Files & Execution Notes:
                      </p>
                      <p className="mt-1 text-slate-600">
                        {so.deliverableNotes || 'Specialist is preparing your initial deliverables.'}
                      </p>
                      {so.deliverableUrl && (
                        <button
                          onClick={() =>
                            setDeliverableToast(
                              `Downloaded deliverable package from ${so.deliverableUrl} for Order ${so.id}.`
                            )
                          }
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-sky-800 hover:bg-slate-100"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Deliverable Package</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Client Sign-Off / Revision Note */}
                  {so.orderStatus !== 'Completed' ? (
                    <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                      <input
                        type="text"
                        value={feedbackInputs[so.id] || ''}
                        onChange={(e) =>
                          setFeedbackInputs((prev) => ({ ...prev, [so.id]: e.target.value }))
                        }
                        placeholder="Add client approval note or revision feedback..."
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                      />
                      <button
                        onClick={() => {
                          onClientApproveServiceOrder(
                            so.id,
                            feedbackInputs[so.id] || 'Approved deliverables — great execution!'
                          );
                          setDeliverableToast(`Order ${so.id} marked as Approved & Completed.`);
                        }}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 whitespace-nowrap"
                      >
                        Approve Delivery & Complete Order
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-emerald-700">
                      ✓ Project Completed & Signed Off · Client Feedback: “{so.clientFeedback}”
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INTERACTIVE COURSE LMS PLAYER */}
      {subTab === 'player' && activeLesson && (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <div>
                <p className="text-xs text-slate-500">Active Course in Player</p>
                <select
                  value={activeCourse.id}
                  onChange={(e) => onSelectCourseId(e.target.value)}
                  className="mt-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 focus:border-sky-600 focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({getCourseCompletionPct(c)}% Done)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentLessonIndex <= 0}
                  onClick={() => {
                    if (currentLessonIndex > 0) {
                      setActiveLessonId(allCourseLessons[currentLessonIndex - 1].id);
                      setProgressPct(0);
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  disabled={currentLessonIndex >= allCourseLessons.length - 1}
                  onClick={() => {
                    if (currentLessonIndex < allCourseLessons.length - 1) {
                      setActiveLessonId(allCourseLessons[currentLessonIndex + 1].id);
                      setProgressPct(0);
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Signed HLS Video Stream Player */}
            <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950 text-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-mono">
                    Signed Stream ID: {activeLesson.signedStreamId}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                  <span>Watermark: {currentUser.email}</span>
                  <span>·</span>
                  <span>DRM Download Protection Active</span>
                </div>
              </div>

              <div className="relative flex aspect-video w-full flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-sky-400">
                      {activeCourse.category} · {activeCourse.instructorName}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
                      {activeLesson.title}
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-slate-300 tabular-nums">
                    {formatTimestampFromPct(progressPct, activeLesson.durationMinutes)} /{' '}
                    {activeLesson.duration}
                  </span>
                </div>

                <div className="my-auto flex flex-col items-center justify-center text-center">
                  <button
                    onClick={() => setIsPlaying((prev) => !prev)}
                    aria-label={isPlaying ? 'Pause lesson video' : 'Play lesson video'}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0284C7] text-white shadow-lg transition-transform hover:scale-105"
                  >
                    {isPlaying ? (
                      <Pause className="h-7 w-7 fill-current" />
                    ) : (
                      <Play className="ml-0.5 h-7 w-7 fill-current" />
                    )}
                  </button>
                  <p className="mt-3 max-w-lg text-xs text-slate-300">
                    {activeLesson.description}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3.5">
                  <p className="text-[11px] font-semibold text-sky-300">
                    Key Lesson Takeaways:
                  </p>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-200">
                    {activeLesson.keyTakeaways.map((kt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-sky-400">0{i + 1}.</span>
                        <span>{kt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-800 bg-slate-900 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-300 tabular-nums">
                    {progressPct}%
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={progressPct}
                    onChange={(e) => setProgressPct(Number(e.target.value))}
                    aria-label="Seek video timeline percentage"
                    className="h-1.5 flex-1 cursor-pointer accent-sky-500"
                  />
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {activeLesson.duration}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIsPlaying((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      <span>{isPlaying ? 'Pause' : 'Resume Playback'}</span>
                    </button>

                    <button
                      onClick={() => setProgressPct(0)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Restart</span>
                    </button>

                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(e.target.value as any)}
                      aria-label="Playback speed"
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 font-mono text-xs text-slate-200"
                    >
                      <option value="1x">Speed: 1.0x</option>
                      <option value="1.25x">Speed: 1.25x</option>
                      <option value="1.5x">Speed: 1.5x</option>
                      <option value="2x">Speed: 2.0x</option>
                    </select>

                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value as any)}
                      aria-label="Stream resolution"
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 font-mono text-xs text-slate-200"
                    >
                      <option value="1080p Signed HLS">1080p Signed HLS</option>
                      <option value="720p HD">720p HD</option>
                      <option value="480p Data Saver">480p Data Saver</option>
                    </select>
                  </div>

                  <button
                    onClick={() => onToggleLessonComplete(activeLesson.id, activeCourse.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                      completedLessons.includes(activeLesson.id)
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-[#0284C7] text-white hover:bg-[#0369A1]'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {completedLessons.includes(activeLesson.id)
                        ? 'Completed ✓'
                        : 'Mark Lesson Complete'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Below Player: Notes, Resources, Quiz & Assignment Tabs */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-4">
                <button
                  onClick={() => setPlayerWorkspaceTab('notes')}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    playerWorkspaceTab === 'notes'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Timestamped Notes (
                  {notes.filter((n) => n.courseId === activeCourse.id).length})
                </button>
                <button
                  onClick={() => setPlayerWorkspaceTab('resources')}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    playerWorkspaceTab === 'resources'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Downloadable PDFs ({activeLesson.resources.length})
                </button>
                <button
                  onClick={() => setPlayerWorkspaceTab('quiz')}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    playerWorkspaceTab === 'quiz'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Certification Quiz ({activeCourse.quiz.length} Qs)
                </button>
                <button
                  onClick={() => setPlayerWorkspaceTab('assignment')}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                    playerWorkspaceTab === 'assignment'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Practical Assignment
                </button>
              </div>

              {playerWorkspaceTab === 'notes' && (
                <div className="mt-5 space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder={`Add note at ${formatTimestampFromPct(
                        progressPct,
                        activeLesson.durationMinutes
                      )}...`}
                      className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (!noteInput.trim()) return;
                        onAddNote({
                          courseId: activeCourse.id,
                          lessonId: activeLesson.id,
                          lessonTitle: activeLesson.title,
                          timestamp: formatTimestampFromPct(
                            progressPct,
                            activeLesson.durationMinutes
                          ),
                          content: noteInput.trim(),
                        });
                        setNoteInput('');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                      <span>Save Note</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {notes
                      .filter((n) => n.courseId === activeCourse.id)
                      .map((note) => (
                        <div
                          key={note.id}
                          className="flex items-start justify-between gap-4 py-3 text-xs"
                        >
                          <div>
                            <p className="font-mono text-[11px] font-semibold text-sky-700 tabular-nums">
                              [{note.timestamp}] · {note.lessonTitle}
                            </p>
                            <p className="mt-1 text-slate-700">{note.content}</p>
                          </div>
                          <button
                            onClick={() => onDeleteNote(note.id)}
                            className="text-slate-400 hover:text-rose-600"
                            aria-label="Delete note"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {playerWorkspaceTab === 'resources' && (
                <div className="mt-5 space-y-3">
                  {resourceToast && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                      ✓ {resourceToast}
                    </div>
                  )}
                  {activeLesson.resources.map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{res.title}</p>
                        <p className="font-mono text-[11px] text-slate-500">
                          {res.type} · {res.size} · Verified Student Access
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setResourceToast(
                            `Downloaded "${res.title}" (${res.size}) with student watermark ${currentUser.id}.`
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {playerWorkspaceTab === 'quiz' && (
                <div className="mt-5 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Final Certification Assessment — {activeCourse.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Score 60% or above to automatically generate your QR-verified Certificate.
                      </p>
                    </div>
                    {quizScores[activeCourse.id] !== undefined && (
                      <span className="font-mono text-xs font-semibold text-emerald-700 tabular-nums">
                        Best Score: {quizScores[activeCourse.id]}%
                      </span>
                    )}
                  </div>

                  {quizResultMessage && (
                    <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-xs font-medium text-sky-900">
                      {quizResultMessage}
                    </div>
                  )}

                  <div className="space-y-5">
                    {activeCourse.quiz.map((q, qIdx) => (
                      <div key={q.id} className="rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-semibold text-slate-900">
                          Q{qIdx + 1}. {q.question}
                        </p>
                        <div className="mt-3 space-y-2">
                          {q.options.map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-xs transition-colors ${
                                selectedAnswers[q.id] === oIdx
                                  ? 'border-sky-600 bg-sky-50/60 font-medium text-slate-900'
                                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                checked={selectedAnswers[q.id] === oIdx}
                                onChange={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                                }
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleGradeQuiz}
                    className="rounded-lg bg-[#0284C7] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0369A1]"
                  >
                    Submit Assessment & Generate Certificate
                  </button>
                </div>
              )}

              {playerWorkspaceTab === 'assignment' && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-900">
                      Instructor Assignment Brief:
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700">
                      {activeCourse.assignmentPrompt}
                    </p>
                  </div>

                  {assignmentsSubmitted[activeCourse.id] ? (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-xs">
                      <p className="font-semibold text-emerald-900">
                        ✓ Assignment Submitted on {assignmentsSubmitted[activeCourse.id].submittedAt}
                      </p>
                      <p className="mt-1 text-emerald-800">
                        Status: {assignmentsSubmitted[activeCourse.id].status}
                      </p>
                      <p className="mt-2 text-slate-700">
                        {assignmentsSubmitted[activeCourse.id].content}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={4}
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                        placeholder="Paste your campaign structure, worksheet link, or solution summary..."
                        className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (!assignmentText.trim()) return;
                          onSubmitAssignment(activeCourse.id, assignmentText.trim());
                          setAssignmentText('');
                        }}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        Submit Assignment for Review
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    Course Curriculum
                  </h3>
                  <p className="font-mono text-xs text-slate-500 tabular-nums">
                    {getCourseCompletionPct(activeCourse)}% Complete ·{' '}
                    {allCourseLessons.length} Lessons
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {activeCourse.chapters.map((ch) => (
                  <div key={ch.id} className="space-y-2">
                    <p className="text-xs font-semibold text-slate-800">{ch.title}</p>
                    <div className="space-y-1.5">
                      {ch.lessons.map((les) => {
                        const isDone = completedLessons.includes(les.id);
                        const isCurrent = activeLesson.id === les.id;
                        const isEnrolled = currentUser.enrolledCourseIds.includes(
                          activeCourse.id
                        );
                        const isLocked = !isEnrolled && !les.isFreePreview;

                        return (
                          <button
                            key={les.id}
                            disabled={isLocked}
                            onClick={() => {
                              setActiveLessonId(les.id);
                              setProgressPct(20);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-xs transition-colors ${
                              isCurrent
                                ? 'border-sky-600 bg-sky-50/70 font-semibold text-slate-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center gap-2.5 pr-2">
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                              ) : isLocked ? (
                                <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                              ) : (
                                <Play className="h-4 w-4 shrink-0 text-sky-600" />
                              )}
                              <span className="line-clamp-1">{les.title}</span>
                            </div>
                            <span className="font-mono text-[11px] text-slate-500 tabular-nums shrink-0">
                              {les.duration}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-sky-700" />
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Certificate Eligibility
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Complete the course lessons or pass the Certification Quiz with 60%+ to unlock your
                QR-verifiable credential.
              </p>

              {(() => {
                const existingCert = certificates.find(
                  (c) => c.courseId === activeCourse.id && c.userId === currentUser.id
                );
                if (existingCert) {
                  return (
                    <button
                      onClick={() => onOpenCertificateModal(existingCert)}
                      className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      View & Download Certificate ({existingCert.id})
                    </button>
                  );
                }
                return (
                  <button
                    onClick={() => setPlayerWorkspaceTab('quiz')}
                    className="mt-4 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    Take Certification Quiz Now
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACCOUNT, KYC & DEVICE SESSIONS */}
      {subTab === 'profile' && (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Client & Partner Profile Details
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Careermize User ID, Referral Code, and KYC bank details for instant commission
                payouts.
              </p>

              {profileSavedMsg && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
                  ✓ {profileSavedMsg}
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Careermize User ID (Immutable)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.id}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-xs text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Official Referral Code
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.referralCode}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 font-mono text-xs font-semibold text-sky-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Referred By Sponsor
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${currentUser.referredByName} (${currentUser.referredByCode})`}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Verification Status
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Email Verified ✓ · Mobile OTP Verified ✓"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Mobile Number (WhatsApp Enabled)
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">State</label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Verified PAN Number (For 5% TDS Compliance)
                  </label>
                  <input
                    type="text"
                    value={editPan}
                    onChange={(e) => setEditPan(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Primary UPI ID for Affiliate Payouts
                  </label>
                  <input
                    type="text"
                    value={editUpi}
                    onChange={(e) => setEditUpi(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  onUpdateProfile({
                    name: editName,
                    phone: editPhone,
                    state: editState,
                    city: editCity,
                    panNumber: editPan,
                    upiId: editUpi,
                  });
                  setProfileSavedMsg('Profile & KYC payout parameters updated.');
                }}
                className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Save Profile & KYC Details
              </button>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-display text-base font-semibold text-slate-900">
                Active Device & Session Management
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Concurrent streaming is restricted to 2 authorized devices per account.
              </p>

              <div className="mt-4 divide-y divide-slate-100 text-xs">
                {currentUser.sessions.map((ses) => (
                  <div
                    key={ses.id}
                    className="flex items-start justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{ses.device}</p>
                      <p className="text-slate-500">
                        {ses.browser} · {ses.location}
                      </p>
                      <p className="font-mono text-[11px] text-slate-400">
                        IP: {ses.ip} · {ses.timestamp}
                      </p>
                    </div>
                    {ses.current ? (
                      <span className="font-mono text-[11px] font-semibold text-emerald-700">
                        ● Current
                      </span>
                    ) : (
                      <button
                        onClick={() => onRevokeSession(ses.id)}
                        className="rounded border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WHATSAPP & CALL LIVE SUPPORT + TICKETS */}
      {subTab === 'support' && (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-medium text-emerald-700">
                Direct Careermize Concierge
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-slate-900">
                WhatsApp Live Support & Call Desk
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Available 10:00 AM to 08:00 PM IST (Mon–Sat) for instant help with service order
                briefs, package upgrades, referral attribution, or KYC verification.
              </p>

              {whatsappBanner && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                  {whatsappBanner}
                </div>
              )}

              <div className="mt-5 space-y-3">
                <button
                  onClick={() =>
                    setWhatsappBanner(
                      `Connected to WhatsApp Live Desk (+91 98290-CAREER) for User ID ${currentUser.id}. Average response time: 4 mins.`
                    )
                  }
                  className="flex w-full items-center justify-between rounded-lg bg-emerald-600 px-4 py-3 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Launch WhatsApp Live Support Desk</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() =>
                    setWhatsappBanner(
                      `Callback scheduled with Relationship Manager (+91-80-4719-2200) for ${currentUser.phone}.`
                    )
                  }
                  className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-sky-700" />
                    <span>Request Live Support Call (+91-80-4719-2200)</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">10 AM – 8 PM</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-display text-base font-semibold text-slate-900">
                Raise a Priority Support Ticket
              </h3>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as any)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                    >
                      <option value="Service Order Delivery">Service Order Delivery</option>
                      <option value="Package Upgrade">Package Upgrade</option>
                      <option value="Referral Payout">Referral Payout</option>
                      <option value="Video Playback">Video Playback</option>
                      <option value="Certificate Issue">Certificate Issue</option>
                      <option value="GST Invoice">GST Invoice</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Subject</label>
                    <input
                      type="text"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Brief summary of your request"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Message</label>
                  <textarea
                    rows={3}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide Service Order ID, Package Order ID, or details..."
                    className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
                    onCreateTicket(ticketCategory, ticketSubject.trim(), ticketMessage.trim());
                    setTicketSubject('');
                    setTicketMessage('');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Support Ticket</span>
                </button>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <h4 className="text-xs font-semibold text-slate-800">My Support Tickets</h4>
                <div className="mt-3 divide-y divide-slate-100 text-xs">
                  {supportTickets.map((t) => (
                    <div key={t.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-slate-900">
                          {t.id} · {t.subject}
                        </span>
                        <span className="font-mono text-[11px] text-emerald-700">
                          {t.status}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-600">{t.message}</p>
                      {t.adminReply && (
                        <p className="mt-2 rounded bg-slate-50 p-2.5 text-slate-800 border border-slate-200">
                          <strong>Support Desk Reply:</strong> {t.adminReply}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
