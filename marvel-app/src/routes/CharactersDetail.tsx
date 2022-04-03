import axios from "axios";
import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { apikey, BASE_URL, GET_SEARCHED_CHAR, GET_SINGLE_CHAR, hash } from "../api";
import { ICharacter } from "../types_store/CharatersType";

function CharactersDetail() {

    const charMatch = useMatch('/characters/detail/:id');

    const [char, setChar] = useState<ICharacter>();

    const fetchSingleCharacter = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_SINGLE_CHAR}/${charMatch?.params.id}?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setChar(res.data);
                console.log(res.data);
            });
    };

    useEffect(() => {
        fetchSingleCharacter();
    }, [])

    return (
        <>
            <h1>{ char?.data.results[0].name }</h1>
            <img src={`${char?.data.results[0].thumbnail.path}/portrait_uncanny.jpg`} />
            <p>{ char?.data.results[0].description || 'No Description' }</p>
        </>
    )
};

export default CharactersDetail;