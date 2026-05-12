"use client";

import { auth } from "./lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

import { createNote } from "./lib/createNote";
import { watchNotes } from "./lib/listNotes";
import { updateNote } from "./lib/updateNote";
import { deleteNote } from "./lib/deleteNote";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [notes, setNotes] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const deleteNoteHandler = async (id: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this note?")) return;
    await deleteNote(user.uid, id);
  };

  const shareNoteHandler = async (id: string) => {
    if (!user) return;
    const minutes = prompt("Share for how many minutes?");
    if (!minutes) return;
    const expiry = new Date(Date.now() + Number(minutes) * 60000);
    await updateNote(user.uid, id, {
      shared: true,
      shareExpiresAt: expiry,
    });
    
    const shareLink = `${window.location.origin}/share?u=${user.uid}&n=${id}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      alert("Link copied to clipboard! Anyone with this link can view the note.");
    }).catch(err => {
      console.error("Failed to copy link:", err);
      alert("Note shared! Link: " + shareLink);
    });
  };

  const updateNoteHandler = async (id: string, data: any) => {
    if (!user) return;
    await updateNote(user.uid, id, data);
  };

  useEffect(() => {
    if (!user) return;
    const unsub = watchNotes(user.uid, setNotes);
    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 font-medium">Loading workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans selection:bg-gray-300">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center text-white font-bold shadow-sm">
              N
            </div>
            <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Notes</h1>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500 hidden sm:block">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Notes</h2>
              <p className="text-gray-500 mb-8 text-sm">Sign in to organize your thoughts and ideas securely.</p>
              <button
                onClick={login}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-lg transition-all shadow-sm active:scale-[0.98]"
              >
                Continue with Google
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="relative w-full sm:max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search your notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    await createNote(user.uid);
                  } catch (error) {
                    console.error("Error creating note:", error);
                    alert("Failed to create note");
                  }
                }}
                className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2 px-5 rounded-lg transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                New Note
              </button>
            </div>

            {/* Notes Grid */}
            {notes.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium">No notes yet</p>
                <p className="text-sm mt-1">Create a new note to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes
                  .filter((n) =>
                    n.title?.toLowerCase().includes(search.toLowerCase()) ||
                    n.body?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((n) => (
                    <div
                      key={n.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-72"
                    >
                      <div className="p-4 flex-1 flex flex-col gap-3">
                        <input
                          value={n.title}
                          onChange={(e) =>
                            updateNoteHandler(n.id, { title: e.target.value })
                          }
                          placeholder="Untitled Note"
                          className={`w-full font-semibold text-lg bg-transparent border-none focus:outline-none focus:ring-0 transition-colors ${
                            n.title === 'Untitled' || !n.title
                              ? 'text-gray-400 hover:text-gray-600 focus:text-gray-800' 
                              : 'text-gray-800'
                          } placeholder:text-gray-400`}
                        />
                        <textarea
                          value={n.body}
                          onChange={(e) =>
                            updateNoteHandler(n.id, { body: e.target.value })
                          }
                          placeholder="Start typing..."
                          className="w-full flex-1 resize-none bg-transparent text-gray-600 text-sm border-none focus:outline-none focus:ring-0 placeholder:text-gray-300 leading-relaxed"
                        />
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between transition-opacity">
                        <span className="text-xs text-gray-400 font-medium">
                          {n.updatedAt ? new Date(n.updatedAt.toDate()).toLocaleDateString() : 'Just now'}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => shareNoteHandler(n.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Share Note"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteNoteHandler(n.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Note"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}