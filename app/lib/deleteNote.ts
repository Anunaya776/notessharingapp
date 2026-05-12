import { db } from "./firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function deleteNote(uid: string, id: string) {
  return deleteDoc(doc(db, `users/${uid}/notes/${id}`));
}