import React, { useState, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  Printer,
  Award,
  Search,
  ArrowRight,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react';
import {
  CareermizePackage,
  CertificateRecord,
  CouponCode,
  DropServiceItem,
  OrderRecord,
  UserProfile,
} from '../data/careermizeData';

/* -------------------------------------------------------------------------- */
/* 0. UNIFIED SIGN-IN & AUTHENTICATION MODAL (Protects Private Manager Route) */
/* -------------------------------------------------------------------------- */
interface LoginModalProps {
  unauthorizedRouteAttempt?: string | null;
  onClose: () => void;
  onLoginSuccess: (payload: { token: string; user: UserProfile; isManager: boolean }) => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  unauthorizedRouteAttempt,
  onClose,
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState('kumarbarupalsandeep@gmail.com');
  const [password, setPassword] = useState('ClientPassword123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot & Reset Password States
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [resetOtpInput, setResetOtpInput] = useState('739204');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Authentication failed.');
        setLoading(false);
        return;
      }
      onLoginSuccess(data);
    } catch {
      setErrorMsg('Unable to reach authentication server.');
      setLoading(false);
    }
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not send reset code.');
        return;
      }
      setResetOtpInput(data.demoResetOtp || '739204');
      setSuccessMsg(data.message);
      setMode('reset');
    } catch {
      setLoading(false);
      setErrorMsg('Network error requesting password reset.');
    }
  };

  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otpCode: resetOtpInput.trim(),
          newPassword: newPasswordInput,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setErrorMsg(data.error || 'Reset failed.');
        return;
      }
      setPassword(newPasswordInput);
      setSuccessMsg(data.message || 'Password updated! Sign in now.');
      setMode('login');
    } catch {
      setLoading(false);
      setErrorMsg('Network error resetting password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-medium text-sky-700">
              Careermize Encrypted Session Login · PBKDF2-SHA256
            </p>
            <h2 className="mt-0.5 font-display text-xl font-semibold text-slate-900">
              Sign In to Your Account
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {unauthorizedRouteAttempt && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <div>
              <p className="font-semibold">403 Direct URL Access Blocked</p>
              <p className="mt-0.5 text-rose-800">
                Direct navigation to <code className="font-mono">{unauthorizedRouteAttempt}</code>{' '}
                was blocked. Only authenticated Managers can access private management routes.
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-900">
            {successMsg}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setMode('forgot');
                  }}
                  className="text-[11px] font-semibold text-sky-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
              />
            </div>

            {/* Quick Role Credential Selector for End-to-End Verification */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
              <p className="font-medium text-slate-700">Quick-Fill Verified Credentials:</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('kumarbarupalsandeep@gmail.com');
                    setPassword('ClientPassword123');
                  }}
                  className="rounded border border-slate-300 bg-white px-2.5 py-1.5 text-left text-[11px] font-medium text-slate-800 hover:bg-slate-100"
                >
                  <span className="block font-semibold text-slate-900">Client / Student</span>
                  <span className="font-mono text-[10px] text-slate-500">Sandeep K.</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('instructor@careermize.in');
                    setPassword('InstructorPass#2026');
                  }}
                  className="rounded border border-slate-300 bg-white px-2.5 py-1.5 text-left text-[11px] font-medium text-slate-800 hover:bg-slate-100"
                >
                  <span className="block font-semibold text-emerald-800">Lead Instructor</span>
                  <span className="font-mono text-[10px] text-slate-500">CA Nidhi S.</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail('manager@careermize.in');
                    setPassword('ManagerPassword#2026');
                  }}
                  className="rounded border border-slate-300 bg-white px-2.5 py-1.5 text-left text-[11px] font-medium text-slate-800 hover:bg-slate-100"
                >
                  <span className="block font-semibold text-sky-800">Private Manager</span>
                  <span className="font-mono text-[10px] text-slate-500">Vikramaditya R.</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? 'Verifying PBKDF2 Session...' : 'Sign In & Authenticate'}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleRequestPasswordReset} className="mt-5 space-y-4">
            <p className="text-xs text-slate-600">
              Enter your registered Careermize email address to receive a 6-digit password recovery
              OTP via Email & SMS.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Registered Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700"
              >
                ← Back to Sign In
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#0284C7] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0369A1]"
              >
                {loading ? 'Dispatching OTP...' : 'Send Recovery OTP'}
              </button>
            </div>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleConfirmPasswordReset} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                6-Digit Recovery OTP Code *
              </label>
              <input
                type="text"
                required
                value={resetOtpInput}
                onChange={(e) => setResetOtpInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-center font-mono text-sm font-semibold tracking-widest text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Enter New Password (Min 6 chars) *
              </label>
              <input
                type="password"
                required
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Enter new strong password"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                {loading ? 'Updating Password...' : 'Verify OTP & Reset Password'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 border-t border-slate-200 pt-4 text-center text-xs text-slate-600">
          <span>New to Careermize? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-sky-700 hover:underline"
          >
            Create Account with Refer Code
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 1. DONE-FOR-YOU DROPSERVICING ORDER & BRIEF MODAL                          */
/* -------------------------------------------------------------------------- */
interface ServiceOrderModalProps {
  service: DropServiceItem;
  currentUser: UserProfile;
  onClose: () => void;
  onCompleteServiceOrder: (payload: {
    service: DropServiceItem;
    targetUrlOrBrand: string;
    projectBrief: string;
    gateway: OrderRecord['gateway'];
    transactionId?: string;
  }) => void;
}

export const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({
  service,
  currentUser,
  onClose,
  onCompleteServiceOrder,
}) => {
  const [targetUrlOrBrand, setTargetUrlOrBrand] = useState('https://mybrand.in');
  const [projectBrief, setProjectBrief] = useState('');
  const [gateway, setGateway] = useState<OrderRecord['gateway']>('Razorpay');
  const [stage, setStage] = useState<'Brief' | 'Processing' | 'Confirmed'>('Brief');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const taxableValue = Math.round(service.clientPrice / 1.18);
  const gstAmount = service.clientPrice - taxableValue;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectBrief.trim()) return;
    setErrorMsg(null);
    setStage('Processing');

    try {
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: service.id,
          price: service.clientPrice,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setErrorMsg(orderData.error || 'Could not initialize service order payment.');
        setStage('Brief');
        return;
      }

      const webhookRes = await fetch('/api/payments/verify-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gatewayOrderId: orderData.gatewayOrderId,
          gatewayPaymentId: orderData.gatewayPaymentId,
          signature: orderData.validSignature,
          status: 'Success',
        }),
      });
      const webhookData = await webhookRes.json();
      if (!webhookRes.ok) {
        setErrorMsg(webhookData.error || 'Gateway webhook verification failed.');
        setStage('Brief');
        return;
      }

      setStage('Confirmed');
      setTimeout(() => {
        onCompleteServiceOrder({
          service,
          targetUrlOrBrand: targetUrlOrBrand.trim() || 'https://mybrand.in',
          projectBrief: projectBrief.trim(),
          gateway,
          transactionId: orderData.gatewayPaymentId,
        });
      }, 400);
    } catch {
      setErrorMsg('Network error during payment gateway verification.');
      setStage('Brief');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-medium text-sky-700">
              Turnkey Service Order & Brief Submission · SLA {service.turnaroundDays} Days
            </p>
            <h2 className="mt-0.5 font-display text-xl font-semibold text-slate-900">
              {service.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Target Website URL, App Link, or Social Handle *
            </label>
            <input
              type="text"
              required
              value={targetUrlOrBrand}
              onChange={(e) => setTargetUrlOrBrand(e.target.value)}
              placeholder="e.g., https://yourcompany.in or @brandhandle"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Project Requirements & Execution Brief *
            </label>
            <textarea
              rows={3}
              required
              value={projectBrief}
              onChange={(e) => setProjectBrief(e.target.value)}
              placeholder="Describe your target audience, goals, brand guidelines, or specific deliverables needed..."
              className="mt-1 w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Select Payment Gateway
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(['Razorpay', 'PhonePe PG', 'Cashfree', 'PayU'] as const).map((gw) => (
                <button
                  key={gw}
                  type="button"
                  onClick={() => setGateway(gw)}
                  className={`rounded-lg border py-2 px-3 text-xs font-semibold transition-colors ${
                    gateway === gw
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {gw}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs space-y-1.5 tabular-nums">
            <div className="flex justify-between text-slate-600">
              <span>Client Account:</span>
              <span>
                {currentUser.name} ({currentUser.id})
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxable Service Fee:</span>
              <span>₹{taxableValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>18% GST (SAC 998314):</span>
              <span>+₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-semibold text-slate-900">
              <span>Total Payable ({gateway}):</span>
              <span>₹{service.clientPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={stage !== 'Brief'}
            className="w-full rounded-lg bg-[#0284C7] py-3 text-sm font-semibold text-white hover:bg-[#0369A1] disabled:opacity-60"
          >
            {stage === 'Brief' &&
              `Pay ₹${service.clientPrice.toLocaleString('en-IN')} & Launch Project`}
            {stage === 'Processing' && `Verifying ${gateway} HMAC-SHA256 Webhook...`}
            {stage === 'Confirmed' && `Order Confirmed ✓ Opening Client Service Tracker...`}
          </button>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. INDIA-FOCUSED BUNDLE CHECKOUT MODAL (Real Backend Webhook & Edge Tests) */
/* -------------------------------------------------------------------------- */
interface CheckoutModalProps {
  pkg: CareermizePackage;
  isUpgrade: boolean;
  currentActivePackage?: CareermizePackage;
  currentUser: UserProfile;
  coupons: CouponCode[];
  onClose: () => void;
  onCompleteOrder: (orderData: {
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
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  pkg,
  isUpgrade,
  currentActivePackage,
  currentUser,
  coupons,
  onClose,
  onCompleteOrder,
}) => {
  const [couponInput, setCouponInput] = useState('CAREER20');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [gateway, setGateway] = useState<OrderRecord['gateway']>('Razorpay');
  const [paymentMethod, setPaymentMethod] =
    useState<OrderRecord['paymentMethod']>('UPI QR / Intent');
  const [referralCode, setReferralCode] = useState(currentUser.referredByCode || 'SANDEEP90');
  const [paymentStage, setPaymentStage] = useState<
    'Created' | 'Processing' | 'Failed' | 'Success'
  >('Created');
  const [paymentErrorBanner, setPaymentErrorBanner] = useState<string | null>(null);
  const [lastOrderCredentials, setLastOrderCredentials] = useState<{
    gatewayOrderId: string;
    gatewayPaymentId: string;
    validSignature: string;
  } | null>(null);

  const grossOfferAmount = useMemo(() => {
    if (isUpgrade && currentActivePackage && pkg.price > currentActivePackage.price) {
      return pkg.price - currentActivePackage.price;
    }
    return pkg.price;
  }, [pkg, isUpgrade, currentActivePackage]);

  const pricing = useMemo(() => {
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'Percentage') {
        discount = Math.min(
          Math.round((grossOfferAmount * appliedCoupon.value) / 100),
          appliedCoupon.maxDiscount
        );
      } else {
        discount = appliedCoupon.value;
      }
    }
    const finalPayable = Math.max(499, grossOfferAmount - discount);
    const taxableAmount = Math.round(finalPayable / 1.18);
    const gstAmount = finalPayable - taxableAmount;

    return {
      grossOfferAmount,
      discount,
      taxableAmount,
      gstAmount,
      finalPayable,
    };
  }, [grossOfferAmount, appliedCoupon]);

  const handleApplyCoupon = () => {
    setCouponError(null);
    const found = coupons.find(
      (c) => c.code.toUpperCase() === couponInput.trim().toUpperCase()
    );
    if (!found) {
      setCouponError(`Coupon code "${couponInput.trim()}" does not exist.`);
      setAppliedCoupon(null);
      return;
    }
    if (!found.isActive) {
      setCouponError(`Coupon code "${found.code}" is disabled or expired.`);
      setAppliedCoupon(null);
      return;
    }
    if (found.usageCount >= found.usageLimit) {
      setCouponError(`Coupon code "${found.code}" has reached its usage limit.`);
      setAppliedCoupon(null);
      return;
    }
    if (grossOfferAmount < found.minOrderAmount) {
      setCouponError(`Minimum order of ₹${found.minOrderAmount} required for ${found.code}.`);
      setAppliedCoupon(null);
      return;
    }
    if (found.applicablePackageId !== 'ALL' && found.applicablePackageId !== pkg.id) {
      setCouponError(`Coupon ${found.code} is only valid for package ${found.applicablePackageId}.`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(found);
  };

  const executePaymentWebhookFlow = async (options?: {
    simulateFailure?: boolean;
    simulateTamperedSignature?: boolean;
    replayDuplicatePaymentId?: string;
  }) => {
    setPaymentErrorBanner(null);
    setPaymentStage('Processing');

    try {
      let creds = lastOrderCredentials;
      if (!creds || (!options?.replayDuplicatePaymentId && paymentStage !== 'Failed')) {
        const createRes = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            packageId: pkg.id,
            price: pricing.grossOfferAmount,
            couponCode: appliedCoupon?.code,
            couponsList: coupons,
          }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) {
          setPaymentStage('Failed');
          setPaymentErrorBanner(createData.error || 'Order creation failed.');
          return;
        }
        creds = {
          gatewayOrderId: createData.gatewayOrderId,
          gatewayPaymentId: createData.gatewayPaymentId,
          validSignature: createData.validSignature,
        };
        setLastOrderCredentials(creds);
      }

      const verifyRes = await fetch('/api/payments/verify-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gatewayOrderId: creds.gatewayOrderId,
          gatewayPaymentId: options?.replayDuplicatePaymentId || creds.gatewayPaymentId,
          signature: creds.validSignature,
          status: options?.simulateFailure ? 'Failed' : 'Success',
          simulateFailure: Boolean(options?.simulateFailure),
          simulateTamperedSignature: Boolean(options?.simulateTamperedSignature),
        }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setPaymentStage('Failed');
        setPaymentErrorBanner(verifyData.error || 'Payment verification failed.');
        return;
      }

      setPaymentStage('Success');
      setTimeout(() => {
        onCompleteOrder({
          pkg,
          baseAmount: pricing.grossOfferAmount,
          discountAmount: pricing.discount,
          taxableAmount: pricing.taxableAmount,
          gstAmount: pricing.gstAmount,
          finalAmount: pricing.finalPayable,
          couponCode: appliedCoupon?.code,
          gateway,
          paymentMethod,
          referralCodeUsed: referralCode,
          transactionId: creds?.gatewayPaymentId,
        });
      }, 500);
    } catch {
      setPaymentStage('Failed');
      setPaymentErrorBanner('Gateway connection interrupted. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-medium text-sky-700">
              Secure 256-Bit Encrypted India Checkout · HMAC-SHA256 Webhook
            </p>
            <h2 className="mt-0.5 font-display text-xl font-semibold text-slate-900">
              {isUpgrade ? `Upgrade to ${pkg.name}` : `Enroll in ${pkg.name}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs">
            <span className="font-semibold text-slate-900">1. Order Created</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            <span
              className={
                paymentStage === 'Processing' || paymentStage === 'Success'
                  ? 'font-semibold text-sky-700'
                  : paymentStage === 'Failed'
                  ? 'font-semibold text-rose-600'
                  : 'text-slate-400'
              }
            >
              2. Webhook Verification
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            <span
              className={
                paymentStage === 'Success'
                  ? 'font-semibold text-emerald-700'
                  : 'text-slate-400'
              }
            >
              3. Instant Bundle Unlock
            </span>
          </div>

          {paymentErrorBanner && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-900">
              <div>
                <p className="font-semibold">Payment Reconciliation Alert</p>
                <p className="mt-0.5 text-rose-800">{paymentErrorBanner}</p>
              </div>
              <button
                type="button"
                onClick={() => executePaymentWebhookFlow()}
                className="inline-flex shrink-0 items-center gap-1 rounded bg-rose-700 px-2.5 py-1.5 font-semibold text-white hover:bg-rose-800"
              >
                <RefreshCcw className="h-3 w-3" />
                <span>Retry Now</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Promo Coupon (CAREER20 / WELCOME500)
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-xs uppercase text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="mt-1 text-[11px] text-rose-600">{couponError}</p>}
              {appliedCoupon && (
                <p className="mt-1 text-[11px] font-medium text-emerald-700">
                  ✓ Coupon {appliedCoupon.code} applied (-₹{pricing.discount})
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Sponsor Referral Code
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Select Payment Gateway
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(['Razorpay', 'PhonePe PG', 'Cashfree', 'PayU'] as const).map((gw) => (
                <button
                  key={gw}
                  type="button"
                  onClick={() => setGateway(gw)}
                  className={`rounded-lg border py-2 px-3 text-xs font-semibold transition-colors ${
                    gateway === gw
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {gw}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">
              Select Payment Method
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {(
                [
                  'UPI QR / Intent',
                  'HDFC NetBanking',
                  'RuPay / Visa Card',
                  'EMI Wallet',
                ] as const
              ).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`rounded-lg border py-2 px-3 text-xs font-medium transition-colors ${
                    paymentMethod === pm
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs space-y-1.5 tabular-nums">
            <div className="flex justify-between text-slate-600">
              <span>
                {pkg.name} ({pkg.courseCount} Courses)
                {isUpgrade ? ' [Upgrade Differential]' : ''}:
              </span>
              <span>₹{pricing.grossOfferAmount.toLocaleString('en-IN')}</span>
            </div>
            {pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon Discount ({appliedCoupon?.code}):</span>
                <span>-₹{pricing.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Taxable Value (Excl. GST):</span>
              <span>₹{pricing.taxableAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>18% GST (9% CGST + 9% SGST):</span>
              <span>+₹{pricing.gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-semibold text-slate-900">
              <span>Final Payable via {gateway}:</span>
              <span>₹{pricing.finalPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Negative & Edge-Case Payment Verification Triggers */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs">
            <p className="font-medium text-slate-700">
              Gateway Edge-Case & Security Verification Suite:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => executePaymentWebhookFlow({ simulateFailure: true })}
                className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
              >
                Test Bank/UPI Decline (402)
              </button>
              <button
                type="button"
                onClick={() =>
                  executePaymentWebhookFlow({
                    replayDuplicatePaymentId: 'pay_Rzp9948120041',
                  })
                }
                className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
              >
                Test Duplicate Txn Replay (409)
              </button>
              <button
                type="button"
                onClick={() => executePaymentWebhookFlow({ simulateTamperedSignature: true })}
                className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
              >
                Test Tampered HMAC Webhook (400)
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={paymentStage === 'Processing' || paymentStage === 'Success'}
            onClick={() => executePaymentWebhookFlow()}
            className="w-full rounded-lg bg-[#0284C7] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0369A1] disabled:opacity-60"
          >
            {(paymentStage === 'Created' || paymentStage === 'Failed') &&
              `Pay ₹${pricing.finalPayable.toLocaleString('en-IN')} via ${gateway}`}
            {paymentStage === 'Processing' &&
              `Verifying ${gateway} HMAC-SHA256 Webhook Signature...`}
            {paymentStage === 'Success' &&
              `Payment Confirmed ✓ Unlocking ${pkg.courseCount} Courses...`}
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. CAREERMIZE REGISTRATION & MOBILE OTP VERIFICATION MODAL                 */
/* -------------------------------------------------------------------------- */
interface RegisterModalProps {
  initialRefCode?: string;
  packages: CareermizePackage[];
  onClose: () => void;
  onCompleteRegistration: (payload: {
    token: string;
    user: UserProfile;
    selectedPkgId: string;
  }) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  initialRefCode = 'SANDEEP90',
  packages,
  onClose,
  onCompleteRegistration,
}) => {
  const [referCode, setReferCode] = useState(initialRefCode);
  const [referralName, setReferralName] = useState(
    initialRefCode === 'SANDEEP90' ? 'Sandeep Kumar Barupal' : 'Vikramaditya Rathore'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98290 ');
  const [state, setState] = useState('Rajasthan');
  const [city, setCity] = useState('Jaipur');
  const [password, setPassword] = useState('');
  const [selectedPkgId, setSelectedPkgId] = useState('pkg-pro');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('482910');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLookupRefCode = (val: string) => {
    const code = val.toUpperCase();
    setReferCode(code);
    if (code === 'SANDEEP90') setReferralName('Sandeep Kumar Barupal (Verified Partner)');
    else if (code === 'AARAVPRO') setReferralName('Aarav Sharma (Verified Partner)');
    else if (code === 'CM-VIKRAM01') setReferralName('Vikramaditya Rathore (Faculty)');
    else setReferralName('Careermize Direct Partner');
  };

  const handleRequestOtp = async (simulateExpired = false) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          simulateExpired,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to dispatch OTP.');
        return;
      }
      setOtpCode(data.demoOtpCode || '482910');
      setOtpStep(true);
    } catch {
      setLoading(false);
      setErrorMsg('Unable to reach OTP dispatch server.');
    }
  };

  const handleVerifyAndRegister = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          state,
          city: city.trim(),
          password,
          referredByCode: referCode,
          referredByName: referralName,
          selectedPkgId,
          otpCode: otpCode.trim(),
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setErrorMsg(data.error || 'OTP Verification failed.');
        return;
      }
      onCompleteRegistration({
        token: data.token,
        user: data.user,
        selectedPkgId,
      });
    } catch {
      setLoading(false);
      setErrorMsg('Registration request failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-medium text-sky-700">
              Careermize Official Client & Partner Registration
            </p>
            <h2 className="mt-0.5 font-display text-xl font-semibold text-slate-900">
              {otpStep ? 'Verify 6-Digit Mobile OTP' : 'Create Your Careermize Account'}
            </h2>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800">
            {errorMsg}
          </div>
        )}

        {!otpStep ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRequestOtp(false);
            }}
            className="mt-5 space-y-4"
          >
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-sky-200 bg-sky-50/60 p-3.5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-800">
                  User ID / Refer Code *
                </label>
                <input
                  type="text"
                  required
                  value={referCode}
                  onChange={(e) => handleLookupRefCode(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-sky-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800">
                  Referral Name (Auto-Verified)
                </label>
                <input
                  type="text"
                  readOnly
                  value={referralName}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">State *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                >
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Select Starting Skill Bundle
              </label>
              <select
                value={selectedPkgId}
                onChange={(e) => setSelectedPkgId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.courseCount} Courses)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0284C7] py-2.5 text-xs font-semibold text-white hover:bg-[#0369A1] disabled:opacity-50"
            >
              {loading ? 'Dispatching SMS OTP...' : 'Send 6-Digit Mobile OTP & Continue'}
            </button>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900">
              <p className="font-semibold">
                SMS & WhatsApp OTP dispatched to {phone} (Code: 482910)
              </p>
              <p className="mt-1">
                Sponsor attribution locked to <strong>{referralName}</strong> ({referCode}).
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Enter 6-Digit Verification OTP
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center font-mono text-lg font-semibold tracking-widest text-slate-900"
              />
            </div>

            {/* Edge-Case OTP Testing Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-[11px]">
              <span className="font-medium text-slate-600">Edge-Case OTP Tests:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpCode('000000')}
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-700 hover:bg-slate-100"
                >
                  Test Wrong OTP (400)
                </button>
                <button
                  type="button"
                  onClick={() => handleRequestOtp(true)}
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-700 hover:bg-slate-100"
                >
                  Simulate Expired OTP (410)
                </button>
                <button
                  type="button"
                  onClick={() => handleRequestOtp(false)}
                  className="rounded border border-sky-300 bg-sky-50 px-2 py-1 font-semibold text-sky-800"
                >
                  Resend Fresh OTP
                </button>
              </div>
            </div>

            <button
              onClick={handleVerifyAndRegister}
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP & Activate Careermize Account'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. PRINTABLE GST TAX INVOICE MODAL                                         */
/* -------------------------------------------------------------------------- */
export const InvoiceModal: React.FC<{
  order: OrderRecord;
  onClose: () => void;
}> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Careermize</h2>
            <p className="mt-1 text-xs text-slate-500">
              Careermize EdTech Pvt. Ltd. · GSTIN: 29AABCC8841K1Z5
            </p>
            <p className="text-xs text-slate-500">
              HSR Layout Sector 2, Bengaluru, Karnataka — 560102
            </p>
          </div>
          <div className="text-right font-mono text-xs">
            <p className="text-sm font-bold text-slate-900">TAX INVOICE</p>
            <p className="mt-1 text-slate-600">Invoice: {order.invoiceNumber}</p>
            <p className="text-slate-500">Order ID: {order.id}</p>
            <p className="text-slate-500">Date: {order.createdAt}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold text-slate-700">Billed To Client / Student:</p>
            <p className="mt-1 font-semibold text-slate-900">{order.userName}</p>
            <p className="text-slate-600">{order.userEmail}</p>
            <p className="text-slate-600">Place of Supply: {order.userState}</p>
          </div>
          <div className="text-right font-mono">
            <p className="font-sans font-semibold text-slate-700">Payment Settlement:</p>
            <p className="mt-1 text-slate-800">Gateway: {order.gateway}</p>
            <p className="text-slate-600">Method: {order.paymentMethod}</p>
            <p className="text-slate-600">Txn Ref: {order.transactionId}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                <th className="py-2.5 px-4">Description & SAC</th>
                <th className="py-2.5 px-4 text-right">Taxable Value</th>
                <th className="py-2.5 px-4 text-right">GST (18%)</th>
                <th className="py-2.5 px-4 text-right">Total (INR)</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              <tr>
                <td className="py-3.5 px-4 font-sans">
                  <p className="font-semibold text-slate-900">{order.packageName}</p>
                  <p className="text-[11px] text-slate-500">
                    SAC: 999293 (Digital Services & Educational Bundles)
                  </p>
                </td>
                <td className="py-3.5 px-4 text-right text-slate-700">
                  ₹{order.taxableAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-700">
                  ₹{order.gstAmount.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                  ₹{order.finalAmount.toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="no-print mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save Invoice PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. CERTIFICATE DISPLAY & PUBLIC VERIFICATION PORTAL MODAL                  */
/* -------------------------------------------------------------------------- */
export const CertificateVerifyModal: React.FC<{
  certificates: CertificateRecord[];
  initialCertId?: string;
  onClose: () => void;
}> = ({ certificates, initialCertId = 'CERT-2026-884920', onClose }) => {
  const [lookupId, setLookupId] = useState(initialCertId);
  const matchedCert = useMemo(
    () =>
      certificates.find(
        (c) => c.id.toUpperCase() === lookupId.trim().toUpperCase()
      ) || null,
    [certificates, lookupId]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
        <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-medium text-sky-700">
              Public Credential Registry · careermize.in/certificate/{lookupId}
            </p>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Careermize Certificate Verification Portal
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter CERT-2026-..."
                className="rounded-lg border border-slate-300 py-1.5 pl-8 pr-3 font-mono text-xs text-slate-900"
              />
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="no-print mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Issued Credentials:</span>
          {certificates.map((c) => (
            <button
              key={c.id}
              onClick={() => setLookupId(c.id)}
              className={`rounded border px-2 py-0.5 font-mono text-[11px] ${
                lookupId === c.id
                  ? 'border-sky-600 bg-sky-50 font-semibold text-sky-900'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.id} ({c.studentName.split(' ')[0]})
            </button>
          ))}
        </div>

        {matchedCert ? (
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900">
              <span className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>
                  AUTHENTIC CREDENTIAL VERIFIED · Status: {matchedCert.status} · Assessment Score:{' '}
                  {matchedCert.quizScorePct}%
                </span>
              </span>
              <span className="font-mono">{matchedCert.id}</span>
            </div>

            <div className="rounded-xl border-4 border-double border-slate-900 bg-[#FCFBF7] p-8 sm:p-10 text-center">
              <p className="font-mono text-xs tracking-widest text-slate-500">
                CAREERMIZE SKILL ACADEMY · ISO 9001:2015 CERTIFIED
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold text-slate-900">
                Certificate of Mastery
              </h3>
              <p className="mt-3 text-xs text-slate-600">
                This is to certify that
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-sky-900 underline decoration-slate-300 underline-offset-8">
                {matchedCert.studentName}
              </p>
              <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-slate-600">
                has successfully completed all video modules, practical assignments, and final
                certification assessments for the course
              </p>
              <p className="mt-2 font-display text-lg font-semibold text-slate-900">
                “{matchedCert.courseTitle}”
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Included under <strong>{matchedCert.packageName}</strong> · Issued on{' '}
                {matchedCert.issueDate}
              </p>

              <div className="mt-8 grid grid-cols-3 items-end border-t border-slate-200 pt-6 text-xs">
                <div className="text-left">
                  <p className="font-display text-sm italic text-slate-800">
                    {matchedCert.instructorName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Course Lead Instructor</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-900 bg-slate-900 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-slate-500">
                    ID: {matchedCert.id}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-display text-sm italic text-slate-800">
                    Vikramaditya Rathore
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Director, Careermize India
                  </p>
                </div>
              </div>
            </div>

            <div className="no-print flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Download Certificate PDF</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-8 text-center text-xs text-rose-900">
            <p className="font-semibold">
              No valid certificate found matching ID "{lookupId}".
            </p>
            <p className="mt-1 text-rose-700">
              Verify the Certificate ID printed at the bottom of the credential (e.g.,
              CERT-2026-884920).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
