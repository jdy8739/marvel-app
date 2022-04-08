import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_SERIES, hash } from "../api";
import { Blank, Btn, BtnInARow, CharName, Container, Input } from "../styled";
import { ISeries } from "../types_store/SeriesType";

const SeriesFrame = styled.div<{ path: string }>`
    width: 175px;
    height: 175px;
    background-image: linear-gradient(to top, #2b2b2b, transparent), 
    url(${ props => props.path });
    margin: 8px;
    border: 1px solid black;
    transition: all 1s;
    &:hover {
        border: 1px solid #F0131E;
        border-radius: 25%;
        background-image: linear-gradient(to top, #aaaaaa, transparent),
         url(${ props => props.path });
        ${CharName} {
            color: #F0131E;
            opacity: 1;
        }
    }
    position: relative;
`;

const BASE_STR = '1';

const LIMIT = 20;

function Series() {

    const [series, setSeries] = useState<ISeries>();

    const location = useLocation();

    const paramsSearcher = new URLSearchParams(location.search);

    const nowPage: string = paramsSearcher.get('page') || BASE_STR;

    const titleStartsWith: string = paramsSearcher.get('title') || '';

    const startYear: string = paramsSearcher.get('year') || '';

    //const [seriesPageIdx, setSeriesPageIdx] = useState(1);
    
    const fetchSeries = function() {
        axios.get<ISeries>(`${BASE_URL}${GET_SERIES}?ts=1&apikey=${apikey}&hash=${hash}&offset=${
            (+nowPage - 1) * LIMIT}&limit=${LIMIT}${
                titleStartsWith ? `&titleStartsWith=${titleStartsWith}` : ''}${
                startYear ? `&startYear=${startYear}` : ''
                }
            `)
            .then(res => {
                setSeries(res.data);
                console.log(res.data);
            });
    };

    let TOTAL: number;

    if(series) {
        TOTAL = series?.data.total;
    };

    useEffect(() => {
        fetchSeries();
    }, [nowPage, titleStartsWith, startYear]);

    const nav = useNavigate();

    const showPrevious = () => {
        nav('/series?page=' + (+nowPage - 1) + `${
            titleStartsWith ? `&title=${titleStartsWith}` : ''
        }`);
    };

    const showNext = () => {
        //setSeriesPageIdx(idx => idx + 1);
        nav('/series?page=' + (+nowPage + 1) + `${
            titleStartsWith ? `&title=${titleStartsWith}` : ''
        }`);
    };

    const showSeriesOfThisIndex = (e: React.MouseEvent<HTMLButtonElement>) => {
        nav('/series?page=' + e.currentTarget.innerText + `${
            titleStartsWith ? `&title=${titleStartsWith}` : ''
        }`);
    };

    const showFirst = () => {
        nav('/series');
    };

    const showLast = () => {
        nav('/series?page=' + (Math.floor(TOTAL / LIMIT) + 1) + `${
            titleStartsWith ? `&title=${titleStartsWith}` : ''
        }`);
    };

    const titleRef = useRef<HTMLInputElement>(null);

    const yearRef = useRef<HTMLInputElement>(null);

    const handleSubmitTitleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        nav(`/series?title=${titleRef.current?.value}${
            startYear ? `&year=${startYear}` : ''
        }`);
    };

    const handleSubmitYearSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        nav(`/series?year=${yearRef.current?.value}${
            titleStartsWith ? `&title=${titleStartsWith}` : ''
        }`);
    };

    return (
        <>
            <Blank />
            <Container>
                <BtnInARow> 
                    <form
                    onSubmit={handleSubmitTitleSearch}
                    >
                        <Input 
                        placeholder="search series you look for."
                        style={{
                            width: '175px'
                        }}
                        required
                        ref={titleRef}
                        />
                        &ensp;
                        <Btn>search</Btn>
                    </form>
                </BtnInARow>
                <BtnInARow>
                    <form
                    onSubmit={handleSubmitYearSearch}
                    >
                        <Input 
                        type="number"
                        min="1940"
                        max={"2022"}
                        style={{ width: '125px' }}
                        required
                        placeholder="year of the series"
                        ref={yearRef}
                        />
                        &ensp;
                        <Btn>search</Btn>
                    </form>
                </BtnInARow>
                <BtnInARow style={{ marginBottom: '28px' }}>
                    <Btn>reset</Btn>
                </BtnInARow>
                {
                    series?.data.results.map(seriesElem => {
                        return (
                            <span 
                            key={seriesElem.id}
                            >
                                <SeriesFrame
                                path={seriesElem.thumbnail.path + '/standard_xlarge.jpg'}
                                >
                                    <CharName
                                    length={seriesElem.title.length || 0}
                                    >
                                        {
                                            seriesElem.title.length > 18 ? 
                                            seriesElem.title.slice(0, 18) + '...' :
                                            seriesElem.title
                                        }
                                    </CharName>
                                </SeriesFrame>
                            </span>
                        )
                    })
                }
            </Container>
            <br></br>
            <br></br>
            <div style={{
                textAlign: 'center'
            }}>
                <Btn
                onClick={showFirst}
                >first</Btn>
                <Btn
                onClick={showPrevious}
                >prev</Btn>
                {
                    [-3, -2, -1, 0, 1, 2, 3].map(i => {
                        return (
                            <span key={i}>
                                {
                                    i + +nowPage <= 0 || 
                                    i + +nowPage > Math.floor(TOTAL / LIMIT) + 1 ? null :
                                    <Btn
                                    onClick={showSeriesOfThisIndex}
                                    >
                                        { +nowPage + i }
                                    </Btn>
                                }
                            </span>
                        )
                    })
                }
                <Btn
                onClick={showNext}
                >next</Btn><Btn
                onClick={showLast}
                >last</Btn>
            </div>
        </>
    )
};

export default Series;