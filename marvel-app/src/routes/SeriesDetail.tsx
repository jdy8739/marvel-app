import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { apikey, BASE_URL, GET_SERIES, hash } from "../api";
import { seriesPageAtom, seriesSearchedTitleAtom } from "../atoms";
import SeriesCharacters from "../components/SeriesCharacters";
import SeriesComics from "../components/SeriesComics";
import { Blank, CharName, ClickToGoBack, Highlighted, Tab, Tabs } from "../styled";
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

const SeriesElemName = styled.h5`
    margin: 8px;
    display: inline-block;
    cursor: pointer;
    &:hover {
        color: #F0131E;
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

    const seriesComicsMatch = useMatch('/series/detail/:id/comics');

    const match = 
    seriesMatch || seriesCharMatch || seriesComicsMatch;

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

    const [comicsName, setComicsName] = useState('');

    const showComicsInThisSeries = (item: string) => {
        setComicsName(item);
        nav('/series/detail/' + match?.params.id + '/comics');
    };

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
                    <div>
                        published: &ensp;
                        <Highlighted>
                            { series?.data.results[0].startYear + " - "}
                            { series?.data.results[0].endYear }
                        </Highlighted>
                    </div>
                    <p>total number of comics: &ensp;
                        <Highlighted>{seriesNameArr.length}</Highlighted>
                    </p>
                    <div >
                        {
                            seriesNameArr.map(item => {
                                return <SeriesElemName
                                onClick={() => showComicsInThisSeries(item)}
                                key={item}>{ item }</SeriesElemName>
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
                <Tab
                clicked={Boolean(seriesComicsMatch)}
                onClick={() => nav('/series/detail/' + match?.params.id + '/comics')}
                >comics</Tab>
            </Tabs>
            { seriesCharMatch ? 
            <SeriesCharacters
            id={match?.params.id || ''} 
            /> : null }
            { seriesComicsMatch ? 
            <SeriesComics
            chosenComicsName={comicsName}
            id={match?.params.id || ''} 
            />  : null}
        </>
    )
};

export default SeriesDetail;