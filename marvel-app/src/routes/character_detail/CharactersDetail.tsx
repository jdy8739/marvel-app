import axios from "axios";
import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { charNameAtom, charPageAtom, charStartsWithAtom } from "../../atoms";
import CharacterComics from "./components/CharacterComics";
import CharacterEvents from "./components/CharacterEvents";
import CharacterSeries from "./components/CharacterSeries";
import { Blank, ClickToGoBack, Loading, Tab, Tabs } from "../../styled";
import { ICharacter } from "../../types_store/CharatersType";
import { BASE_URL, KEY_STRING } from "../../key";

const CharName = styled.h1<{ length: number }>`
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: auto;
    font-size: ${ props => props.length > 20 ? '20px' : '28px' };
    opacity: 0.75;
    transition: all 1s;
`;

const Portrait = styled.div<{ path: string }>`
    background-image: linear-gradient(to top, #252525, transparent), url(${ props => props.path });
    width: 320px;
    height: 450px;
    text-align: center;
    background-position: center center;
    background-size: cover;
    margin: auto;
    position: relative;
    transition: all 1s;
    &:hover {
        transform: scale(1.02);
        ${CharName} {
            color: #F0131E;
            opacity: 1.0;
        }
        ${ClickToGoBack} {
            opacity: 0.8;
            color: #F0131E;
        }
    }
`;

function CharactersDetail() {

    const nav = useNavigate();

    const charMatch = useMatch('/characters/detail/:id');

    const comicsMatch = useMatch('/characters/detail/:id/comics');

    const eventsMatch = useMatch('/characters/detail/:id/events');

    const seriesMatch = useMatch('/characters/detail/:id/series');

    const fetchSingleCharacter = async (id: string) => {
        const res = await fetch(
            `${BASE_URL}characters/${ id }?${KEY_STRING}`);
        
        return await res.json();
    };

    const id = charMatch?.params.id || 
    comicsMatch?.params.id || 
    eventsMatch?.params.id || 
    seriesMatch?.params.id || '';

    const { data: char, isLoading } = useQuery<ICharacter>(
        ['character', id], () => fetchSingleCharacter(id));

    const showSubDetail = (e: React.MouseEvent<HTMLButtonElement>) => {
        nav(`/characters/detail/${ id }/${e.currentTarget.innerText}`);
    };

    const startsWith = useRecoilValue(charStartsWithAtom);

    const name = useRecoilValue(charNameAtom);

    const page = useRecoilValue(charPageAtom);

    const backToCharPage = () => {
        nav(`/characters?${page ? `&page=${page}` : ''}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}${
            name ? `&name=${name}` : ''
            }`);
    };

    return (
        <>  
            <Helmet>
                <title>{ char?.data.results[0].name }</title>
            </Helmet>
            <Blank />
            { isLoading ? <><Loading src={process.env.PUBLIC_URL + '/images/giphy.gif'}/><Blank /></> : null }
            <Portrait 
            path={`${char?.data.results[0].thumbnail.path}/portrait_uncanny.jpg`}
            onClick={backToCharPage}
            >
                <ClickToGoBack>click portrait to go back</ClickToGoBack>
                <CharName
                length={ char?.data.results[0].name.length || 0 }
                >{ char?.data.results[0].name }</CharName>
            </Portrait>
            <br></br>
            <br></br>
            <p
            style={{
                width: '40%',
                textAlign: 'center',
                margin: 'auto'
            }}
            >{ char?.data.results[0].description || 'No Description' }</p>
            <Tabs>
                <Tab
                onClick={showSubDetail}
                disabled={ Boolean(comicsMatch) }
                clicked={ Boolean(comicsMatch) }
                >comics</Tab>
                <Tab
                onClick={showSubDetail}
                disabled={ Boolean(eventsMatch) }
                clicked={ Boolean(eventsMatch) }
                >events</Tab>
                <Tab
                onClick={showSubDetail}
                disabled={ Boolean(seriesMatch) }
                clicked={ Boolean(seriesMatch) }
                >series</Tab>
            </Tabs>
            <div style={{ height: '60px' }}></div>
            {
                comicsMatch ? 
                <CharacterComics id={ comicsMatch.params.id || '' }/> : null
            }
            {
                eventsMatch ? 
                <CharacterEvents id={ eventsMatch.params.id || '' }/> : null
            }
            {
                seriesMatch ? 
                <CharacterSeries id={ seriesMatch.params.id || '' }/> : null
            }
        </>
    )
};

export default CharactersDetail;