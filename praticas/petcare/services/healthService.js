import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'health_records';

export async function addHealthRecord(userId, recordData) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...recordData,
    userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserHealthRecords(userId) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

export async function deleteHealthRecord(recordId) {
  const docRef = doc(db, COLLECTION_NAME, recordId);
  await deleteDoc(docRef);
}