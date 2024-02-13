import { atom } from "recoil";
interface Friend {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  profileImage: string | null;
}

interface Message {
  id: string;
  text: string;
  createdAt: Date;
  sender: string;
  senderId: string;
  reciever: string;
  recieverId: string | null;
}

interface listType {
  friend: Friend | null;
  latestMessage: Message | null | undefined;
}

export const friendState = atom<listType[]>({
  key: "friendState",
  default: [],
});
