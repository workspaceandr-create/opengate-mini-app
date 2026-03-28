const API_BASE = 'https://n8n-eba.ru/webhook';

export const MODEL_DISPLAY: Record<string, string> = {
  model_deepseek: 'DeepSeek',
  model_claude: 'Claude',
  model_llama: 'Llama',
  model_flux_pro: 'Flux Pro',
  model_flux_schnell: 'Flux Schnell',
  model_riverflow_pro: 'Riverflow Pro',
  model_riverflow_fast: 'Riverflow Fast',
};

export const MODEL_ICON: Record<string, string> = {
  model_deepseek: '🧠',
  model_claude: '🎭',
  model_llama: '🦙',
  model_flux_pro: '🎨',
  model_flux_schnell: '⚡',
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

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
