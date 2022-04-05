import { atom } from "recoil";

export const startWithAtom = atom<string>({
    key: 'startWithAtom',
    default: ''
});