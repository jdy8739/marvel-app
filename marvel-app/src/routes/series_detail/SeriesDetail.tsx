import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { apikey, BASE_URL, GET_SERIES, hash } from "../../api";
import { seriesPageAtom, seriesSearchedTitleAtom } from "../../atoms";
import SeriesCharacters from "./components/SeriesCharacters";
import SeriesComics from "./components/SeriesComics";
import { Blank, ClickToGoBack, Highlighted, Loading, Tab, Tabs } from "../../styled";
import { ICreators } from "../../types_store/CreatorsTypes";
import { ISeries } from "../../types_store/SeriesType";

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

const CreatorWrapper = styled.div`
    width: 70%;
    display: flex;
    flex-wrap: wrap;
    margin: auto;
    justify-content: center;
    margin-top: 32px;
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

    const seriesMatch = 
        useMatch('/series/detail/:id');

    const seriesCharMatch = 
        useMatch('/series/detail/:id/characters');

    const seriesComicsMatch = 
        useMatch('/series/detail/:id/comics');

    const seriesCreatorsMatch = 
        useMatch('/series/detail/:id/creators');

    const match = 
        seriesMatch || 
        seriesCharMatch || 
        seriesComicsMatch || 
        seriesCreatorsMatch;

    const fetchSeriesDetail = async () => {
        const res = 
        await fetch(
            `${BASE_URL}${GET_SERIES}/${match?.params.id}?ts=1&apikey=${apikey}&hash=${hash}`);
        return await res.json();
    };

    const { data, isLoading } = useQuery<ISeries>(
        ['seriesElem', seriesMatch?.params.id], fetchSeriesDetail);

    const series = data?.data.results[0];

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

    const seriesNameSet: Set<string> = new Set();
    series?.comics.items.forEach(item => {
        seriesNameSet.add(item.name);
    });

    const seriesNameArr: string[] = Array.from(seriesNameSet);

    const [comicsName, setComicsName] = useState('');

    const showComicsInThisSeries = (item: string) => {
        setComicsName(item);
        nav('/series/detail/' + match?.params.id + '/comics');
    };

    const [creators, setCreators] = useState<ICreators>();

    useEffect(() => {
        if(seriesCreatorsMatch && !creators) {
            axios.get<ICreators>(
                `${BASE_URL}${GET_SERIES}/${match?.params.id}/creators?ts=1&apikey=${apikey}&hash=${hash}`)
                .then(res => {

                    setCreators(res.data);
                });
        };
    }, [seriesCreatorsMatch])

    return (
        <>
            <Helmet>
                <title>{ series?.title }</title>
            </Helmet>
            <Blank />
            { isLoading ? <Loading src={require('../../images/giphy.gif')} /> : null }
            <SeriesPortrait 
            path={series?.thumbnail.path + '/standard_fantastic.jpg'}
            onClick={goBackToSeriesPage}
            >   
                <ClickToGoBack>click to go back</ClickToGoBack>
            </SeriesPortrait>
            <Container>
                <div style={{
                    textAlign: 'center'
                }}>
                    <SeriesTitle
                    >{ series?.title }</SeriesTitle>
                    <div>
                        published: &ensp;
                        <Highlighted>
                            { series?.startYear + " - "}
                            { series?.endYear }
                        </Highlighted>
                    </div>
                    <p>total number of comics: &ensp;
                        <Highlighted>{series?.comics.available}</Highlighted>
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
                <Tab
                clicked={Boolean(seriesCreatorsMatch)}
                onClick={() => nav('/series/detail/' + match?.params.id + '/creators')}
                >creators</Tab>
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
            { 
                seriesCreatorsMatch ? 
                <CreatorWrapper>
                    {
                        creators?.data.results.map(creator => {
                            return (
                                <h4
                                style={{ margin: '8px' }}
                                key={creator.id}
                                >{ creator.fullName }</h4>
                            )
                        })
                    }
                </CreatorWrapper>
                : null
            }
        </>
    )
};

export default SeriesDetail;