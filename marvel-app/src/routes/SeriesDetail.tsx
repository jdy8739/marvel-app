import axios from "axios";
import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { apikey, BASE_URL, GET_SERIES, hash } from "../api";
import { ISeries } from "../types_store/SeriesType";


function SeriesDetail() {

    const seriesMatch = useMatch('/series/detail/:id');

    const [series, setSeries] = useState<ISeries>();

    const fetchSeriesDetail = () => {
        axios.get<ISeries>(`${BASE_URL}${GET_SERIES}/${seriesMatch?.params.id}?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setSeries(res.data);
                console.log(res.data);
            });
    };

    useEffect(() => {
        fetchSeriesDetail();
    }, []);

    return (
        <>

        </>
    )
};

export default SeriesDetail;