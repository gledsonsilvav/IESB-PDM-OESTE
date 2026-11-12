import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'pets';

export async function addPet(userId, petData) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...petData,
    userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserPets(userId) {
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

export async function getPetById(petId) {
  const docRef = doc(db, COLLECTION_NAME, petId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function updatePet(petId, updatedData) {
  const docRef = doc(db, COLLECTION_NAME, petId);
  await updateDoc(docRef, updatedData);
}

export async function deletePet(petId) {
  const docRef = doc(db, COLLECTION_NAME, petId);
  await deleteDoc(docRef);
}