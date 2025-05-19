export interface SendMessage {
  text?: string;
  chatId: string;
  date?: Date;
  attachments?: File[] | null;
}
