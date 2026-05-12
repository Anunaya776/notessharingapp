import { db } from "./firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function updateNote(uid: string, id: string, data: any) {
  return updateDoc(doc(db, `users/${uid}/notes/${id}`), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}