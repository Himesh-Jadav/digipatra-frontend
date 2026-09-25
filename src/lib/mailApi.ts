export interface MailContact {
  id: string;
  phone: string;
  email: string;
  displayName: string;
  profilePictureUrl?: string | null;
}

export interface MailAttachment {
  id: string;
  filename: string;
  gridFsId: string;
  contentType: string;
  size: number;
}

export interface MailMessage {
  id: string;
  threadId: string;
  from: {
    id: string;
    phone: string;
    displayName: string;
    email: string;
  };
  fromEmail: string;
  toEmails: string[];
  subject: string;
  text: string;
  html?: string;
  attachments: MailAttachment[];
  isMine: boolean;
  read: boolean;
  createdAt: string;
}

export interface MailThread {
  id: string;
  subject: string;
  lastMessage?: {
    text: string;
    from: string;
    createdAt: string;
    hasAttachments?: boolean;
  };
  lastMessageAt: string;
  unreadCount: number;
  contact: MailContact | null;
}

export interface RecipientVerifyResult {
  exists: boolean;
  user?: MailContact;
  error?: string;
}

const API_BASE = '/api/mail';

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const mailApi = {
  async getThreads(token: string): Promise<MailThread[]> {
    const res = await fetch(`${API_BASE}/threads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse<{ threads: MailThread[] }>(res);
    return data.threads || [];
  },

  async getThreadMessages(
    threadId: string,
    token: string
  ): Promise<{ thread: MailThread; messages: MailMessage[] }> {
    const res = await fetch(`${API_BASE}/threads/${threadId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse<{ thread: MailThread; messages: MailMessage[] }>(res);
  },

  async sendMail(
    payload: {
      to: string;
      subject?: string;
      text: string;
      files?: File[];
    },
    token: string
  ): Promise<{ success: boolean; threadId: string; messageId: string }> {
    const formData = new FormData();
    formData.append('to', payload.to);
    if (payload.subject) formData.append('subject', payload.subject);
    formData.append('text', payload.text || '');

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const res = await fetch(`${API_BASE}/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return handleResponse<{ success: boolean; threadId: string; messageId: string }>(res);
  },

  async verifyRecipient(query: string, token: string): Promise<RecipientVerifyResult> {
    const res = await fetch(`${API_BASE}/verify-recipient?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse<RecipientVerifyResult>(res);
  },

  getAttachmentUrl(gridFsId: string): string {
    return `${API_BASE}/attachments/${gridFsId}`;
  },
};
