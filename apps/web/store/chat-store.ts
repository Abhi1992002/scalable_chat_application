import { atom } from "recoil";

export interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  reciever: string;
  senderId: string;
  recieverId: string;
  createdAt: string;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface ChatState {
  [userId: string]: ChatMessage[];
}

export const chatsState = atom<ChatState>({
  key: "chatsState",
  default: {},
});
