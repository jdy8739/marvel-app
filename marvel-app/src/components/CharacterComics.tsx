import axios from "axios";
import { useEffect } from "react";
import { useMatch } from "react-router-dom";
import { apikey, BASE_URL, GET_COMICS_CONTAINING_CHAR, hash } from "../api";


function CharacterComics() {

    const comicsMatch = useMatch('/characters/detail/:id/comics');

    const fetchComicsContainingCharacter = () => {
        axios.get(`${BASE_URL}${GET_COMICS_CONTAINING_CHAR}/${comicsMatch?.params.id}/comics?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                console.log(res.data);
            });
    };

    useEffect(() => {
        fetchComicsContainingCharacter();
    }, []);

    return (
        <>
            comics
        </>
    )
};

export default CharacterComics;