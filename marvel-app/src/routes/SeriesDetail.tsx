import axios from "axios";
import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_SERIES, hash } from "../api";
import { Blank, CharName } from "../styled";
import { ISeries } from "../types_store/SeriesType";

const SeriesPortrait = styled.div<{ path: string }>`
    width: 345px;
    height: 345px;
    background-image: linear-gradient(to top, black, transparent), 
    url(${ props => props.path });
    background-size: cover;
    background-position: center center;
    margin: auto;
    position: relative;
`;

const SeriesTitle = styled.p`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;
    text-align: center;
    font-weight: bold;
`;


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
            <Blank />
            <SeriesPortrait 
            path={series?.data.results[0].thumbnail.path + '/standard_fantastic.jpg'}
            >
                <SeriesTitle
                >{ series?.data.results[0].title }</SeriesTitle>
            </SeriesPortrait>
        </>
    )
};

export default SeriesDetail;