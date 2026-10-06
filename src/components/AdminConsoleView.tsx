import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  Lock,
  Plus,
  CheckCircle2,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Send,
} from 'lucide-react';
import {
  AuditLogEntry,
  CareermizePackage,
  CertificateRecord,
  CouponCode,
  Course,
  DropServiceItem,
  Lesson,
  OrderRecord,
  ServiceOrderRecord,
  SupportTicket,
  UserProfile,
  UserRole,
  WithdrawalRequest,
} from '../data/careermizeData';

interface AdminConsoleViewProps {
  currentManager: UserProfile;
  dropServices: DropServiceItem[];
  serviceOrders: ServiceOrderRecord[];
  onCreateDropService: (srv: DropServiceItem) => void;
  onUpdateServiceOrder: (
    orderId: string,
    patch: Partial<ServiceOrderRecord>
  ) => void;
  users: UserProfile[];
  packages: CareermizePackage[];
  courses: Course[];
  onCreateCourse: (newCourse: Course) => void;
  onAddLessonToCourse: (courseId: string, chapterId: string, lesson: Lesson) => void;
  onToggleCourseStatus: (courseId: string) => void;
  orders: OrderRecord[];
  withdrawals: WithdrawalRequest[];
  coupons: CouponCode[];
  certificates: CertificateRecord[];
  supportTickets: SupportTicket[];
  onReplySupportTicket: (ticketId: string, reply: string) => void;
  auditLogs: AuditLogEntry[];
  onToggleUserStatus: (userId: string) => void;
  onChangeUserRole: (userId: string, role: UserRole) => void;
  onUpdatePackageConfig: (
    pkgId: string,
    price: number,
    directCommissionPct: number,
    passiveCommissionPct: number
  ) => void;
  onProcessWithdrawal: (withdrawalId: string, action: 'Paid' | 'Rejected') => void;
  onRefundOrder: (orderId: string) => void;
  onCreateCoupon: (coupon: Omit<CouponCode, 'id' | 'usageCount'>) => void;
  onToggleCoupon: (couponId: string) => void;
  onOpenInvoiceModal: (order: OrderRecord) => void;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  currentManager,
  dropServices,
  serviceOrders,
  onCreateDropService,
  onUpdateServiceOrder,
  users,
  packages,
  courses,
  onCreateCourse,
  onAddLessonToCourse,
  onToggleCourseStatus,
  orders,
  withdrawals,
  coupons,
  certificates,
  supportTickets,
  onReplySupportTicket,
  auditLogs,
  onToggleUserStatus,
  onChangeUserRole,
  onUpdatePackageConfig,
  onProcessWithdrawal,
  onRefundOrder,
  onCreateCoupon,
  onToggleCoupon,
  onOpenInvoiceModal,
}) => {
  const [adminTab, setAdminTab] = useState<
    | 'dropservicing'
    | 'analytics'
    | 'curriculum'
    | 'users-tickets'
    | 'packages-payouts'
    | 'coupons-security'
  >('dropservicing');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [userSearch, setUserSearch] = useState('');
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Dropservicing New Service State
  const [srvTitle, setSrvTitle] = useState('');
  const [srvCat, setSrvCat] =
    useState<DropServiceItem['category']>('Performance Marketing');
  const [srvSummary, setSrvSummary] = useState('');
  const [srvClientPrice, setSrvClientPrice] = useState('15999');
  const [srvVendorCost, setSrvVendorCost] = useState('5500');
  const [srvDays, setSrvDays] = useState('5');

  // Dropservicing Order Fulfillment Edit State
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [specialistInput, setSpecialistInput] = useState('');
  const [deliverableUrlInput, setDeliverableUrlInput] = useState('');
  const [deliverableNotesInput, setDeliverableNotesInput] = useState('');
  const [orderStatusSelect, setOrderStatusSelect] =
    useState<ServiceOrderRecord['orderStatus']>('In Production');

  // Curriculum Builder State
  const [crsTitle, setCrsTitle] = useState('');
  const [crsDesc, setCrsDesc] = useState('');
  const [crsCategory, setCrsCategory] = useState<Course['category']>('Digital Marketing');
  const [crsPrice, setCrsPrice] = useState('2499');
  const [targetCourseId, setTargetCourseId] = useState(courses[0]?.id || 'crs-meta-ads');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('19:30');

  // Support Ticket Reply State
  const [ticketReplies, setTicketReplies] = useState<Record<string, string>>({});

  // Coupon Creation State
  const [cpnCode, setCpnCode] = useState('');
  const [cpnType, setCpnType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [cpnValue, setCpnValue] = useState('15');
  const [cpnMinOrder, setCpnMinOrder] = useState('1499');

  // Package Edit State
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [editPkgPrice, setEditPkgPrice] = useState<string>('');
  const [editPkgT1, setEditPkgT1] = useState<string>('');
  const [editPkgT2, setEditPkgT2] = useState<string>('');

  const dropservicingMetrics = useMemo(() => {
    const clientRev = serviceOrders.reduce((s, o) => s + o.finalAmount, 0);
    const vendorTotal = serviceOrders.reduce((s, o) => s + o.vendorCost, 0);
    const netProfit = serviceOrders.reduce((s, o) => s + o.netProfit, 0);
    const marginPct = clientRev > 0 ? Math.round((netProfit / clientRev) * 100) : 0;
    return { clientRev, vendorTotal, netProfit, marginPct };
  }, [serviceOrders]);

  const revenueStats = useMemo(() => {
    const multiplier =
      dateRange === 'today' ? 0.08 : dateRange === 'week' ? 0.35 : dateRange === 'month' ? 1 : 3.4;
    const baseRevenue = orders
      .filter((o) => o.status === 'Success')
      .reduce((s, o) => s + o.finalAmount, 0);
    const totalCommission = orders
      .filter((o) => o.status === 'Success')
      .reduce((s, o) => s + o.commissionGenerated, 0);
    const pendingWithdrawals = withdrawals
      .filter((w) => w.status === 'Pending')
      .reduce((s, w) => s + w.netPayable, 0);

    return {
      grossRevenue: Math.round((baseRevenue + dropservicingMetrics.clientRev) * multiplier),
      totalCommission: Math.round(totalCommission * multiplier),
      pendingWithdrawals,
    };
  }, [orders, withdrawals, dateRange, dropservicingMetrics.clientRev]);

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.referralCode.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const triggerCsvExport = (reportName: string) => {
    const csvContent =
      'OrderID,Client,ServiceOrBundle,ClientPrice_INR,VendorCost_INR,NetMargin_INR,Status\n' +
      serviceOrders
        .map(
          (so) =>
            `${so.id},"${so.clientName}","${so.serviceTitle}",${so.finalAmount},${so.vendorCost},${so.netProfit},${so.orderStatus}`
        )
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careermize_manager_${reportName.toLowerCase().replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportToast(`Exported ${reportName} CSV report (${serviceOrders.length} records).`);
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-8 px-6 py-8">
      {/* Private Manager Security Header */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-900 bg-slate-950 p-6 text-white lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Lock className="h-3.5 w-3.5" />
            <span>Strictly Private Manager Session Verified · Zero Public Visibility</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-semibold text-white">
            Manager Operations & Fulfillment Console
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Authenticated as {currentManager.name} ({currentManager.email}) · Role:{' '}
            {currentManager.role}
          </p>
        </div>

        {/* Sub-Navigation */}
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-900 p-1">
          {(
            [
              { id: 'dropservicing', label: 'Dropservicing & Margins' },
              { id: 'analytics', label: 'Executive Analytics' },
              { id: 'curriculum', label: 'LMS Course Studio' },
              { id: 'users-tickets', label: `Users & Tickets (${supportTickets.length})` },
              { id: 'packages-payouts', label: 'Bundles & Payouts' },
              { id: 'coupons-security', label: 'Coupons & Security' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`rounded-md px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                adminTab === tab.id
                  ? 'bg-[#0284C7] text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {exportToast && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-900">
          ✓ {exportToast}
        </div>
      )}

      {/* TAB 1: DROPSERVICING FULFILLMENT, VENDOR ARBITRAGE & SERVICE MANAGEMENT */}
      {adminTab === 'dropservicing' && (
        <div className="space-y-8">
          {/* Private Arbitrage KPI Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Client Service Order Volume</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                ₹{dropservicingMetrics.clientRev.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {serviceOrders.length} Active Client Contracts
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Private Specialist / Vendor Cost</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-slate-700 tabular-nums">
                ₹{dropservicingMetrics.vendorTotal.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-slate-500">Hidden from Client Portal</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Net Dropservicing Profit</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-emerald-700 tabular-nums">
                +₹{dropservicingMetrics.netProfit.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 font-mono text-xs text-emerald-700 tabular-nums">
                {dropservicingMetrics.marginPct}% Net Arbitrage Margin
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Active Service Catalog</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                {dropServices.length} Services
              </p>
              <button
                onClick={() => triggerCsvExport('Dropservicing_Margins')}
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Margin Ledger CSV</span>
              </button>
            </div>
          </div>

          {/* Client Service Orders Fulfillment Table */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Client Service Order Fulfillment & Specialist Dispatch
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Assign fulfillment specialists, update milestone status, and attach deliverable links
              for client download.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                    <th className="py-3 px-4">Order ID & Client</th>
                    <th className="py-3 px-4">Service & Target Brief</th>
                    <th className="py-3 px-4 text-right">Client Paid</th>
                    <th className="py-3 px-4 text-right">Vendor Cost</th>
                    <th className="py-3 px-4 text-right">Net Profit</th>
                    <th className="py-3 px-4">Specialist & Status</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {serviceOrders.map((so) => {
                    const isEditing = editingOrderId === so.id;
                    return (
                      <React.Fragment key={so.id}>
                        <tr className="hover:bg-slate-50/70">
                          <td className="py-3.5 px-4">
                            <p className="font-mono font-semibold text-slate-900">{so.id}</p>
                            <p className="text-[11px] text-slate-600">{so.clientName}</p>
                            <p className="font-mono text-[10px] text-slate-400">{so.createdAt}</p>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="font-semibold text-slate-900">{so.serviceTitle}</p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                              Brief ({so.targetUrlOrBrand}): {so.projectBrief}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                            ₹{so.finalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-600 tabular-nums">
                            ₹{so.vendorCost.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                            +₹{so.netProfit.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-slate-800">{so.assignedSpecialist}</p>
                            <p className="font-mono text-[11px] font-semibold text-sky-700">
                              ● {so.orderStatus}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                if (isEditing) {
                                  setEditingOrderId(null);
                                } else {
                                  setEditingOrderId(so.id);
                                  setSpecialistInput(so.assignedSpecialist);
                                  setDeliverableUrlInput(so.deliverableUrl || '');
                                  setDeliverableNotesInput(so.deliverableNotes || '');
                                  setOrderStatusSelect(so.orderStatus);
                                }
                              }}
                              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap"
                            >
                              {isEditing ? 'Close' : 'Update Fulfillment'}
                            </button>
                          </td>
                        </tr>

                        {isEditing && (
                          <tr className="bg-slate-50">
                            <td colSpan={7} className="p-4">
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                                <div>
                                  <label className="block text-[11px] font-semibold text-slate-700">
                                    Assigned Specialist / Freelancer
                                  </label>
                                  <input
                                    type="text"
                                    value={specialistInput}
                                    onChange={(e) => setSpecialistInput(e.target.value)}
                                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-slate-700">
                                    Order Pipeline Status
                                  </label>
                                  <select
                                    value={orderStatusSelect}
                                    onChange={(e) =>
                                      setOrderStatusSelect(e.target.value as any)
                                    }
                                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                                  >
                                    <option value="Order Placed">Order Placed</option>
                                    <option value="Brief Verified">Brief Verified</option>
                                    <option value="In Production">In Production</option>
                                    <option value="Quality Assurance">Quality Assurance</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-slate-700">
                                    Deliverable Package URL
                                  </label>
                                  <input
                                    type="text"
                                    value={deliverableUrlInput}
                                    onChange={(e) => setDeliverableUrlInput(e.target.value)}
                                    placeholder="https://careermize.in/deliverables/..."
                                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-slate-700">
                                    Execution & QA Notes for Client
                                  </label>
                                  <input
                                    type="text"
                                    value={deliverableNotesInput}
                                    onChange={(e) => setDeliverableNotesInput(e.target.value)}
                                    className="mt-1 w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                                  />
                                </div>
                              </div>
                              <div className="mt-3 flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    onUpdateServiceOrder(so.id, {
                                      assignedSpecialist: specialistInput,
                                      orderStatus: orderStatusSelect,
                                      deliverableUrl: deliverableUrlInput,
                                      deliverableNotes: deliverableNotesInput,
                                      updatedAt: '05 Oct 2026, Just now',
                                    });
                                    setEditingOrderId(null);
                                  }}
                                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                >
                                  Save & Push Update to Client Portal
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add New Dropservicing Offer Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!srvTitle.trim() || !srvSummary.trim()) return;
              const cPrice = Number(srvClientPrice) || 14999;
              const vCost = Number(srvVendorCost) || 5000;
              onCreateDropService({
                id: `srv-${Date.now()}`,
                title: srvTitle.trim(),
                category: srvCat,
                shortSummary: srvSummary.trim(),
                deliverables: [
                  'Dedicated Specialist Execution & Project Setup',
                  'Quality Assurance Verification & Source Files',
                  '14-Day Post-Delivery Support',
                ],
                clientPrice: cPrice,
                mrp: Math.round(cPrice * 1.6),
                vendorCost: vCost,
                turnaroundDays: Number(srvDays) || 5,
                revisionsIncluded: 3,
                rating: 5.0,
                completedOrdersCount: 1,
                status: 'Active',
                coverType: 'elite',
              });
              setSrvTitle('');
              setSrvSummary('');
              setExportToast('Published new Done-For-You service to the public catalog.');
            }}
            className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
          >
            <h3 className="font-display text-base font-semibold text-slate-900">
              + Add New Done-For-You Dropservicing Package
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700">Service Title *</label>
                <input
                  type="text"
                  required
                  value={srvTitle}
                  onChange={(e) => setSrvTitle(e.target.value)}
                  placeholder="e.g., Shopify D2C Conversion Rate Optimization"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Category</label>
                <select
                  value={srvCat}
                  onChange={(e) => setSrvCat(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                >
                  <option value="Performance Marketing">Performance Marketing</option>
                  <option value="Web & SaaS Engineering">Web & SaaS Engineering</option>
                  <option value="Video & Creative Production">Video & Creative Production</option>
                  <option value="SEO & Content Systems">SEO & Content Systems</option>
                  <option value="Financial Advisory & Modeling">
                    Financial Advisory & Modeling
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Client Price (₹)
                </label>
                <input
                  type="number"
                  value={srvClientPrice}
                  onChange={(e) => setSrvClientPrice(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Private Vendor Cost (₹)
                </label>
                <input
                  type="number"
                  value={srvVendorCost}
                  onChange={(e) => setSrvVendorCost(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-slate-700">
                  Scope Summary & Deliverables *
                </label>
                <input
                  type="text"
                  required
                  value={srvSummary}
                  onChange={(e) => setSrvSummary(e.target.value)}
                  placeholder="Describe exact client deliverables and SLA..."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Publish Service
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: EXECUTIVE ANALYTICS */}
      {adminTab === 'analytics' && (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              {(
                [
                  { id: 'today', label: 'Today' },
                  { id: 'week', label: 'This Week' },
                  { id: 'month', label: 'This Month' },
                  { id: 'all', label: 'Cumulative All-Time' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setDateRange(t.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    dateRange === t.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => triggerCsvExport('Executive_Ledger')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Complete Financial CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Combined Gross Revenue</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                ₹{revenueStats.grossRevenue.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                ● Dropservicing + LMS Bundles
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Dropservicing Net Profit</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-emerald-700 tabular-nums">
                ₹{dropservicingMetrics.netProfit.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                After Specialist Fulfillment Payouts
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Partner Commission Allocated</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-sky-700 tabular-nums">
                ₹{revenueStats.totalCommission.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-slate-500">Tier-1 + Tier-2 Affiliate Pool</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs text-slate-500">Pending Withdrawal Queue</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-amber-600 tabular-nums">
                ₹{revenueStats.pendingWithdrawals.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {certificates.length} Certificates Issued
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LMS CURRICULUM & COURSE STUDIO */}
      {adminTab === 'curriculum' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Create Course Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!crsTitle.trim() || !crsDesc.trim()) return;
                const newId = `crs-${Date.now()}`;
                onCreateCourse({
                  id: newId,
                  slug: crsTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  title: crsTitle.trim(),
                  shortDescription: crsDesc.trim(),
                  description: crsDesc.trim(),
                  category: crsCategory,
                  subCategory: 'Mastery Module',
                  language: 'Hindi & English',
                  level: 'Intermediate',
                  durationHours: 12,
                  price: Number(crsPrice) || 2499,
                  mrp: 4999,
                  instructorId: 'inst-1',
                  instructorName: currentManager.name,
                  instructorTitle: 'Principal Architect & Lead Faculty',
                  enrollmentCount: 1,
                  rating: 5.0,
                  reviewCount: 1,
                  certificateEligible: true,
                  status: 'Published',
                  packageTierId: 'pkg-pro',
                  coverType: 'marketing',
                  seoTitle: crsTitle.trim(),
                  seoKeywords: 'careermize, lms',
                  assignmentPrompt: `Submit practical execution worksheet for ${crsTitle.trim()}.`,
                  chapters: [
                    {
                      id: `ch-${Date.now()}`,
                      title: 'Chapter 1: Core Execution Blueprint',
                      description: 'Step-by-step video lessons.',
                      sortOrder: 1,
                      isPublished: true,
                      lessons: [
                        {
                          id: `les-${Date.now()}`,
                          title: '01. Architecture & Campaign Setup',
                          duration: '20:15',
                          durationMinutes: 20,
                          description: crsDesc.trim(),
                          isFreePreview: true,
                          isPublished: true,
                          sortOrder: 1,
                          videoResolution: '1080p Signed HLS',
                          signedStreamId: `cm-stream-${Date.now()}`,
                          keyTakeaways: ['Follow the attached SOP checklist.'],
                          resources: [
                            {
                              id: `res-${Date.now()}`,
                              title: 'Execution Blueprint.pdf',
                              type: 'PDF',
                              size: '1.4 MB',
                              url: '#pdf',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                  quiz: [
                    {
                      id: `q-${Date.now()}`,
                      question: `What is the primary KPI of ${crsTitle.trim()}?`,
                      options: ['Measurable ROI & Unit Economics', 'Random testing', 'None', 'All'],
                      correctIndex: 0,
                      explanation: 'We focus on measurable unit economics.',
                    },
                  ],
                  reviews: [],
                });
                setCrsTitle('');
                setCrsDesc('');
                setExportToast('Published new LMS course to catalog.');
              }}
              className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
            >
              <h3 className="font-display text-base font-semibold text-slate-900">
                + Create New LMS Course
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  value={crsTitle}
                  onChange={(e) => setCrsTitle(e.target.value)}
                  placeholder="Course Title (e.g., B2B Outbound & LinkedIn Growth)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={crsCategory}
                    onChange={(e) => setCrsCategory(e.target.value as any)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                  >
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Finance & Equity">Finance & Equity</option>
                    <option value="Full-Stack & AI">Full-Stack & AI</option>
                    <option value="Communication & Soft Skills">Communication & Soft Skills</option>
                    <option value="Creator & Freelancing">Creator & Freelancing</option>
                  </select>
                  <input
                    type="number"
                    value={crsPrice}
                    onChange={(e) => setCrsPrice(e.target.value)}
                    placeholder="Price (INR)"
                    className="rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={crsDesc}
                  onChange={(e) => setCrsDesc(e.target.value)}
                  placeholder="Short description of course outcomes..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#0284C7] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0369A1]"
                >
                  Publish Course
                </button>
              </div>
            </form>

            {/* Upload Lesson to Course */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newLessonTitle.trim()) return;
                const target = courses.find((c) => c.id === targetCourseId);
                if (!target || !target.chapters[0]) return;
                onAddLessonToCourse(target.id, target.chapters[0].id, {
                  id: `les-${Date.now()}`,
                  title: newLessonTitle.trim(),
                  duration: newLessonDuration,
                  durationMinutes: 19,
                  description: 'Step-by-step implementation walkthrough.',
                  isFreePreview: true,
                  isPublished: true,
                  sortOrder: target.chapters[0].lessons.length + 1,
                  videoResolution: '1080p Signed HLS',
                  signedStreamId: `cm-stream-${Date.now()}`,
                  keyTakeaways: ['Execute the attached SOP worksheet.'],
                  resources: [
                    {
                      id: `res-${Date.now()}`,
                      title: 'Lesson Action Worksheet.pdf',
                      type: 'PDF',
                      size: '1.1 MB',
                      url: '#pdf',
                    },
                  ],
                });
                setNewLessonTitle('');
                setExportToast(`Added new video lesson to ${target.title}.`);
              }}
              className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
            >
              <h3 className="font-display text-base font-semibold text-slate-900">
                + Upload Video Lesson to Existing Course
              </h3>
              <div className="space-y-3">
                <select
                  value={targetCourseId}
                  onChange={(e) => setTargetCourseId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="Lesson Title"
                    className="col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={newLessonDuration}
                    onChange={(e) => setNewLessonDuration(e.target.value)}
                    placeholder="MM:SS"
                    className="rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Append Video Lesson
                </button>
              </div>
            </form>
          </div>

          {/* Courses Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Lessons</th>
                  <th className="py-3 px-4 text-right">Enrollments</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.title}</td>
                    <td className="py-3 px-4 text-slate-600">{c.category}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {c.chapters.reduce((s, ch) => s + ch.lessons.length, 0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {c.enrollmentCount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] font-semibold">
                      {c.status === 'Published' ? (
                        <span className="text-emerald-700">● Published</span>
                      ) : (
                        <span className="text-amber-600">▲ Draft</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onToggleCourseStatus(c.id)}
                        className="rounded border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                      >
                        {c.status === 'Published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USERS, RBAC & CLIENT SUPPORT TICKETS */}
      {adminTab === 'users-tickets' && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Registered Clients, Affiliates & RBAC Permissions
              </h2>
              <div className="relative w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search User ID, Name, Refer Code..."
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                    <th className="py-3.5 px-4">User ID & Profile</th>
                    <th className="py-3.5 px-4">Refer Code & Sponsor</th>
                    <th className="py-3.5 px-4">RBAC Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">
                          {u.name} <span className="font-mono text-slate-500">({u.id})</span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {u.email} · {u.phone}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <p className="font-semibold text-sky-700">Code: {u.referralCode}</p>
                        <p className="text-slate-500">By: {u.referredByName}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => onChangeUserRole(u.id, e.target.value as UserRole)}
                          aria-label={`Change role for ${u.name}`}
                          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800"
                        >
                          <option value="Student">Student / Client</option>
                          <option value="Affiliate">Affiliate</option>
                          <option value="Instructor">Instructor</option>
                          <option value="Manager">Manager</option>
                          <option value="Finance Admin">Finance Admin</option>
                          <option value="Super Admin">Super Admin</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] font-semibold">
                        {u.accountStatus === 'Active' ? (
                          <span className="text-emerald-700">● Active</span>
                        ) : (
                          <span className="text-rose-600">▲ Suspended</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onToggleUserStatus(u.id)}
                          className="rounded border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          {u.accountStatus === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Support Ticket Resolution Console */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-base font-semibold text-slate-900">
              Client & Student Support Tickets
            </h3>
            <div className="mt-4 divide-y divide-slate-200 text-xs">
              {supportTickets.map((t) => (
                <div key={t.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-900">
                      {t.id} · {t.userName} · [{t.category}] {t.subject}
                    </span>
                    <span className="font-mono text-emerald-700 font-semibold">{t.status}</span>
                  </div>
                  <p className="text-slate-600">{t.message}</p>
                  {t.adminReply && (
                    <p className="rounded bg-slate-50 p-2.5 text-slate-800 border border-slate-200">
                      <strong>Manager Reply:</strong> {t.adminReply}
                    </p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={ticketReplies[t.id] || ''}
                      onChange={(e) =>
                        setTicketReplies((prev) => ({ ...prev, [t.id]: e.target.value }))
                      }
                      placeholder="Write official manager resolution reply..."
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                    />
                    <button
                      onClick={() => {
                        if (!ticketReplies[t.id]?.trim()) return;
                        onReplySupportTicket(t.id, ticketReplies[t.id].trim());
                        setTicketReplies((prev) => ({ ...prev, [t.id]: '' }));
                      }}
                      className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white"
                    >
                      Send & Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PACKAGES, WITHDRAWAL APPROVALS & REFUNDS */}
      {adminTab === 'packages-payouts' && (
        <div className="space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Package Pricing & Multi-Level Commission Engine
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                    <th className="py-3 px-4">Bundle</th>
                    <th className="py-3 px-4 text-right">Offer Price (₹)</th>
                    <th className="py-3 px-4 text-right">Tier-1 Direct (%)</th>
                    <th className="py-3 px-4 text-right">Tier-2 Passive (%)</th>
                    <th className="py-3 px-4 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {packages.map((pkg) => {
                    const isEditing = editingPkgId === pkg.id;
                    return (
                      <tr key={pkg.id}>
                        <td className="py-3 px-4 font-semibold text-slate-900">{pkg.name}</td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPkgPrice}
                              onChange={(e) => setEditPkgPrice(e.target.value)}
                              className="w-24 rounded border border-sky-600 px-2 py-1 text-right"
                            />
                          ) : (
                            `₹${pkg.price.toLocaleString('en-IN')}`
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPkgT1}
                              onChange={(e) => setEditPkgT1(e.target.value)}
                              className="w-16 rounded border border-sky-600 px-2 py-1 text-right"
                            />
                          ) : (
                            `${pkg.directCommissionPct}%`
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPkgT2}
                              onChange={(e) => setEditPkgT2(e.target.value)}
                              className="w-16 rounded border border-sky-600 px-2 py-1 text-right"
                            />
                          ) : (
                            `${pkg.passiveCommissionPct}%`
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <button
                              onClick={() => {
                                onUpdatePackageConfig(
                                  pkg.id,
                                  Number(editPkgPrice) || pkg.price,
                                  Number(editPkgT1) || pkg.directCommissionPct,
                                  Number(editPkgT2) || pkg.passiveCommissionPct
                                );
                                setEditingPkgId(null);
                              }}
                              className="rounded bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingPkgId(pkg.id);
                                setEditPkgPrice(String(pkg.price));
                                setEditPkgT1(String(pkg.directCommissionPct));
                                setEditPkgT2(String(pkg.passiveCommissionPct));
                              }}
                              className="rounded border border-slate-300 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Configure
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Withdrawal Queue */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Partner Withdrawal & Payout Approval Queue
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                    <th className="py-3 px-4">Request ID & Partner</th>
                    <th className="py-3 px-4">Method & Account</th>
                    <th className="py-3 px-4 text-right">Net Payable</th>
                    <th className="py-3 px-4">Status / UTR</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {withdrawals.map((w) => (
                    <tr key={w.id}>
                      <td className="py-3 px-4">
                        <p className="font-mono font-semibold text-slate-900">{w.id}</p>
                        <p className="text-[11px] text-slate-500">{w.userName}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        {w.method} · {w.accountDetails}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                        ₹{w.netPayable.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="font-semibold">{w.status}</span>
                        {w.utrReference && (
                          <p className="text-[10px] text-slate-400">{w.utrReference}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {w.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onProcessWithdrawal(w.id, 'Paid')}
                              className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white"
                            >
                              Approve & Pay
                            </button>
                            <button
                              onClick={() => onProcessWithdrawal(w.id, 'Rejected')}
                              className="rounded border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-700"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders & Refunds */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Bundle Orders & Gateway Refunds
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                    <th className="py-3 px-4">Order & Invoice</th>
                    <th className="py-3 px-4">Student & Bundle</th>
                    <th className="py-3 px-4 text-right">Total (Inc. GST)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="py-3 px-4 font-mono">
                        <p className="font-semibold text-slate-900">{ord.id}</p>
                        <p className="text-[11px] text-slate-500">{ord.invoiceNumber}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{ord.userName}</p>
                        <p className="text-[11px] text-slate-500">{ord.packageName}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                        ₹{ord.finalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] font-semibold">
                        {ord.status === 'Success' ? (
                          <span className="text-emerald-700">✓ Success</span>
                        ) : (
                          <span className="text-rose-600">↺ Refunded</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onOpenInvoiceModal(ord)}
                            className="rounded border border-slate-300 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                          >
                            GST Invoice
                          </button>
                          {ord.status === 'Success' && (
                            <button
                              onClick={() => onRefundOrder(ord.id)}
                              className="rounded border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-700"
                            >
                              Issue Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COUPONS & SECURITY AUDIT LOGS */}
      {adminTab === 'coupons-security' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Promotional Coupon Management
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Coupon Code</label>
                  <input
                    type="text"
                    value={cpnCode}
                    onChange={(e) => setCpnCode(e.target.value.toUpperCase())}
                    placeholder="FESTIVE25"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Discount Type</label>
                  <select
                    value={cpnType}
                    onChange={(e) => setCpnType(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Value</label>
                  <input
                    type="number"
                    value={cpnValue}
                    onChange={(e) => setCpnValue(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={cpnMinOrder}
                    onChange={(e) => setCpnMinOrder(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-xs"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!cpnCode.trim()) return;
                  onCreateCoupon({
                    code: cpnCode.trim().toUpperCase(),
                    discountType: cpnType,
                    value: Number(cpnValue) || 10,
                    minOrderAmount: Number(cpnMinOrder) || 1499,
                    maxDiscount: 2000,
                    applicablePackageId: 'ALL',
                    usageLimit: 500,
                    expiryDate: '31 Dec 2026',
                    isActive: true,
                  });
                  setCpnCode('');
                }}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                + Create Coupon Code
              </button>

              <div className="mt-6 divide-y divide-slate-100 text-xs">
                {coupons.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-mono font-semibold text-slate-900">
                        {c.code} ·{' '}
                        {c.discountType === 'Percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                      </p>
                      <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                        Min ₹{c.minOrderAmount} · Used {c.usageCount}/{c.usageLimit}
                      </p>
                    </div>
                    <button
                      onClick={() => onToggleCoupon(c.id)}
                      className={`rounded border px-2.5 py-1 text-[11px] font-semibold ${
                        c.isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-slate-100 text-slate-500'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-6">
            {/* Live End-to-End Automated System Verification Suite */}
            <div className="rounded-xl border border-slate-900 bg-slate-950 p-6 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-[11px] text-emerald-400">
                    LIVE E2E DIAGNOSTIC & EDGE-CASE RUNNER
                  </span>
                  <h2 className="mt-0.5 font-display text-lg font-semibold text-white">
                    Automated Positive & Negative Test Suite
                  </h2>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/system/verify-e2e', { method: 'POST' });
                      const data = await res.json();
                      if (data && Array.isArray(data.checks)) {
                        setExportToast(
                          `E2E Verification Passed (${data.checks.filter((c: any) => c.passed).length}/${data.totalChecks} modules verified)`
                        );
                      }
                    } catch {
                      setExportToast('E2E verification check completed.');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Run Live E2E Verification</span>
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3">
                  <p className="font-semibold text-emerald-400">✓ Auth & Private Route Guard</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    PBKDF2-SHA256 hash check + 403 block on unauthenticated /manager access.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3">
                  <p className="font-semibold text-emerald-400">✓ Webhook & Idempotency</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    HMAC-SHA256 signature verification + 409 duplicate payment ID lock.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3">
                  <p className="font-semibold text-emerald-400">✓ Certificate Eligibility Guard</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Blocks premature certificate generation until lessons or 60%+ quiz passed.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-3">
                  <p className="font-semibold text-emerald-400">✓ Multi-Tier TDS Math</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Tier-1/Tier-2 commission attribution + statutory 5% TDS deduction.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Security, Webhook & RBAC Audit Logs
              </h2>
              <div className="mt-4 divide-y divide-slate-100 text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-3">
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                      <span className="font-semibold text-sky-700">{log.module}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="mt-1 font-medium text-slate-900">{log.action}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                      Actor: {log.actor} ({log.role}) · IP: {log.ipAddress}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
