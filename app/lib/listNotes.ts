import { db } from "./firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export function watchNotes(uid: string, cb: (docs: any[]) => void) {
  const q = query(
    collection(db, `users/${uid}/notes`),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}