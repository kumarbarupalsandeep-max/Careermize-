import React, { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_ALL_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CERTIFICATES,
  INITIAL_CLICK_LOGS,
  INITIAL_COUPONS,
  INITIAL_COURSES,
  INITIAL_DROPSERVICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_PACKAGES,
  INITIAL_REFERRAL_TREE,
  INITIAL_SERVICE_ORDERS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_USER,
  INITIAL_WITHDRAWALS,
  AuditLogEntry,
  CareermizePackage,
  CertificateRecord,
  CouponCode,
  Course,
  DropServiceItem,
  Lesson,
  NotificationItem,
  OrderRecord,
  ReferralClickLog,
  ReferralNode,
  ServiceOrderRecord,
  StudentNote,
  SupportTicket,
  UserProfile,
  UserRole,
  WithdrawalRequest,
} from './data/careermizeData';
import { PublicExploreView } from './components/PublicExploreView';
import { StudentLmsView } from './components/StudentLmsView';
import { AffiliateReferralView } from './components/AffiliateReferralView';
import { InstructorStudioView } from './components/InstructorStudioView';
import { AdminConsoleView } from './components/AdminConsoleView';
import { PublicPagesView, PublicPageType } from './components/PublicPagesView';
import './lib/firebase';
import {
  CertificateVerifyModal,
  CheckoutModal,
  InvoiceModal,
  LoginModal,
  RegisterModal,
  ServiceOrderModal,
} from './components/CheckoutAndVerifyModals';

type MainWorkspace = 'explore' | 'student' | 'affiliate' | 'instructor' | 'manager' | 'pages';

export default function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<MainWorkspace>('explore');
  const [activePublicPage, setActivePublicPage] = useState<PublicPageType>('about');

  // Authentication & Strict Private Manager State
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem('cm_session_token')
  );
  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [unauthorizedRouteAttempt, setUnauthorizedRouteAttempt] = useState<string | null>(
    null
  );

  // Core Platform State
  const [dropServices, setDropServices] =
    useState<DropServiceItem[]>(INITIAL_DROPSERVICES);
  const [serviceOrders, setServiceOrders] =
    useState<ServiceOrderRecord[]>(INITIAL_SERVICE_ORDERS);
  const [packages, setPackages] = useState<CareermizePackage[]>(INITIAL_PACKAGES);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(INITIAL_ALL_USERS);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('crs-meta-ads');

  // Persisted Learning State
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    'les-1001',
    'les-4001',
    'les-6001',
  ]);
  const [notes, setNotes] = useState<StudentNote[]>([
    {
      id: 'note-1',
      courseId: 'crs-meta-ads',
      lessonId: 'les-1001',
      lessonTitle: '01. Break-Even ROAS & Unit Economics Calculator',
      timestamp: '08:14',
      content: 'Break-Even ROAS = 1 / Gross Margin. For 60% margin, 1.67x is our break-even floor.',
      createdAt: '04 Oct 2026',
    },
  ]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({
    'crs-comm-sales': 100,
  });
  const [assignmentsSubmitted, setAssignmentsSubmitted] = useState<
    Record<string, { content: string; submittedAt: string; status: string }>
  >({
    'crs-comm-sales': {
      content:
        'Submitted 90-second discovery call script addressing price objection with ROI calculation.',
      submittedAt: '27 Aug 2026',
      status: 'Approved (96/100)',
    },
  });

  // Referral, Payment, Certificate & Admin State
  const [referralTree, setReferralTree] = useState<ReferralNode[]>(INITIAL_REFERRAL_TREE);
  const [clickLogs, setClickLogs] = useState<ReferralClickLog[]>(INITIAL_CLICK_LOGS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [certificates, setCertificates] = useState<CertificateRecord[]>(INITIAL_CERTIFICATES);
  const [coupons, setCoupons] = useState<CouponCode[]>(INITIAL_COUPONS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Active Modals State
  const [serviceOrderTarget, setServiceOrderTarget] = useState<DropServiceItem | null>(null);
  const [checkoutTarget, setCheckoutTarget] = useState<{
    pkg: CareermizePackage;
    isUpgrade: boolean;
  } | null>(null);
  const [registerModalRefCode, setRegisterModalRefCode] = useState<string | null>(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<OrderRecord | null>(null);
  const [verifyModalCertId, setVerifyModalCertId] = useState<string | null>(null);

  const syncBackendStore = useCallback(
    (patch: Record<string, unknown>) => {
      fetch('/api/store/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(patch),
      }).catch(() => {});
    },
    [authToken]
  );

  // Load persisted store & verify session on mount
  useEffect(() => {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    fetch('/api/store', { headers })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (Array.isArray(data.dropServices)) setDropServices(data.dropServices);
        if (Array.isArray(data.serviceOrders)) setServiceOrders(data.serviceOrders);
        if (Array.isArray(data.packages)) setPackages(data.packages);
        if (Array.isArray(data.courses)) setCourses(data.courses);
        if (Array.isArray(data.users) && data.users.length > 0) setAllUsers(data.users);
        if (Array.isArray(data.orders)) setOrders(data.orders);
        if (Array.isArray(data.referralTree)) setReferralTree(data.referralTree);
        if (Array.isArray(data.clickLogs)) setClickLogs(data.clickLogs);
        if (Array.isArray(data.withdrawals)) setWithdrawals(data.withdrawals);
        if (Array.isArray(data.certificates)) setCertificates(data.certificates);
        if (Array.isArray(data.coupons)) setCoupons(data.coupons);
        if (Array.isArray(data.supportTickets)) setSupportTickets(data.supportTickets);
        if (Array.isArray(data.notifications)) setNotifications(data.notifications);
        if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
        if (Array.isArray(data.completedLessons)) setCompletedLessons(data.completedLessons);
        if (Array.isArray(data.notes)) setNotes(data.notes);
        if (data.quizScores) setQuizScores(data.quizScores);
        if (data.assignmentsSubmitted) setAssignmentsSubmitted(data.assignmentsSubmitted);
      })
      .catch(() => {});

    if (authToken) {
      fetch('/api/auth/session', { headers })
        .then((res) => (res.ok ? res.json() : null))
        .then((sessionData) => {
          if (sessionData && sessionData.user) {
            setCurrentUser(sessionData.user);
            setIsManagerAuthenticated(Boolean(sessionData.isManager));
          } else {
            localStorage.removeItem('cm_session_token');
            setAuthToken(null);
            setIsManagerAuthenticated(false);
          }
        })
        .catch(() => {});
    }
  }, [authToken]);

  // Direct URL / Hash Route Guard for Private Manager Panel
  useEffect(() => {
    const enforcePrivateManagerGuard = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      const isAttemptingPrivateRoute =
        path.includes('/manager') ||
        path.includes('/admin') ||
        hash.includes('manager') ||
        hash.includes('admin') ||
        search.includes('manager') ||
        search.includes('admin');

      if (isAttemptingPrivateRoute && !isManagerAuthenticated) {
        const attemptedUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.history.replaceState({}, '', '/');
        setActiveWorkspace('explore');
        setUnauthorizedRouteAttempt(attemptedUrl);
        setShowLoginModal(true);
      }
    };

    enforcePrivateManagerGuard();
    window.addEventListener('hashchange', enforcePrivateManagerGuard);
    window.addEventListener('popstate', enforcePrivateManagerGuard);
    return () => {
      window.removeEventListener('hashchange', enforcePrivateManagerGuard);
      window.removeEventListener('popstate', enforcePrivateManagerGuard);
    };
  }, [isManagerAuthenticated]);

  // Ensure activeWorkspace can never be 'manager' or 'instructor' if !isManagerAuthenticated
  const safeWorkspace: MainWorkspace =
    (activeWorkspace === 'manager' || activeWorkspace === 'instructor') && !isManagerAuthenticated
      ? 'explore'
      : activeWorkspace;

  const handleLogout = () => {
    if (authToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }
    localStorage.removeItem('cm_session_token');
    setAuthToken(null);
    setIsManagerAuthenticated(false);
    setCurrentUser(INITIAL_USER);
    setActiveWorkspace('explore');
  };

  // Handlers
  const handleToggleWishlist = (courseId: string) => {
    setCurrentUser((prev) => {
      const exists = prev.wishlistCourseIds.includes(courseId);
      const updated = {
        ...prev,
        wishlistCourseIds: exists
          ? prev.wishlistCourseIds.filter((id) => id !== courseId)
          : [...prev.wishlistCourseIds, courseId],
      };
      return updated;
    });
  };

  const handleToggleLessonComplete = (lessonId: string, courseId: string) => {
    const next = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];
    setCompletedLessons(next);
    syncBackendStore({ completedLessons: next });

    const targetCourse = courses.find((c) => c.id === courseId);
    if (targetCourse) {
      const allIds = targetCourse.chapters.flatMap((ch) => ch.lessons.map((l) => l.id));
      const allCompleted = allIds.every((id) => next.includes(id));
      if (allCompleted) {
        issueCertificateForCourse(courseId, 100);
      }
    }
  };

  const issueCertificateForCourse = (courseId: string, scorePct: number) => {
    const targetCourse = courses.find((c) => c.id === courseId);
    if (!targetCourse) return;
    const alreadyExists = certificates.find(
      (c) => c.courseId === courseId && c.userId === currentUser.id
    );
    if (alreadyExists) return;

    const newCert: CertificateRecord = {
      id: `CERT-2026-${Math.floor(100000 + Math.random() * 899999)}`,
      userId: currentUser.id,
      studentName: currentUser.name,
      courseId: targetCourse.id,
      courseTitle: targetCourse.title,
      packageName:
        packages.find((p) => p.id === currentUser.activePackageId)?.name || 'Pro Package',
      instructorName: targetCourse.instructorName,
      issueDate: '05 Oct 2026',
      quizScorePct: scorePct,
      status: 'Valid',
      verificationUrl: `https://careermize.in/certificate/CERT-2026`,
    };
    const nextCerts = [newCert, ...certificates];
    const nextNotifs: NotificationItem[] = [
      {
        id: `notif-${Date.now()}`,
        channel: 'In-App',
        title: `Certificate Generated: ${newCert.id}`,
        body: `Congratulations! Your QR-verified certificate for ${targetCourse.title} is ready.`,
        timestamp: 'Just now',
        read: false,
      },
      ...notifications,
    ];
    setCertificates(nextCerts);
    setNotifications(nextNotifs);
    syncBackendStore({ certificates: nextCerts, notifications: nextNotifs });
  };

  const handleAddNote = (noteData: Omit<StudentNote, 'id' | 'createdAt'>) => {
    const newNote: StudentNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: '05 Oct 2026',
    };
    const next = [newNote, ...notes];
    setNotes(next);
    syncBackendStore({ notes: next });
  };

  const handleDeleteNote = (noteId: string) => {
    const next = notes.filter((n) => n.id !== noteId);
    setNotes(next);
    syncBackendStore({ notes: next });
  };

  const handleSubmitQuizScore = (courseId: string, scorePct: number) => {
    const next = { ...quizScores, [courseId]: scorePct };
    setQuizScores(next);
    syncBackendStore({ quizScores: next });
    if (scorePct >= 60) {
      issueCertificateForCourse(courseId, scorePct);
    }
  };

  const handleSubmitAssignment = (courseId: string, content: string) => {
    const next = {
      ...assignmentsSubmitted,
      [courseId]: {
        content,
        submittedAt: '05 Oct 2026',
        status: 'Submitted · Under Review',
      },
    };
    setAssignmentsSubmitted(next);
    syncBackendStore({ assignmentsSubmitted: next });
  };

  const handleCompleteServiceOrder = (payload: {
    service: DropServiceItem;
    targetUrlOrBrand: string;
    projectBrief: string;
    gateway: OrderRecord['gateway'];
    transactionId?: string;
  }) => {
    const gst = payload.service.clientPrice - Math.round(payload.service.clientPrice / 1.18);
    const newSrvOrder: ServiceOrderRecord = {
      id: `SRV-ORD-2026-${Math.floor(500 + Math.random() * 499)}`,
      invoiceNumber: `INV-SRV-26-${Math.floor(1000 + Math.random() * 8999)}`,
      serviceId: payload.service.id,
      serviceTitle: payload.service.title,
      category: payload.service.category,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientPhone: currentUser.phone,
      projectBrief: payload.projectBrief,
      targetUrlOrBrand: payload.targetUrlOrBrand,
      clientPrice: payload.service.clientPrice,
      gstAmount: gst,
      finalAmount: payload.service.clientPrice,
      vendorCost: payload.service.vendorCost,
      netProfit: payload.service.clientPrice - payload.service.vendorCost,
      assignedSpecialist: 'Rohan Kulkarni (Senior Fulfillment Specialist)',
      specialistStatus: 'Assigned',
      orderStatus: 'Brief Verified',
      deliverableNotes: 'Project brief verified; specialist execution underway.',
      gateway: payload.gateway,
      transactionId:
        payload.transactionId ||
        `pay_${payload.gateway.slice(0, 3)}_${Date.now().toString().slice(-8)}`,
      createdAt: '06 Oct 2026, Just now',
      updatedAt: '06 Oct 2026, Just now',
    };

    const nextServiceOrders = [newSrvOrder, ...serviceOrders];
    const nextNotifs: NotificationItem[] = [
      {
        id: `notif-${Date.now()}`,
        channel: 'WhatsApp',
        title: `Service Order Confirmed (${newSrvOrder.id})`,
        body: `Your project brief for "${payload.service.title}" is now assigned to ${newSrvOrder.assignedSpecialist}.`,
        timestamp: 'Just now',
        read: false,
      },
      ...notifications,
    ];

    setServiceOrders(nextServiceOrders);
    setNotifications(nextNotifs);
    syncBackendStore({ serviceOrders: nextServiceOrders, notifications: nextNotifs });
    setServiceOrderTarget(null);
    setActiveWorkspace('student');
  };

  const handleCompleteOrder = (orderData: {
    pkg: CareermizePackage;
    baseAmount: number;
    discountAmount: number;
    taxableAmount: number;
    gstAmount: number;
    finalAmount: number;
    couponCode?: string;
    gateway: OrderRecord['gateway'];
    paymentMethod: OrderRecord['paymentMethod'];
    referralCodeUsed: string;
    transactionId?: string;
  }) => {
    const commissionEarned = Math.round(
      (orderData.finalAmount * orderData.pkg.directCommissionPct) / 100
    );
    const newOrder: OrderRecord = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      invoiceNumber: `INV-CM-26-${Math.floor(1000 + Math.random() * 8999)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userState: `${currentUser.state} (08)`,
      packageId: orderData.pkg.id,
      packageName: `${orderData.pkg.name} (${orderData.pkg.courseCount} Courses)`,
      baseAmount: orderData.baseAmount,
      couponCode: orderData.couponCode,
      discountAmount: orderData.discountAmount,
      taxableAmount: orderData.taxableAmount,
      gstAmount: orderData.gstAmount,
      finalAmount: orderData.finalAmount,
      gateway: orderData.gateway,
      paymentMethod: orderData.paymentMethod,
      transactionId:
        orderData.transactionId ||
        `pay_${orderData.gateway.slice(0, 3)}_${Date.now().toString().slice(-8)}`,
      status: 'Success',
      referralCodeUsed: orderData.referralCodeUsed,
      commissionGenerated: commissionEarned,
      createdAt: '06 Oct 2026, Just now',
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);

    const updatedUser: UserProfile = {
      ...currentUser,
      activePackageId: orderData.pkg.id,
      enrolledCourseIds: Array.from(
        new Set([...currentUser.enrolledCourseIds, ...orderData.pkg.includedCourseIds])
      ),
    };
    setCurrentUser(updatedUser);

    const nextAudit: AuditLogEntry[] = [
      {
        id: `aud-${Date.now()}`,
        actor: `${orderData.gateway} Webhook Engine`,
        role: 'System',
        action: `Verified signature for ${newOrder.transactionId} & unlocked ${orderData.pkg.name}`,
        module: 'Payment Webhook',
        ipAddress: '52.66.141.10',
        timestamp: '05 Oct 2026, Just now',
      },
      ...auditLogs,
    ];
    setAuditLogs(nextAudit);
    syncBackendStore({ orders: nextOrders, auditLogs: nextAudit });

    setCheckoutTarget(null);
    setActiveInvoiceOrder(newOrder);
    setActiveWorkspace('student');
  };

  const handleSimulateReferralConversion = (
    pkgId: string,
    tier: 1 | 2,
    buyerName: string,
    buyerCity: string
  ) => {
    const pkg = packages.find((p) => p.id === pkgId) || packages[0];
    const pct = tier === 1 ? pkg.directCommissionPct : pkg.passiveCommissionPct;
    const earned = Math.round((pkg.price * pct) / 100);
    const newUserId = `CM${Math.floor(950000 + Math.random() * 49999)}`;

    const newNode: ReferralNode = {
      id: `ref-${Date.now()}`,
      userId: newUserId,
      name: tier === 2 ? `${buyerName} (Sub-Affiliate Sale)` : buyerName,
      city: buyerCity,
      phone: '+91 98280 •••41',
      packagePurchased: pkg.name,
      packageId: pkg.id,
      tier,
      joinedDate: '05 Oct 2026',
      purchaseAmount: pkg.price,
      commissionEarned: earned,
      commissionStatus: 'Approved',
    };

    const nextTree = [newNode, ...referralTree];
    const nextClicks: ReferralClickLog[] = [
      {
        id: `clk-${Date.now()}`,
        timestamp: '05 Oct 2026, Just now',
        source: 'WhatsApp Share',
        visitorIp: '49.36.192.84',
        device: 'Android 15 • Chrome Mobile',
        city: buyerCity,
        convertedToRegistration: true,
        convertedToPurchase: true,
        attributedUserId: newUserId,
      },
      ...clickLogs,
    ];
    setReferralTree(nextTree);
    setClickLogs(nextClicks);
    syncBackendStore({ referralTree: nextTree, clickLogs: nextClicks });
  };

  const handleAdvanceCommissionStatus = (refId: string) => {
    const order: ReferralNode['commissionStatus'][] = [
      'Pending',
      'Eligible',
      'Approved',
      'Payable',
      'Paid',
    ];
    const nextTree = referralTree.map((node) => {
      if (node.id !== refId) return node;
      const idx = order.indexOf(node.commissionStatus);
      const nextStatus = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : 'Paid';
      return { ...node, commissionStatus: nextStatus };
    });
    setReferralTree(nextTree);
    syncBackendStore({ referralTree: nextTree });
  };

  const handleRequestWithdrawal = (
    amount: number,
    method: 'UPI Instant' | 'NEFT / IMPS Bank'
  ) => {
    const tds = Math.round(amount * 0.05);
    const net = amount - tds;
    const newReq: WithdrawalRequest = {
      id: `WD-2026-${Math.floor(600 + Math.random() * 399)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      tdsDeducted: tds,
      netPayable: net,
      method,
      accountDetails:
        method === 'UPI Instant' ? currentUser.upiId : currentUser.bankAccount,
      status: 'Pending',
      requestedAt: '05 Oct 2026, Just now',
    };
    const nextW = [newReq, ...withdrawals];
    setWithdrawals(nextW);
    syncBackendStore({ withdrawals: nextW });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* =====================================================================
          STRICT 3-ZONE TOP BAR CONTRACT
          - Normal Clients/Guests NEVER see any Manager/Admin link here!
          - Only after authorized Manager login does "Manager Console" appear.
         ===================================================================== */}
      <header className="no-print sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-3.5 backdrop-blur-xs">
        {/* Zone 1: Single text element Brand wordmark */}
        <a
          href="#explore"
          onClick={(e) => {
            e.preventDefault();
            setActiveWorkspace('explore');
          }}
          className="font-display text-xl font-bold tracking-tight text-slate-900"
        >
          Careermize
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links (Manager Console hidden unless authenticated as Manager) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveWorkspace('explore')}
            className={`transition-colors hover:text-slate-900 hover:underline underline-offset-8 whitespace-nowrap ${
              safeWorkspace === 'explore' ? 'text-slate-900 font-semibold underline' : ''
            }`}
          >
            Services & Bundles
          </button>
          <button
            onClick={() => setActiveWorkspace('student')}
            className={`transition-colors hover:text-slate-900 hover:underline underline-offset-8 whitespace-nowrap ${
              safeWorkspace === 'student' ? 'text-slate-900 font-semibold underline' : ''
            }`}
          >
            Client & LMS Hub
          </button>
          <button
            onClick={() => setActiveWorkspace('affiliate')}
            className={`transition-colors hover:text-slate-900 hover:underline underline-offset-8 whitespace-nowrap ${
              safeWorkspace === 'affiliate' ? 'text-slate-900 font-semibold underline' : ''
            }`}
          >
            Partner Program
          </button>

          {isManagerAuthenticated && (
            <>
              <button
                onClick={() => setActiveWorkspace('instructor')}
                className={`transition-colors hover:text-slate-900 hover:underline underline-offset-8 whitespace-nowrap ${
                  safeWorkspace === 'instructor'
                    ? 'text-emerald-700 font-semibold underline'
                    : 'text-emerald-700'
                }`}
              >
                Instructor Studio
              </button>
              <button
                onClick={() => setActiveWorkspace('manager')}
                className={`transition-colors hover:text-slate-900 hover:underline underline-offset-8 whitespace-nowrap ${
                  safeWorkspace === 'manager'
                    ? 'text-sky-700 font-semibold underline'
                    : 'text-sky-700'
                }`}
              >
                Manager Console
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 2 Primary Actions */}
        <div className="flex items-center gap-3">
          {authToken ? (
            <>
              <button
                onClick={() => {
                  setUnauthorizedRouteAttempt(null);
                  setShowLoginModal(true);
                }}
                className="hidden sm:inline-flex rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
              >
                {currentUser.name.split(' ')[0]} · Switch Account
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setUnauthorizedRouteAttempt(null);
                  setShowLoginModal(true);
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => setRegisterModalRefCode(currentUser.referralCode)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </header>

      {/* Mobile Navigation Bar (Zero Manager visibility unless authenticated as Manager) */}
      <div className="no-print flex md:hidden items-center justify-between gap-1 overflow-x-auto border-b border-slate-200 bg-slate-100 px-4 py-2 text-xs">
        <button
          onClick={() => setActiveWorkspace('explore')}
          className={`rounded-md px-3 py-1.5 font-medium whitespace-nowrap ${
            safeWorkspace === 'explore' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Services & Bundles
        </button>
        <button
          onClick={() => setActiveWorkspace('student')}
          className={`rounded-md px-3 py-1.5 font-medium whitespace-nowrap ${
            safeWorkspace === 'student' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Client & LMS Hub
        </button>
        <button
          onClick={() => setActiveWorkspace('affiliate')}
          className={`rounded-md px-3 py-1.5 font-medium whitespace-nowrap ${
            safeWorkspace === 'affiliate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Partner Hub
        </button>
        {isManagerAuthenticated && (
          <button
            onClick={() => setActiveWorkspace('manager')}
            className={`rounded-md px-3 py-1.5 font-semibold whitespace-nowrap ${
              safeWorkspace === 'manager'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-sky-800'
            }`}
          >
            Manager Console
          </button>
        )}
      </div>

      {/* =====================================================================
          MAIN WORKSPACE CANVAS
         ===================================================================== */}
      <main className="flex-1">
        {safeWorkspace === 'explore' && (
          <PublicExploreView
            dropServices={dropServices}
            packages={packages}
            courses={courses}
            currentUser={currentUser}
            onSelectServiceForOrder={(srv) => setServiceOrderTarget(srv)}
            onSelectPackageForCheckout={(pkg, isUpgrade = false) =>
              setCheckoutTarget({ pkg, isUpgrade })
            }
            onOpenCourseInLms={(courseId) => {
              setSelectedCourseId(courseId);
              setActiveWorkspace('student');
            }}
            onToggleWishlist={handleToggleWishlist}
            onOpenRegisterModal={(refCode) =>
              setRegisterModalRefCode(refCode || currentUser.referralCode)
            }
            onOpenCertificateVerify={(certId) =>
              setVerifyModalCertId(certId || 'CERT-2026-884920')
            }
          />
        )}

        {safeWorkspace === 'student' && (
          <StudentLmsView
            currentUser={currentUser}
            dropServices={dropServices}
            serviceOrders={serviceOrders}
            onSelectServiceForOrder={(srv) => setServiceOrderTarget(srv)}
            onClientApproveServiceOrder={(orderId, feedback) => {
              const next = serviceOrders.map((so) =>
                so.id === orderId
                  ? {
                      ...so,
                      orderStatus: 'Completed' as const,
                      specialistStatus: 'Completed' as const,
                      clientFeedback: feedback,
                      updatedAt: '05 Oct 2026, Just now',
                    }
                  : so
              );
              setServiceOrders(next);
              syncBackendStore({ serviceOrders: next });
            }}
            packages={packages}
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourseId={setSelectedCourseId}
            completedLessons={completedLessons}
            onToggleLessonComplete={handleToggleLessonComplete}
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            quizScores={quizScores}
            onSubmitQuizScore={handleSubmitQuizScore}
            assignmentsSubmitted={assignmentsSubmitted}
            onSubmitAssignment={handleSubmitAssignment}
            certificates={certificates}
            orders={orders}
            notifications={notifications}
            supportTickets={supportTickets}
            onCreateTicket={(category, subject, message) => {
              const newTkt: SupportTicket = {
                id: `TKT-${Math.floor(1000 + Math.random() * 8999)}`,
                userId: currentUser.id,
                userName: currentUser.name,
                category,
                subject,
                message,
                priority: 'High',
                status: 'Open',
                createdAt: '05 Oct 2026, Just now',
              };
              const nextTkts = [newTkt, ...supportTickets];
              setSupportTickets(nextTkts);
              syncBackendStore({ supportTickets: nextTkts });
            }}
            onUpdateProfile={(updated) => {
              const nextUser = { ...currentUser, ...updated };
              setCurrentUser(nextUser);
              const nextUsers = allUsers.map((u) => (u.id === nextUser.id ? nextUser : u));
              setAllUsers(nextUsers);
              syncBackendStore({ users: nextUsers });
            }}
            onRevokeSession={(sessionId) =>
              setCurrentUser((prev) => ({
                ...prev,
                sessions: prev.sessions.filter((s) => s.id !== sessionId),
              }))
            }
            onOpenCertificateModal={(cert) => setVerifyModalCertId(cert.id)}
            onOpenInvoiceModal={(ord) => setActiveInvoiceOrder(ord)}
            onSelectPackageForCheckout={(pkg, isUpgrade = false) =>
              setCheckoutTarget({ pkg, isUpgrade })
            }
          />
        )}

        {safeWorkspace === 'affiliate' && (
          <AffiliateReferralView
            currentUser={currentUser}
            packages={packages}
            referralTree={referralTree}
            clickLogs={clickLogs}
            withdrawals={withdrawals}
            onSimulateReferralConversion={handleSimulateReferralConversion}
            onAdvanceCommissionStatus={handleAdvanceCommissionStatus}
            onRequestWithdrawal={handleRequestWithdrawal}
          />
        )}

        {safeWorkspace === 'pages' && (
          <PublicPagesView
            initialPage={activePublicPage}
            courses={courses}
            packages={packages}
            onClose={() => setActiveWorkspace('explore')}
            onSubmitContactTicket={({ name, email, phone, subject, message }) => {
              const newTkt: SupportTicket = {
                id: `TKT-${Math.floor(1000 + Math.random() * 8999)}`,
                userId: currentUser.id,
                userName: `${name} (${email} · ${phone})`,
                category: 'Payment / GST Invoice',
                subject,
                message,
                priority: 'High',
                status: 'Open',
                createdAt: '06 Oct 2026, Just now',
              };
              const nextTkts = [newTkt, ...supportTickets];
              setSupportTickets(nextTkts);
              syncBackendStore({ supportTickets: nextTkts });
            }}
          />
        )}

        {/* INSTRUCTOR STUDIO — Rendered ONLY if authenticated as Instructor or Manager */}
        {safeWorkspace === 'instructor' && isManagerAuthenticated && (
          <InstructorStudioView
            courses={courses}
            packages={packages}
            assignmentsSubmitted={assignmentsSubmitted}
            onCreateCourse={(newCourse) => {
              const nextCourses = [newCourse, ...courses];
              const nextPkgs = packages.map((p) =>
                p.id === newCourse.packageTierId || p.id === 'pkg-elite'
                  ? {
                      ...p,
                      courseCount: p.courseCount + 1,
                      includedCourseIds: [...p.includedCourseIds, newCourse.id],
                    }
                  : p
              );
              setCourses(nextCourses);
              setPackages(nextPkgs);
              syncBackendStore({ courses: nextCourses, packages: nextPkgs });
            }}
            onAddLessonToCourse={(courseId, chapterId, lesson: Lesson) => {
              const nextCourses = courses.map((c) => {
                if (c.id !== courseId) return c;
                return {
                  ...c,
                  chapters: c.chapters.map((ch) =>
                    ch.id === chapterId
                      ? { ...ch, lessons: [...ch.lessons, lesson] }
                      : ch
                  ),
                };
              });
              setCourses(nextCourses);
              syncBackendStore({ courses: nextCourses });
            }}
            onToggleCourseStatus={(courseId) => {
              const nextCourses = courses.map((c) =>
                c.id === courseId
                  ? {
                      ...c,
                      status: (c.status === 'Published' ? 'Draft' : 'Published') as Course['status'],
                    }
                  : c
              );
              setCourses(nextCourses);
              syncBackendStore({ courses: nextCourses });
            }}
          />
        )}

        {/* STRICTLY PRIVATE MANAGER PANEL — Rendered ONLY if isManagerAuthenticated === true */}
        {safeWorkspace === 'manager' && isManagerAuthenticated && (
          <AdminConsoleView
            currentManager={currentUser}
            dropServices={dropServices}
            serviceOrders={serviceOrders}
            onCreateDropService={(newSrv) => {
              const next = [newSrv, ...dropServices];
              setDropServices(next);
              syncBackendStore({ dropServices: next });
            }}
            onUpdateServiceOrder={(orderId, patch) => {
              const next = serviceOrders.map((so) =>
                so.id === orderId ? { ...so, ...patch } : so
              );
              setServiceOrders(next);
              syncBackendStore({ serviceOrders: next });
            }}
            users={allUsers}
            packages={packages}
            courses={courses}
            onCreateCourse={(newCourse) => {
              const nextCourses = [newCourse, ...courses];
              const nextPkgs = packages.map((p) =>
                p.id === newCourse.packageTierId || p.id === 'pkg-elite'
                  ? {
                      ...p,
                      courseCount: p.courseCount + 1,
                      includedCourseIds: [...p.includedCourseIds, newCourse.id],
                    }
                  : p
              );
              setCourses(nextCourses);
              setPackages(nextPkgs);
              syncBackendStore({ courses: nextCourses, packages: nextPkgs });
            }}
            onAddLessonToCourse={(courseId, chapterId, lesson: Lesson) => {
              const nextCourses = courses.map((c) => {
                if (c.id !== courseId) return c;
                return {
                  ...c,
                  chapters: c.chapters.map((ch) =>
                    ch.id === chapterId
                      ? { ...ch, lessons: [...ch.lessons, lesson] }
                      : ch
                  ),
                };
              });
              setCourses(nextCourses);
              syncBackendStore({ courses: nextCourses });
            }}
            onToggleCourseStatus={(courseId) => {
              const nextCourses = courses.map((c) =>
                c.id === courseId
                  ? {
                      ...c,
                      status: (c.status === 'Published' ? 'Draft' : 'Published') as Course['status'],
                    }
                  : c
              );
              setCourses(nextCourses);
              syncBackendStore({ courses: nextCourses });
            }}
            orders={orders}
            withdrawals={withdrawals}
            coupons={coupons}
            certificates={certificates}
            supportTickets={supportTickets}
            onReplySupportTicket={(ticketId, reply) => {
              const nextTkts = supportTickets.map((t) =>
                t.id === ticketId
                  ? { ...t, status: 'Resolved' as const, adminReply: reply }
                  : t
              );
              setSupportTickets(nextTkts);
              syncBackendStore({ supportTickets: nextTkts });
            }}
            auditLogs={auditLogs}
            onToggleUserStatus={(userId) => {
              const nextUsers = allUsers.map((u) =>
                u.id === userId
                  ? {
                      ...u,
                      accountStatus: (u.accountStatus === 'Active'
                        ? 'Suspended'
                        : 'Active') as UserProfile['accountStatus'],
                    }
                  : u
              );
              setAllUsers(nextUsers);
              syncBackendStore({ users: nextUsers });
            }}
            onChangeUserRole={(userId, role: UserRole) => {
              const nextUsers = allUsers.map((u) =>
                u.id === userId ? { ...u, role } : u
              );
              setAllUsers(nextUsers);
              syncBackendStore({ users: nextUsers });
            }}
            onUpdatePackageConfig={(pkgId, price, directCommissionPct, passiveCommissionPct) => {
              const nextPkgs = packages.map((p) =>
                p.id === pkgId
                  ? { ...p, price, directCommissionPct, passiveCommissionPct }
                  : p
              );
              setPackages(nextPkgs);
              syncBackendStore({ packages: nextPkgs });
            }}
            onProcessWithdrawal={(withdrawalId, action) => {
              const nextW = withdrawals.map((w) =>
                w.id === withdrawalId
                  ? {
                      ...w,
                      status: action,
                      processedAt: '05 Oct 2026, Just now',
                      utrReference:
                        action === 'Paid'
                          ? `UTR${Math.floor(100000000 + Math.random() * 899999999)}`
                          : undefined,
                    }
                  : w
              );
              setWithdrawals(nextW);
              syncBackendStore({ withdrawals: nextW });
            }}
            onRefundOrder={(orderId) => {
              const nextOrders = orders.map((o) =>
                o.id === orderId
                  ? { ...o, status: 'Refunded' as const, commissionGenerated: 0 }
                  : o
              );
              setOrders(nextOrders);
              syncBackendStore({ orders: nextOrders });
            }}
            onCreateCoupon={(newCoupon) => {
              const nextCpns = [
                { ...newCoupon, id: `cpn-${Date.now()}`, usageCount: 0 },
                ...coupons,
              ];
              setCoupons(nextCpns);
              syncBackendStore({ coupons: nextCpns });
            }}
            onToggleCoupon={(couponId) => {
              const nextCpns = coupons.map((c) =>
                c.id === couponId ? { ...c, isActive: !c.isActive } : c
              );
              setCoupons(nextCpns);
              syncBackendStore({ coupons: nextCpns });
            }}
            onOpenInvoiceModal={(ord) => setActiveInvoiceOrder(ord)}
          />
        )}
      </main>

      {/* =====================================================================
          QUIET PUBLIC FOOTER (Zero Manager/Admin links exposed in Footer/Sitemap)
         ===================================================================== */}
      <footer className="no-print border-t border-slate-200 bg-white py-10 text-xs text-slate-500">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-6 px-6 lg:flex-row lg:items-center">
          <div>
            <p className="font-display text-sm font-bold text-slate-900">Careermize</p>
            <p className="mt-1">
              Careermize EdTech & Digital Fulfillment Pvt. Ltd. · ISO 9001:2015 Certified · GSTIN
              29AABCC8841K1Z5
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              onClick={() => setActiveWorkspace('explore')}
              className="hover:text-slate-900"
            >
              Home & Bundles
            </button>
            <button
              onClick={() => {
                setActivePublicPage('about');
                setActiveWorkspace('pages');
              }}
              className="hover:text-slate-900"
            >
              About Us
            </button>
            <button
              onClick={() => {
                setActivePublicPage('instructors');
                setActiveWorkspace('pages');
              }}
              className="hover:text-slate-900"
            >
              Instructors
            </button>
            <button
              onClick={() => {
                setActivePublicPage('testimonials');
                setActiveWorkspace('pages');
              }}
              className="hover:text-slate-900"
            >
              Testimonials
            </button>
            <button
              onClick={() => {
                setActivePublicPage('faq');
                setActiveWorkspace('pages');
              }}
              className="hover:text-slate-900"
            >
              FAQ
            </button>
            <button
              onClick={() => {
                setActivePublicPage('contact');
                setActiveWorkspace('pages');
              }}
              className="hover:text-slate-900"
            >
              Contact
            </button>
            <button
              onClick={() => setVerifyModalCertId('CERT-2026-884920')}
              className="font-medium text-sky-700 hover:underline"
            >
              Verify Certificate
            </button>
            <button
              onClick={() => {
                setActivePublicPage('terms');
                setActiveWorkspace('pages');
              }}
              className="hover:text-slate-900"
            >
              Terms
            </button>
            <button
              onClick={() => {
                setActivePublicPage('privacy');
                setActiveWorkspace('pages');
              }}
              className="hover:text-slate-900"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => {
                setActivePublicPage('refund');
                setActiveWorkspace('pages');
              }}
              className="hover:text-slate-900"
            >
              Refund Policy
            </button>
            <button
              onClick={() => {
                setActivePublicPage('cookies');
                setActiveWorkspace('pages');
              }}
              className="hover:text-slate-900"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          ACTIVE MODALS
         ===================================================================== */}
      {showLoginModal && (
        <LoginModal
          unauthorizedRouteAttempt={unauthorizedRouteAttempt}
          onClose={() => {
            setShowLoginModal(false);
            setUnauthorizedRouteAttempt(null);
          }}
          onLoginSuccess={({ token, user, isManager }) => {
            localStorage.setItem('cm_session_token', token);
            setAuthToken(token);
            setCurrentUser(user);
            setIsManagerAuthenticated(isManager);
            setShowLoginModal(false);
            setUnauthorizedRouteAttempt(null);
            if (isManager) {
              setActiveWorkspace('manager');
            } else {
              setActiveWorkspace('student');
            }
          }}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setRegisterModalRefCode(currentUser.referralCode);
          }}
        />
      )}

      {serviceOrderTarget && (
        <ServiceOrderModal
          service={serviceOrderTarget}
          currentUser={currentUser}
          onClose={() => setServiceOrderTarget(null)}
          onCompleteServiceOrder={handleCompleteServiceOrder}
        />
      )}

      {checkoutTarget && (
        <CheckoutModal
          pkg={checkoutTarget.pkg}
          isUpgrade={checkoutTarget.isUpgrade}
          currentActivePackage={packages.find((p) => p.id === currentUser.activePackageId)}
          currentUser={currentUser}
          coupons={coupons}
          onClose={() => setCheckoutTarget(null)}
          onCompleteOrder={handleCompleteOrder}
        />
      )}

      {registerModalRefCode !== null && (
        <RegisterModal
          initialRefCode={registerModalRefCode}
          packages={packages}
          onClose={() => setRegisterModalRefCode(null)}
          onCompleteRegistration={({ token, user, selectedPkgId }) => {
            const selectedPkg =
              packages.find((p) => p.id === selectedPkgId) || packages[2];

            localStorage.setItem('cm_session_token', token);
            setAuthToken(token);
            setCurrentUser(user);
            setAllUsers((prev) => [user, ...prev.filter((u) => u.id !== user.id)]);
            setIsManagerAuthenticated(false);
            setRegisterModalRefCode(null);
            setCheckoutTarget({ pkg: selectedPkg, isUpgrade: false });
          }}
        />
      )}

      {activeInvoiceOrder && (
        <InvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      )}

      {verifyModalCertId !== null && (
        <CertificateVerifyModal
          certificates={certificates}
          initialCertId={verifyModalCertId}
          onClose={() => setVerifyModalCertId(null)}
        />
      )}
    </div>
  );
}
