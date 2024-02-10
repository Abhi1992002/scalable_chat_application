import { atom, selector } from "recoil";

interface ChatMessage {
  message: string;
  sender: string;
}

interface ChatState {
  [userId: string]: ChatMessage[];
}

const chatsState = atom<ChatState>({
  key: "chatsState",
  default: {},
});

const chatSelectorState = selector({
  key: "chatSelectorState",
  get:
    ({ get }) =>
    (userId: string) => {
      const chats = get(chatsState);
      return chats[userId];
    },
});
