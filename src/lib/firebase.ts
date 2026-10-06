import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot per firebase-integration-rpc skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export async function signInWithGooglePopup() {
  const credential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;
  const idToken = await user.getIdToken();

  // Sync user document to Firestore with defensive payload bounds
  const cleanName = (user.displayName || user.email?.split('@')[0] || 'Careermize User').slice(
    0,
    120
  );
  const cleanUid = user.uid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  const path = `users/${cleanUid}`;

  try {
    await setDoc(
      doc(db, 'users', cleanUid),
      {
        uid: cleanUid,
        userId: `CM${cleanUid.slice(0, 6).toUpperCase()}`,
        name: cleanName,
        role: 'Student',
        referralCode: `${cleanName.split(' ')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'USER'}99`,
        activePackageId: 'pkg-pro',
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    // Rules may block overwrite of existing user doc if createdAt differs; non-fatal for popup sign-in
  }

  return {
    uid: user.uid,
    email: user.email || '',
    displayName: cleanName,
    photoURL: user.photoURL || '',
    idToken,
  };
}

export async function signOutFirebase() {
  try {
    await signOut(auth);
  } catch {
    // ignore
  }
}
