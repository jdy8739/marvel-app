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

    const nowPage: string = new URLSearchParams(location.search).get('page') || BASE_STR;

    let titleStartsWith: string = new URLSearchParams(location.search).get('title') || '';

    //const [seriesPageIdx, setSeriesPageIdx] = useState(1);
    
    const fetchSeries = function() {
        axios.get<ISeries>(`${BASE_URL}${GET_SERIES}?ts=1&apikey=${apikey}&hash=${hash}&offset=${
            (+nowPage - 1) * LIMIT}&limit=${LIMIT}${
                titleStartsWith ? `&titleStartsWith=${titleStartsWith}` : ''
            }
        }`)
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
    }, [nowPage, titleStartsWith]);

    const nav = useNavigate();

    const showPrevious = () => {
        nav('/series?page=' + (+nowPage - 1));
    };

    const showNext = () => {
        //setSeriesPageIdx(idx => idx + 1);
        nav('/series?page=' + (+nowPage + 1));
    };

    const showSeriesOfThisIndex = (e: React.MouseEvent<HTMLButtonElement>) => {
        nav('/series?page=' + e.currentTarget.innerText);
    };

    const showFirst = () => {
        nav('/series');
    };

    const showLast = () => {
        nav('/series?page=' + (Math.floor(TOTAL / LIMIT) + 1));
    };

    const titleRef = useRef<HTMLInputElement>(null);

    const handleSubmitTitleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const title = titleRef.current?.value;
        titleStartsWith = title || '';
        nav(`/series?title=${title}`);
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
                    <form>
                        <Input 
                        type="number"
                        min="1940"
                        max={"2022"}
                        style={{ width: '125px' }}
                        required
                        placeholder="year of the series"
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