"use client";

import { useEffect, useState, Suspense } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

function SharePageContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("u");
  const noteId = searchParams.get("n");

  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uid || !noteId) {
      setError("Invalid share link.");
      setLoading(false);
      return;
    }

    const fetchNote = async () => {
      try {
        const noteRef = doc(db, `users/${uid}/notes/${noteId}`);
        const snap = await getDoc(noteRef);

        if (!snap.exists()) {
          setError("Note not found.");
          setLoading(false);
          return;
        }

        const data = snap.data();

        // Check if shared
        if (!data.shared) {
          setError("This note is no longer shared.");
          setLoading(false);
          return;
        }

        // Check expiry
        if (data.shareExpiresAt) {
          const expiresAt = data.shareExpiresAt.toDate();
          if (new Date() > expiresAt) {
            setError("This share link has expired.");
            setLoading(false);
            return;
          }
        }

        setNote(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load note or permission denied.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [uid, noteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-medium">Loading note...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unavailable</h2>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans selection:bg-gray-300">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center text-white font-bold shadow-sm">
            N
          </div>
          <h1 className="text-lg font-medium text-gray-600">Shared Note</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {note.title || "Untitled Note"}
            </h1>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {note.body}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
            <span>Read-only mode</span>
            <span>
              Expires: {note.shareExpiresAt ? note.shareExpiresAt.toDate().toLocaleString() : 'Never'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-medium">Loading...</div>
      </div>
    }>
      <SharePageContent />
    </Suspense>
  );
}
