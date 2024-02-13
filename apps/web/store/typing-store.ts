import { atom } from "recoil";

export const typingState = atom({
  key: "typingState",
  default: {} as Record<string, boolean>,
});
