import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { mailApi } from '../lib/mailApi';
import { ThreadList } from '../components/mail/ThreadList';
import { ChatStream } from '../components/mail/ChatStream';
import { SendBar } from '../components/mail/SendBar';
import { NewChatModal } from '../components/mail/NewChatModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [copied, setCopied] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Poll conversation threads every 3 seconds
  const { data: threads = [], isLoading: threadsLoading } = useQuery({
    queryKey: ['mailThreads'],
    queryFn: () => (token ? mailApi.getThreads(token) : Promise.resolve([])),
    enabled: Boolean(token),
    refetchInterval: 3000,
  });

  // Automatically select first thread if none is selected
  useEffect(() => {
    if (!activeThreadId && threads.length > 0) {
      setActiveThreadId(threads[0].id);
    }
  }, [threads, activeThreadId]);

  // Poll active thread messages every 3 seconds
  const { data: activeThreadData, isLoading: messagesLoading } = useQuery({
    queryKey: ['threadMessages', activeThreadId],
    queryFn: () =>
      token && activeThreadId
        ? mailApi.getThreadMessages(activeThreadId, token)
        : Promise.resolve(null),
    enabled: Boolean(token && activeThreadId),
    refetchInterval: 3000,
  });

  // If loading session, show sleek skeleton loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Opening your PhoneMail inbox...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to landing page
  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/" replace />;
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = async (payload: { text: string; files: File[]; subject?: string }) => {
    if (!activeThreadData?.thread?.contact?.phone) return;
    setIsSending(true);

    try {
      await mailApi.sendMail(
        {
          to: activeThreadData.thread.contact.phone,
          subject: payload.subject || activeThreadData.thread.subject || 'Conversation',
          text: payload.text,
          files: payload.files,
        },
        token
      );

      // Invalidate queries for instant UI update
      await queryClient.invalidateQueries({ queryKey: ['threadMessages', activeThreadId] });
      await queryClient.invalidateQueries({ queryKey: ['mailThreads'] });
    } catch (err: any) {
      alert(err.message || 'Failed to send message via local SMTP server');
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const handleChatCreated = (newThreadId: string) => {
    setActiveThreadId(newThreadId);
    queryClient.invalidateQueries({ queryKey: ['mailThreads'] });
    queryClient.invalidateQueries({ queryKey: ['threadMessages', newThreadId] });
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                PhoneMail
              </span>
              <span className="text-[10px] text-indigo-400 font-medium -mt-1 hidden sm:inline-block">
                Spike Mail Conversational Webmail
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: My Phone Address Pill & Actions */}
        <div className="flex items-center space-x-3">
          {/* SMTP Local Server Indicator */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Local SMTP:</span>
            <span className="font-mono text-cyan-300 font-semibold">2525</span>
          </div>

          {/* Active Email Address Pill */}
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
            <div className="flex flex-col text-right">
              <span className="text-xs font-mono font-bold text-indigo-300">
                {user.email}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {user.phone}
              </span>
            </div>
            <button
              onClick={handleCopyEmail}
              title="Copy Email Address"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              {copied ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800/80 transition"
            title="Log Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Spike Mail Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Conversations List (WhatsApp Style) */}
        <ThreadList
          threads={threads}
          activeThreadId={activeThreadId}
          onSelectThread={(id) => setActiveThreadId(id)}
          onOpenNewChat={() => setNewChatModalOpen(true)}
          isLoading={threadsLoading}
        />

        {/* Right: Active Chat Stream & Send Bar */}
        <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {activeThreadData && activeThreadData.thread ? (
            <>
              {/* Message Stream */}
              <ChatStream
                thread={activeThreadData.thread}
                messages={activeThreadData.messages || []}
                isLoading={messagesLoading}
              />

              {/* Zero-Friction Send Bar */}
              <SendBar
                onSendMessage={handleSendMessage}
                isSending={isSending}
                defaultSubject={activeThreadData.thread.subject}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Welcome to PhoneMail Spike Mail
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Email simplified into conversational chat bubbles. Send and receive mail seamlessly using your phone number over our local SMTP server on port 2525.
                </p>
              </div>

              <button
                onClick={() => setNewChatModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Start New Mail Conversation</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Compose / New Chat Modal */}
      <NewChatModal
        isOpen={newChatModalOpen}
        token={token}
        onClose={() => setNewChatModalOpen(false)}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
};
