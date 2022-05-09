import React, { useRef } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { apikey, BASE_URL, GET_SERIES, hash } from "../../api";
import { seriesPageAtom, seriesSearchedTitleAtom } from "../../atoms";
import { Blank, Btn, BtnInARow, CharName, Container, Highlighted, Input, Loading } from "../../styled";
import { ISeries } from "../../types_store/SeriesType";

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

    const location = useLocation();

    const paramsSearcher = new URLSearchParams(location.search);

    const nowPage: string = paramsSearcher.get('page') || BASE_STR;

    const titleStartsWith: string = paramsSearcher.get('title') || '';

    const startYear: string = paramsSearcher.get('year') || '';

    const fetchSeries = async () => {
        const res = await fetch(`${BASE_URL}${GET_SERIES}?ts=1&apikey=${apikey}&hash=${hash}&offset=${
            (+nowPage - 1) * LIMIT}&limit=${LIMIT}${
            titleStartsWith ? `&titleStartsWith=${titleStartsWith}` : ''}${
            startYear ? `&startYear=${startYear}` : ''
            }`);
        return await res.json();
    };

    const { data: 
        series, isLoading } = useQuery<ISeries>(
            ['series', nowPage, titleStartsWith, startYear], fetchSeries);

    let TOTAL: number = 0;
    if(series) {
        TOTAL = series?.data.total;
    };

    const setSeriesSearchedTitle = 
    useSetRecoilState(seriesSearchedTitleAtom);
    setSeriesSearchedTitle(titleStartsWith);

    const setSeriesPage = useSetRecoilState(seriesPageAtom);
    setSeriesPage(+nowPage);

    const nav = useNavigate();

    const showPrevious = () => {
        nav('/series?page=' + (+nowPage - 1) + `${
            titleStartsWith ? `&title=${titleStartsWith}` : ''}${
            startYear ? `&year=${startYear}` : ''
            }`);
    };

    const showNext = () => {
        nav('/series?page=' + (+nowPage + 1) + `${
            titleStartsWith ? `&title=${titleStartsWith}` : ''}${
            startYear ? `&year=${startYear}` : ''   
            }`);
    };

    const showSeriesOfThisIndex = (e: React.MouseEvent<HTMLButtonElement>) => {
        nav('/series?page=' + e.currentTarget.innerText + `${
            titleStartsWith ? `&title=${titleStartsWith}` : ''}${
            startYear ? `&year=${startYear}` : ''
            }`);
    };

    const showFirst = () => {
        nav('/series?page=1' + `${titleStartsWith ? `&title=${titleStartsWith}` : ''}${
            startYear ? `&year=${startYear}` : ''
            }`);
    };

    const showLast = () => {
        nav('/series?page=' + (Math.floor(TOTAL / LIMIT)) + `${
            titleStartsWith ? `&title=${titleStartsWith}` : ''}${
            startYear ? `&year=${startYear}` : ''
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

    const resetAllCondition = () => nav('/series');

    return (
        <>
            <Helmet>
                <title>Series</title>
            </Helmet>
            <Blank />
            { isLoading ? <><Loading src={require('../../images/giphy.gif')} /><Blank /></>: null }
            {
                !titleStartsWith ? null :
                <h1 style={{
                    textAlign: 'center'
                }}>Results for "<Highlighted>{ titleStartsWith }</Highlighted>"</h1>
            }
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
                    <Btn onClick={resetAllCondition}>reset</Btn>
                </BtnInARow>
                {
                    series?.data.results.map(seriesElem => {
                        return (
                            <span 
                            key={seriesElem.id}
                            >
                                <SeriesFrame
                                path={seriesElem.thumbnail.path + '/standard_xlarge.jpg'}
                                onClick={() => nav('/series/detail/' + seriesElem.id)}
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
                disabled={+nowPage === 1}
                >prev</Btn>
                {
                    [-3, -2, -1, 0, 1, 2, 3].map(i => {
                        return (
                            <span key={i}>
                                {
                                    i + +nowPage <= 0 || 
                                    i + +nowPage > Math.floor(TOTAL / LIMIT) ? null :
                                    <Btn
                                    onClick={showSeriesOfThisIndex}
                                    clicked={+nowPage === Math.floor(+nowPage + i)}
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
                disabled={+nowPage >= TOTAL / LIMIT - 1}
                >next</Btn><Btn
                onClick={showLast}
                >last</Btn>
            </div>
            <Blank />
        </>
    )
};

export default Series;