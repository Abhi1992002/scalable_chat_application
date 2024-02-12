import { atom } from "recoil";

export const onlineState = atom({
  key: "onlineState",
  default: {} as Record<string, boolean>,
});
