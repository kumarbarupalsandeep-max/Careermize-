import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  QrCode,
  ArrowUpRight,
  GitBranch,
  Wallet,
  MousePointerClick,
  Users,
  PlusCircle,
  ArrowRight,
  X,
} from 'lucide-react';
import {
  CareermizePackage,
  ReferralClickLog,
  ReferralNode,
  UserProfile,
  WithdrawalRequest,
} from '../data/careermizeData';

interface AffiliateReferralViewProps {
  currentUser: UserProfile;
  packages: CareermizePackage[];
  referralTree: ReferralNode[];
  clickLogs: ReferralClickLog[];
  withdrawals: WithdrawalRequest[];
  onSimulateReferralConversion: (pkgId: string, tier: 1 | 2, buyerName: string, buyerCity: string) => void;
  onAdvanceCommissionStatus: (refId: string) => void;
  onRequestWithdrawal: (amount: number, method: 'UPI Instant' | 'NEFT / IMPS Bank') => void;
}

export const AffiliateReferralView: React.FC<AffiliateReferralViewProps> = ({
  currentUser,
  packages,
  referralTree,
  clickLogs,
  withdrawals,
  onSimulateReferralConversion,
  onAdvanceCommissionStatus,
  onRequestWithdrawal,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [tierFilter, setTierFilter] = useState<'ALL' | 1 | 2>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Simulator State
  const [simBuyerName, setSimBuyerName] = useState('Nikhil Choudhary');
  const [simBuyerCity, setSimBuyerCity] = useState('Jodhpur, RJ');
  const [simPkgId, setSimPkgId] = useState('pkg-elite');
  const [simTier, setSimTier] = useState<1 | 2>(1);

  // Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('2599');
  const [withdrawMethod, setWithdrawMethod] = useState<'UPI Instant' | 'NEFT / IMPS Bank'>(
    'UPI Instant'
  );
  const [withdrawMsg, setWithdrawMsg] = useState<string | null>(null);

  const referralUrl = `https://careermize.in/register?ref=${currentUser.referralCode}`;

  const metrics = useMemo(() => {
    const totalSales = referralTree.reduce((sum, r) => sum + r.purchaseAmount, 0);
    const totalCommission = referralTree.reduce((sum, r) => sum + r.commissionEarned, 0);
    const pending = referralTree
      .filter((r) => r.commissionStatus === 'Pending' || r.commissionStatus === 'Eligible')
      .reduce((sum, r) => sum + r.commissionEarned, 0);
    const approvedPayable = referralTree
      .filter((r) => r.commissionStatus === 'Approved' || r.commissionStatus === 'Payable')
      .reduce((sum, r) => sum + r.commissionEarned, 0);
    const paid = referralTree
      .filter((r) => r.commissionStatus === 'Paid')
      .reduce((sum, r) => sum + r.commissionEarned, 0);

    return {
      totalReferrals: referralTree.length,
      tier1Count: referralTree.filter((r) => r.tier === 1).length,
      tier2Count: referralTree.filter((r) => r.tier === 2).length,
      totalSales,
      totalCommission,
      pending,
      approvedPayable,
      paid,
    };
  }, [referralTree]);

  const filteredTree = useMemo(() => {
    return referralTree
      .filter((r) => (tierFilter === 'ALL' ? true : r.tier === tierFilter))
      .filter((r) => (statusFilter === 'ALL' ? true : r.commissionStatus === statusFilter));
  }, [referralTree, tierFilter, statusFilter]);

  const handleCopy = (text: string, type: 'link' | 'code') => {
    navigator.clipboard?.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1800);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-8 px-6 py-8">
      {/* 1. REFERRAL IDENTITY & ATTRIBUTION HEADER */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Careermize Partner & Affiliate Engine</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-800">User ID: {currentUser.id}</span>
              <span aria-hidden="true">·</span>
              <span>
                Sponsor: {currentUser.referredByName} ({currentUser.referredByCode})
              </span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-slate-900">
              Referral Attribution & Commission Ledger
            </h1>
            <p className="text-xs text-slate-600">
              30-day cookie attribution · Automatic Tier-1 (up to 72%) + Tier-2 (up to 12%) split on
              every package enrollment.
            </p>
          </div>

          {/* Shareable Link, Refer Code & QR Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-500">Refer Code:</span>
              <span className="ml-2 font-mono text-xs font-semibold text-slate-900">
                {currentUser.referralCode}
              </span>
              <button
                onClick={() => handleCopy(currentUser.referralCode, 'code')}
                className="ml-2.5 text-slate-500 hover:text-slate-900"
                aria-label="Copy referral code"
              >
                {copiedCode ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2">
              <span className="font-mono text-xs text-slate-700 truncate max-w-[230px]">
                {referralUrl}
              </span>
              <button
                onClick={() => handleCopy(referralUrl, 'link')}
                className="ml-2.5 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
            >
              <QrCode className="h-4 w-4" />
              <span>Referral QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. COMMISSION PIPELINE METRICS (Pending -> Eligible -> Approved -> Payable -> Paid) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Total Referral Sales</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            ₹{metrics.totalSales.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-500 tabular-nums">
            {metrics.totalReferrals} Enrollments ({metrics.tier1Count} T1 · {metrics.tier2Count} T2)
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Total Commission Earned</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-sky-700 tabular-nums">
            ₹{metrics.totalCommission.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">Lifetime Gross Earnings</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Pending & Eligible</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-amber-600 tabular-nums">
            ₹{metrics.pending.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">In 7-Day Refund Verification</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Approved & Payable Wallet</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-emerald-700 tabular-nums">
            ₹{metrics.approvedPayable.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">Ready for Instant UPI Payout</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Settled / Paid Out</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            ₹{metrics.paid.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">Credited to Bank / UPI</p>
        </div>
      </div>

      {/* 3. INTERACTIVE REFERRAL CONVERSION SIMULATOR & PIPELINE DIAGRAM */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-medium text-sky-700">
              Live Attribution Sandbox
            </p>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Test Referral Link Conversion & Commission Engine
            </h2>
            <p className="text-xs text-slate-600">
              Simulate a new student visiting <code className="font-mono">{referralUrl}</code>,
              completing OTP registration, and purchasing a bundle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
            <span>Pending</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            <span>Eligible</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            <span>Approved</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-emerald-700 font-semibold">Payable</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Paid</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block text-xs font-medium text-slate-700">New Student Name</label>
            <input
              type="text"
              value={simBuyerName}
              onChange={(e) => setSimBuyerName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">City & State</label>
            <input
              type="text"
              value={simBuyerCity}
              onChange={(e) => setSimBuyerCity(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Purchased Bundle</label>
            <select
              value={simPkgId}
              onChange={(e) => setSimPkgId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
            >
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (₹{p.price.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Commission Level</label>
            <select
              value={simTier}
              onChange={(e) => setSimTier(Number(e.target.value) as 1 | 2)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
            >
              <option value={1}>Tier-1 Direct Referral (60%–72%)</option>
              <option value={2}>Tier-2 Sub-Affiliate (8%–12%)</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => {
                if (!simBuyerName.trim()) return;
                onSimulateReferralConversion(
                  simPkgId,
                  simTier,
                  simBuyerName.trim(),
                  simBuyerCity.trim() || 'Jaipur, RJ'
                );
              }}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0284C7] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0369A1] whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Simulate Referral Sale</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MULTI-TIER REFERRAL TREE & CONVERSION LEDGER */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Multi-Level Referral Tree & Commission Ledger
              </h2>
              <p className="text-xs text-slate-500">
                Click "Advance Stage" on any row to progress commission from Pending → Eligible →
                Approved → Payable → Paid.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={tierFilter}
                onChange={(e) =>
                  setTierFilter(e.target.value === 'ALL' ? 'ALL' : (Number(e.target.value) as 1 | 2))
                }
                aria-label="Filter by referral tier"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700"
              >
                <option value="ALL">All Tiers (T1 + T2)</option>
                <option value={1}>Tier 1 (Direct)</option>
                <option value={2}>Tier 2 (Passive)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by commission status"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Eligible">Eligible</option>
                <option value="Approved">Approved</option>
                <option value="Payable">Payable</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                  <th className="py-3 px-4">Referred Member</th>
                  <th className="py-3 px-4">Bundle & Tier</th>
                  <th className="py-3 px-4 text-right">Order Value</th>
                  <th className="py-3 px-4 text-right">Commission</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTree.map((node) => (
                  <tr key={node.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{node.name}</p>
                      <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {node.userId} · {node.city} · {node.joinedDate}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{node.packagePurchased}</p>
                      <p className="text-[11px] text-slate-500">
                        {node.tier === 1 ? 'Tier-1 Direct' : 'Tier-2 Passive'}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700 tabular-nums">
                      ₹{node.purchaseAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                      +₹{node.commissionEarned.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] font-semibold">
                      {node.commissionStatus === 'Paid' && (
                        <span className="text-emerald-700">✓ Paid</span>
                      )}
                      {node.commissionStatus === 'Payable' && (
                        <span className="text-sky-700">● Payable</span>
                      )}
                      {node.commissionStatus === 'Approved' && (
                        <span className="text-sky-700">● Approved</span>
                      )}
                      {node.commissionStatus === 'Eligible' && (
                        <span className="text-amber-600">▲ Eligible</span>
                      )}
                      {node.commissionStatus === 'Pending' && (
                        <span className="text-amber-600">▲ Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {node.commissionStatus !== 'Paid' ? (
                        <button
                          onClick={() => onAdvanceCommissionStatus(node.id)}
                          className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 whitespace-nowrap"
                        >
                          Advance Stage →
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Click & Session Attribution Logs */}
          <div className="pt-4">
            <h3 className="font-display text-base font-semibold text-slate-900">
              Click Tracking & Cookie Attribution Log
            </h3>
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                    <th className="py-2.5 px-4">Timestamp</th>
                    <th className="py-2.5 px-4">Traffic Source</th>
                    <th className="py-2.5 px-4">Device & IP</th>
                    <th className="py-2.5 px-4">Conversion Funnel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {clickLogs.map((clk) => (
                    <tr key={clk.id}>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600 tabular-nums">
                        {clk.timestamp}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {clk.source} · {clk.city}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">
                        {clk.device} ({clk.visitorIp})
                      </td>
                      <td className="py-2.5 px-4 text-[11px]">
                        {clk.convertedToPurchase ? (
                          <span className="font-semibold text-emerald-700">
                            ✓ Registered & Purchased ({clk.attributedUserId})
                          </span>
                        ) : clk.convertedToRegistration ? (
                          <span className="font-medium text-amber-600">
                            ▲ Registered (Checkout Pending)
                          </span>
                        ) : (
                          <span className="text-slate-500">Clicked Link (Cookie Stored)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Withdrawal & Payout Console + Partner Leaderboard */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-slate-900">
                Commission Withdrawal Desk
              </h3>
              <Wallet className="h-4 w-4 text-sky-700" />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Minimum withdrawal: ₹500 · 5% statutory TDS deducted under Sec 194H.
            </p>

            {withdrawMsg && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                ✓ {withdrawMsg}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Withdrawal Amount (INR)
                </label>
                <input
                  type="number"
                  min={500}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm font-semibold text-slate-900 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Payout Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                >
                  <option value="UPI Instant">UPI Instant ({currentUser.upiId})</option>
                  <option value="NEFT / IMPS Bank">
                    NEFT / IMPS ({currentUser.bankAccount})
                  </option>
                </select>
              </div>

              {/* Live TDS & Net Payout Calculation */}
              {Number(withdrawAmount) >= 500 && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs tabular-nums">
                  <div className="flex justify-between text-slate-600">
                    <span>Gross Request:</span>
                    <span>₹{Number(withdrawAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-slate-500">
                    <span>Less 5% TDS (PAN {currentUser.panNumber}):</span>
                    <span>-₹{Math.round(Number(withdrawAmount) * 0.05).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between border-t border-slate-200 pt-1.5 font-semibold text-emerald-700">
                    <span>Net Bank / UPI Credit:</span>
                    <span>
                      ₹{Math.round(Number(withdrawAmount) * 0.95).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  const amt = Number(withdrawAmount);
                  if (amt < 500) return;
                  onRequestWithdrawal(amt, withdrawMethod);
                  setWithdrawMsg(
                    `Withdrawal request of ₹${amt.toLocaleString('en-IN')} submitted via ${withdrawMethod}.`
                  );
                }}
                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Submit Payout Request
              </button>
            </div>

            {/* Withdrawal History */}
            <div className="mt-6 border-t border-slate-200 pt-4">
              <h4 className="text-xs font-semibold text-slate-800">Payout History</h4>
              <div className="mt-3 divide-y divide-slate-100 text-xs">
                {withdrawals
                  .filter((w) => w.userId === currentUser.id)
                  .map((w) => (
                    <div key={w.id} className="py-2.5">
                      <div className="flex items-center justify-between font-mono font-semibold text-slate-900 tabular-nums">
                        <span>{w.id}</span>
                        <span>₹{w.netPayable.toLocaleString('en-IN')} Net</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {w.method} · {w.requestedAt} ·{' '}
                        <span className="font-semibold text-emerald-700">{w.status}</span>
                      </p>
                      {w.utrReference && (
                        <p className="font-mono text-[10px] text-slate-400">
                          Bank Ref: {w.utrReference}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* All-India Partner Leaderboard */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-base font-semibold text-slate-900">
              Top Careermize Partners (Oct 2026)
            </h3>
            <div className="mt-3 divide-y divide-slate-100 text-xs">
              {[
                { rank: '01', name: 'Aarav Sharma (Delhi NCR)', pkg: 'Elite', earned: 184500 },
                { rank: '02', name: 'Ritika Deshmukh (Pune)', pkg: 'Elite', earned: 142900 },
                { rank: '03', name: 'Sandeep Kumar Barupal (Jaipur)', pkg: 'Pro', earned: metrics.totalCommission },
                { rank: '04', name: 'Yashvardhan Chauhan (Indore)', pkg: 'Prime', earned: 18900 },
              ].map((row) => (
                <div key={row.rank} className="flex items-center justify-between py-2.5">
                  <div>
                    <span className="font-mono font-semibold text-sky-700">{row.rank}. </span>
                    <span className="font-medium text-slate-900">{row.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    ₹{row.earned.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REFERRAL QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 text-center shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-display text-base font-semibold text-slate-900">
                Partner Referral QR Code
              </h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Clean SVG Deterministic QR Matrix */}
            <div className="mx-auto my-5 flex h-48 w-48 items-center justify-center rounded-xl border-2 border-slate-900 bg-white p-4">
              <svg viewBox="0 0 100 100" className="h-full w-full fill-slate-900">
                <rect x="5" y="5" width="25" height="25" fill="none" stroke="#0F172A" strokeWidth="6" />
                <rect x="12" y="12" width="11" height="11" />
                <rect x="70" y="5" width="25" height="25" fill="none" stroke="#0F172A" strokeWidth="6" />
                <rect x="77" y="12" width="11" height="11" />
                <rect x="5" y="70" width="25" height="25" fill="none" stroke="#0F172A" strokeWidth="6" />
                <rect x="12" y="77" width="11" height="11" />
                <rect x="40" y="10" width="8" height="8" />
                <rect x="52" y="18" width="8" height="16" />
                <rect x="38" y="38" width="24" height="24" />
                <rect x="12" y="42" width="16" height="8" />
                <rect x="70" y="44" width="18" height="10" />
                <rect x="42" y="72" width="12" height="18" />
                <rect x="68" y="68" width="22" height="22" />
              </svg>
            </div>

            <p className="font-mono text-xs font-semibold text-slate-900">
              Code: {currentUser.referralCode}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Scanning this QR code automatically populates Sponsor ID {currentUser.id} in the
              Careermize registration form.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
