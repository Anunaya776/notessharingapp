import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function createNote(uid: string) {
  return addDoc(collection(db, `users/${uid}/notes`), {
    title: "",
    body: "",
    tags: [],
    shared: false,
    shareExpiresAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
} 