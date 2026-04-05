const API_BASE = 'https://n8n-eba.ru/webhook';

export const MODEL_DISPLAY: Record<string, string> = {
  // Текущие ключи бота
  chat_deepseek: 'DeepSeek V3',
  chat_gpt: 'GPT-4o mini',
  chat_llama: 'Llama 3.3 70B',
  // Устаревшие ключи (старые диалоги в БД)
  model_deepseek: 'DeepSeek V3',
  model_claude: 'GPT-4o mini',
  model_llama: 'Llama 3.3 70B',
  // Модели изображений
  model_flux_pro: 'Flux Pro',
  model_flux_schnell: 'Flux Schnell',
  model_riverflow_pro: 'Riverflow Pro',
  model_riverflow_fast: 'Riverflow Fast',
};

export const MODEL_ICON: Record<string, string> = {
  chat_deepseek: '🧠',
  chat_gpt: '⚡',
  chat_llama: '🦙',
  model_deepseek: '🧠',
  model_claude: '⚡',
  model_llama: '🦙',
  model_flux_pro: '🎨',
  model_flux_schnell: '🎨',
  model_riverflow_pro: '🌊',
  model_riverflow_fast: '🌊',
};

export interface ProfileData {
  chat_id: string;
  username: string;
  full_name: string;
  current_model: string;
  plan: string;
  total_requests: number;
  tokens_used_month: number;
  active_dialogs: number;
  active_dialog_title: string | null;
  last_model_key: string | null;
}

export interface ChatData {
  conversation_id: string;
  title: string;
  model_key: string;
  status: string;
  message_count: number;
  updated_at: string;
  last_message: string | null;
}

export async function fetchProfile(chatId: number): Promise<ProfileData> {
  const res = await fetch(`${API_BASE}/miniapp/profile?chat_id=${chatId}`);
  if (!res.ok) throw new Error('fetch profile failed');
  return res.json();
}

export async function fetchChats(chatId: number): Promise<ChatData[]> {
  const res = await fetch(`${API_BASE}/miniapp/chats?chat_id=${chatId}`);
  if (!res.ok) throw new Error('fetch chats failed');
  return res.json();
}

export async function switchDialog(chatId: number, conversationId: string): Promise<void> {
  await fetch(`${API_BASE}/miniapp/switch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, conversation_id: conversationId }),
  });
}

export async function newDialog(chatId: number): Promise<ChatData> {
  const res = await fetch(`${API_BASE}/miniapp/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId }),
  });
  if (!res.ok) throw new Error('new dialog failed');
  return res.json();
}

export async function renameDialog(chatId: number, conversationId: string, title: string): Promise<void> {
  await fetch(`${API_BASE}/miniapp/rename`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, conversation_id: conversationId, title }),
  });
}

export async function deleteDialog(chatId: number, conversationId: string): Promise<void> {
  await fetch(`${API_BASE}/miniapp/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, conversation_id: conversationId }),
  });
}

export interface HistoryItem {
  action: string;
  model: string;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
  created_at: string;
}

export async function fetchHistory(chatId: number): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/miniapp/history?chat_id=${chatId}`);
  if (!res.ok) throw new Error('fetch history failed');
  return res.json();
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
