export interface SendMessage {
  text?: string;
  chatId: string;
  attachments?: File[] | null;
}
