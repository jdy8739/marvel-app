import { atom } from "recoil";

export const charStartsWithAtom = atom<string>({
    key: 'charStartsWithAtom',
    default: ''
});

export const charPageAtom = atom<number>({
    key: 'charPageAtom',
    default: 1
});

export const comicsSearchedTitleAtom = atom<string>({
    key: 'comicsTitle',
    default: ''
});

export const comicsSearchedDateAtom = atom<string[]>({
    key: 'comicsSearchedDate',
    default: []
});

export const comicsPageAtom = atom<number>({
    key: 'comicsPageAtom',
    default: 1
});

export const seriesSearchedTitleAtom = atom<string>({
    key: 'seriesSearchedTitleAtom',
    default: ''
});

export const seriesPageAtom = atom<number>({
    key: 'seriesPageAtom',
    default: 1
});