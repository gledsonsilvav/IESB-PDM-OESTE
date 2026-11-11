import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const PETS_COLLECTION = 'pets';

// Adicionar um novo pet associado ao utilizador
export const addPet = async (userId, petData) => {
  try {
    const docRef = await addDoc(collection(db, PETS_COLLECTION), {
      ...petData,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar pet:', error);
    throw error;
  }
};

// Procurar todos os pets do utilizador logado
export const getUserPets = async (userId) => {
  try {
    const q = query(
      collection(db, PETS_COLLECTION), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const pets = [];
    querySnapshot.forEach((doc) => {
      pets.push({ id: doc.id, ...doc.data() });
    });
    return pets;
  } catch (error) {
    console.error('Erro ao procurar pets:', error);
    throw error;
  }
};

// Eliminar um pet pelo ID
export const deletePet = async (petId) => {
  try {
    await deleteDoc(doc(db, PETS_COLLECTION, petId));
  } catch (error) {
    console.error('Erro ao eliminar pet:', error);
    throw error;
  }
};
