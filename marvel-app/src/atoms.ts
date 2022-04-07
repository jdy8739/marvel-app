import { atom } from "recoil";

export const startWithAtom = atom<string>({
    key: 'startWithAtom',
    default: ''
});

export const comicsTitle = atom<string>({
    key: 'comicsTitle',
    default: ''
});

export const searchedFormerDate = atom<string>({
    key: 'searchedformerDate',
    default: ''
});

export const searchedLatterDate = atom<string>({
    key: 'searchedLatterDate',
    default: ''
});
