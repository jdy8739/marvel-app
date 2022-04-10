import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { apikey, BASE_URL, GET_SERIES, hash } from "../api";
import { seriesPageAtom, seriesSearchedTitleAtom } from "../atoms";
import SeriesCharacters from "../components/SeriesCharacters";
import { Blank, CharName, ClickToGoBack, Tab, Tabs } from "../styled";
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
    transition: all 1s;
    &:hover {
        transform: scale(1.02);
        ${ClickToGoBack} {
            color: #F0131E;
            opacity: 1;
        }
    }
`;

const SeriesTitle = styled.h2`

`;

const Container = styled.div`
    width: 48%;
    min-width: 280px;
    margin: auto;
`;


function SeriesDetail() {

    const seriesMatch = useMatch('/series/detail/:id');

    const seriesCharMatch = useMatch('/series/detail/:id/characters');

    const match = 
    seriesMatch || seriesCharMatch;

    const fetchSeriesDetail = async () => {
        const res = 
        await fetch(`${BASE_URL}${GET_SERIES}/${match?.params.id}?ts=1&apikey=${apikey}&hash=${hash}`);

        return await res.json();
    };

    const { data: series } = useQuery<ISeries>(
        ['seriesElem', seriesMatch?.params.id], fetchSeriesDetail);

    const page = useRecoilValue(seriesPageAtom);

    const searchedTitle = useRecoilValue(seriesSearchedTitleAtom);

    const goBackToSeriesPage = () => {
        if(searchedTitle || page) {
            nav(`/series?${searchedTitle ? `&title=${searchedTitle}` : ''}${
            page ? `&page=${page}` : ''
            }`);
        } else nav('/series');
    };

    const nav = useNavigate();

    //console.log(series);

    const seriesNameSet: Set<string> = new Set();
    series?.data.results[0].comics.items.forEach(item => {
        seriesNameSet.add(item.name);
    });

    const seriesNameArr: string[] = Array.from(seriesNameSet);

    return (
        <>
            <Blank />
            <SeriesPortrait 
            path={series?.data.results[0].thumbnail.path + '/standard_fantastic.jpg'}
            onClick={goBackToSeriesPage}
            >   
                <ClickToGoBack>click to go back</ClickToGoBack>
            </SeriesPortrait>
            <Container>
                <div style={{
                    textAlign: 'center'
                }}>
                    <SeriesTitle
                    >{ series?.data.results[0].title }</SeriesTitle>
                    <span>{ series?.data.results[0].startYear } - </span>
                    <span>{ series?.data.results[0].endYear }</span>
                    <div 
                    style={{ lineHeight: '1px' }}
                    >
                        {
                            seriesNameArr.map(item => {
                                return <h5 key={item}>{ item }</h5>
                            })
                        }
                    </div>
                </div>
            </Container>
            <Tabs>
                <Tab
                clicked={Boolean(seriesCharMatch)}
                onClick={() => nav('/series/detail/' + match?.params.id + '/characters')}
                >characters</Tab>
                <Tab>creators</Tab>
            </Tabs>
            { seriesCharMatch ? 
            <SeriesCharacters
            id={match?.params.id || ''} 
            /> : null }
        </>
    )
};

export default SeriesDetail;