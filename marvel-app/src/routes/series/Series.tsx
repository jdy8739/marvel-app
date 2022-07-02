import React, { useRef } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { seriesPageAtom, seriesSearchedTitleAtom } from "../../atoms";
import { BASE_URL, KEY_STRING } from "../../key";
import {
    Blank,
    Btn,
    BtnInARow,
    CharName,
    Container,
    Highlighted,
    Input,
    Loading,
} from "../../styled";
import { ISeries } from "../../types_store/SeriesType";

const SeriesFrame = styled.div<{ path: string }>`
    width: 175px;
    height: 175px;
    background-image: linear-gradient(to top, #2b2b2b, transparent),
        url(${props => props.path});
    margin: 8px;
    border: 1px solid black;
    transition: all 1s;
    &:hover {
        border: 1px solid #f0131e;
        border-radius: 25%;
        background-image: linear-gradient(to top, #aaaaaa, transparent),
            url(${props => props.path});
        ${CharName} {
            color: #f0131e;
            opacity: 1;
        }
    }
    position: relative;
`;

const BASE_STR = "1";

const LIMIT = 20;

function Series() {
    const nav = useNavigate();

    const location = useLocation();

    const paramsSearcher = new URLSearchParams(location.search);

    const nowPage: string = paramsSearcher.get("page") || BASE_STR;

    const titleStartsWith: string = paramsSearcher.get("title") || "";

    const startYear: string = paramsSearcher.get("year") || "";

    const titleRef = useRef<HTMLInputElement>(null);

    const yearRef = useRef<HTMLInputElement>(null);

    let TOTAL: number = 0;

    const fetchSeries = async () => {
        const res = await fetch(
            `${BASE_URL}series?${KEY_STRING}&offset=${
                (+nowPage - 1) * LIMIT
            }&limit=${LIMIT}${
                titleStartsWith ? `&titleStartsWith=${titleStartsWith}` : ""
            }${startYear ? `&startYear=${startYear}` : ""}`
        );
        return await res.json();
    };

    const { data: series, isLoading } = useQuery<ISeries>(
        ["series", nowPage, titleStartsWith, startYear],
        fetchSeries
    );

    const setPageAndTotalNum = () => {
        if (series) TOTAL = series?.data.total;
    };

    const setSeriesSearchedTitle = useSetRecoilState(seriesSearchedTitleAtom);
    setSeriesSearchedTitle(titleStartsWith);

    const setSeriesPage = useSetRecoilState(seriesPageAtom);
    setSeriesPage(+nowPage);

    const showAnotherPage = (page: number) => {
        let target;
        switch (page) {
            case 1:
                target = 1;
                break;
            case 2:
                target = +nowPage + 1;
                break;
            case 3:
                target = +nowPage - 1;
                break;
            case 4:
                target = Math.floor(TOTAL / LIMIT);
                break;
        }
        nav(
            "/series?page=" +
                target +
                `${titleStartsWith ? `&title=${titleStartsWith}` : ""}${
                    startYear ? `&year=${startYear}` : ""
                }`
        );
    };

    const showSeriesOfThisIndex = (e: React.MouseEvent<HTMLButtonElement>) => {
        nav(
            "/series?page=" +
                e.currentTarget.innerText +
                `${titleStartsWith ? `&title=${titleStartsWith}` : ""}${
                    startYear ? `&year=${startYear}` : ""
                }`
        );
    };

    const handleSubmitTitleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        nav(
            `/series?title=${titleRef.current?.value}${
                startYear ? `&year=${startYear}` : ""
            }`
        );
    };

    const handleSubmitYearSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        nav(
            `/series?year=${yearRef.current?.value}${
                titleStartsWith ? `&title=${titleStartsWith}` : ""
            }`
        );
    };

    const resetAllCondition = () => nav("/series");

    setPageAndTotalNum();

    return (
        <>
            <Helmet>
                <title>Series</title>
            </Helmet>
            <Blank />
            {isLoading && (
                <>
                    <Loading
                        // eslint-disable-next-line no-undef
                        src={process.env.PUBLIC_URL + "/images/giphy.gif"}
                    />
                    <Blank />
                </>
            )}
            {!titleStartsWith ? null : (
                <h1
                    style={{
                        textAlign: "center",
                    }}
                >
                    Results for &quot;
                    <Highlighted>{titleStartsWith}</Highlighted>&qout;
                </h1>
            )}
            <Container>
                <BtnInARow>
                    <form onSubmit={handleSubmitTitleSearch}>
                        <Input
                            placeholder="search series you look for."
                            style={{
                                width: "175px",
                            }}
                            required
                            ref={titleRef}
                        />
                        &ensp;
                        <Btn>search</Btn>
                    </form>
                </BtnInARow>
                <BtnInARow>
                    <form onSubmit={handleSubmitYearSearch}>
                        <Input
                            type="number"
                            min="1940"
                            max={"2022"}
                            style={{ width: "125px" }}
                            required
                            placeholder="year of the series"
                            ref={yearRef}
                        />
                        &ensp;
                        <Btn>search</Btn>
                    </form>
                </BtnInARow>
                <BtnInARow style={{ marginBottom: "28px" }}>
                    <Btn onClick={resetAllCondition}>reset</Btn>
                </BtnInARow>
                {series?.data.results.map(seriesElem => {
                    return (
                        <span key={seriesElem.id}>
                            <SeriesFrame
                                path={
                                    seriesElem.thumbnail.path +
                                    "/standard_xlarge.jpg"
                                }
                                onClick={() =>
                                    nav("/series/detail/" + seriesElem.id)
                                }
                            >
                                <CharName length={seriesElem.title.length || 0}>
                                    {seriesElem.title.length > 18
                                        ? seriesElem.title.slice(0, 18) + "..."
                                        : seriesElem.title}
                                </CharName>
                            </SeriesFrame>
                        </span>
                    );
                })}
            </Container>
            <br></br>
            <div
                style={{
                    textAlign: "center",
                }}
            >
                <Btn onClick={() => showAnotherPage(1)}>first</Btn>
                <Btn
                    onClick={() => showAnotherPage(3)}
                    disabled={+nowPage === 1}
                >
                    prev
                </Btn>
                {[-3, -2, -1, 0, 1, 2, 3].map(i => {
                    return (
                        <span key={i}>
                            {i + +nowPage <= 0 ||
                            i + +nowPage > Math.floor(TOTAL / LIMIT) ? null : (
                                <Btn
                                    onClick={showSeriesOfThisIndex}
                                    clicked={
                                        +nowPage === Math.floor(+nowPage + i)
                                    }
                                >
                                    {+nowPage + i}
                                </Btn>
                            )}
                        </span>
                    );
                })}
                <Btn
                    onClick={() => showAnotherPage(2)}
                    disabled={+nowPage >= TOTAL / LIMIT - 1}
                >
                    next
                </Btn>
                <Btn onClick={() => showAnotherPage(4)}>last</Btn>
            </div>
            <Blank />
        </>
    );
}

export default Series;
