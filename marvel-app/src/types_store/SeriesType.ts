export interface Url {
    type: string;
    url: string;
}

export interface Thumbnail {
    path: string;
    extension: string;
}

export interface Item {
    resourceURI: string;
    name: string;
    role: string;
}

export interface Creators {
    available: number;
    collectionURI: string;
    items: Item[];
    returned: number;
}

export interface Item2 {
    resourceURI: string;
    name: string;
}

export interface Characters {
    available: number;
    collectionURI: string;
    items: Item2[];
    returned: number;
}

export interface Item3 {
    resourceURI: string;
    name: string;
    type: string;
}

export interface Stories {
    available: number;
    collectionURI: string;
    items: Item3[];
    returned: number;
}

export interface Item4 {
    resourceURI: string;
    name: string;
}

export interface Comics {
    available: number;
    collectionURI: string;
    items: Item4[];
    returned: number;
}

export interface Item5 {
    resourceURI: string;
    name: string;
}

export interface Events {
    available: number;
    collectionURI: string;
    items: Item5[];
    returned: number;
}

export interface Next {
    resourceURI: string;
    name: string;
}

export interface Result {
    id: number;
    title: string;
    description: string;
    resourceURI: string;
    urls: Url[];
    startYear: number;
    endYear: number;
    rating: string;
    type: string;
    modified: any;
    thumbnail: Thumbnail;
    creators: Creators;
    characters: Characters;
    stories: Stories;
    comics: Comics;
    events: Events;
    next: Next;
    previous?: any;
}

export interface Data {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: Result[];
}

export interface ISeries {
    code: number;
    status: string;
    copyright: string;
    attributionText: string;
    attributionHTML: string;
    etag: string;
    data: Data;
}