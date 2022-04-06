import axios from "axios";
import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { apikey, BASE_URL, GET_ON_COMICS, hash } from "../api";
import { Blank, ComicPortrait } from "../styled";
import { IComics } from "../types_store/ComicsType";

function ComicsDetail() {

    const comicsMatch = useMatch('/comics/detail/:id');

    const [comic, setComic] = useState<IComics>();

    const fetchComic = function() {
        axios.get<IComics>(`${BASE_URL}${GET_ON_COMICS}/${comicsMatch?.params.id}?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setComic(res.data);
            });
    };

    useEffect(() => {
        fetchComic();
    }, []);

    return (
        <>
            <Blank />
            <ComicPortrait
            path={comic?.data.results[0].thumbnail.path + '/portrait_uncanny.jpg'}
            >
                
            </ComicPortrait>
        </>
    )
};

export default ComicsDetail;