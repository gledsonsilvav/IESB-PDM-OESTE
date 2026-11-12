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

const COLLECTION_NAME = 'locations';

export async function addLocation(userId, locationData) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...locationData,
    userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserLocations(userId) {
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

export async function deleteLocation(locationId) {
  const docRef = doc(db, COLLECTION_NAME, locationId);
  await deleteDoc(docRef);
}