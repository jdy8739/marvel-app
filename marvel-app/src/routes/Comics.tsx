import axios from "axios";
import { useEffect } from "react";
import { apikey, BASE_URL, GET_COMICS, hash } from "../api";
import { Blank } from "../styled";

function Comics() {

    const fetchComics = function() {
        axios.get(`${BASE_URL}${GET_COMICS}&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                console.log(res.data);
            })
    };

    useEffect(() => {
        fetchComics();
    }, []);

    return (
        <>
            <Blank />
            comics
        </>
    )
};

export default Comics;