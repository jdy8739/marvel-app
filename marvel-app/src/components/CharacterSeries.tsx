import axios from "axios";
import { useEffect, useState } from "react";
import { apikey, BASE_URL, GET_ON_CHAR, hash } from "../api";
import { ISeries } from "../types_store/SeriesType";

function CharacterSeries({ id }: { id: string }) {

    const SUBJECT = 'series'

    const [series, setSeries] = useState<ISeries>();

    useEffect(() => {
        fetchSeriesContainingCharacter();
    }, []);

    const fetchSeriesContainingCharacter = () => {
        axios.get<ISeries>(`${BASE_URL}${GET_ON_CHAR}/${ id }/${SUBJECT}?ts=1&apikey=${apikey}&hash=${hash}&limit=12`)
            .then(res => {
                setSeries(res.data);
                console.log(res.data);
            })
    };

    return (
        <>
            {
                series?.data.results.map(seriesElem => {
                    return (
                        <span>
                            <img src={seriesElem.thumbnail.path + "/standard_amazing.jpg"} />
                        </span>
                    )
                })
            }
        </>
    )
};

export default CharacterSeries;