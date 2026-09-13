import { atom } from "jotai";
import { getAccessToken } from "@/lib/auth-storage";

export const isAuthenticatedAtom = atom<boolean>(!!getAccessToken());
