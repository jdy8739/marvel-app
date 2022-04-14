import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { apikey, BASE_URL, GET_CHAR, hash } from "../api";
import { charPageAtom, charStartsWithAtom, charNameAtom } from "../atoms";
import CharacterCard from "../components/CharacterCard";
import { Highlighted, Container, Btn, Input, Blank, BtnInARow } from "../styled";
import { ICharacter } from "../types_store/CharatersType";

const CharIcon = styled.span`
    padding: 5px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
        color: #F0131E;
    }
`;

const LIMIT = 30;

const BASE_STR = '1';

const charArr: string[] = [];

for(let i=65; i<91; i++) {
    charArr.push(String.fromCharCode(i))
};

function Characters() {

    const location = useLocation();

    const paramsSearcher = new URLSearchParams(location.search);

    let startsWith = paramsSearcher.get('nameStartsWith');

    let nowPage = paramsSearcher.get('page') || BASE_STR;

    let name = paramsSearcher.get('name');

    const [charStartsWith, setCharStartsWith] = useRecoilState(charStartsWithAtom);

    const [charName, setCharName] = useRecoilState(charNameAtom);

    const setCharPage = useSetRecoilState(charPageAtom);

    setCharPage(+nowPage);

    const fetchCharacters = async () => {
        const res = await fetch(`${BASE_URL}${GET_CHAR}&apikey=${apikey}&hash=${hash}&offset=${
            (+nowPage - 1) * LIMIT}&limit=${LIMIT}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}${
            name ? `&name=${name}` : ''
            }`);
        return await res.json();
    };

    const { data: chars } = useQuery<ICharacter>(
        ['characters', nowPage, startsWith, name], fetchCharacters);

    let TOTAL = 0;
    if(chars?.data) {
        TOTAL = chars?.data.total;
    };

    const showNext = () => {
        nav(`/characters?page=${+nowPage + 1}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}${
            name ? `&name=${name}` : ''
            }`);
    };

    const showPrevious = () => {
        nav(`/characters?page=${+nowPage - 1}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}${
            name ? `&name=${name}` : ''
            }`);
    };

    const showFirst = () => {
        nav(`/characters?page=1${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}${
            name ? `&name=${name}` : ''
            }`);
    };

    const showLast = () => {
        nav(`/characters?page=${(Math.floor(TOTAL / LIMIT) + 1)}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}${
            name ? `&name=${name}` : ''
            }`);
    };

    const showCharsOfIndex = (idx: number) => {
        nav(`/characters?page=${idx}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}${
            name ? `&name=${name}` : ''
            }`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharName(e.currentTarget.value);
    };

    const handleSearchNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchedChar = 
            nameSearchRef.current?.value || '';

        setCharName(searchedChar);
        setCharStartsWith('');

        nav(`/characters?name=${searchedChar}`);
    };

    const handleStartsWithClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        const searchedCharName = 
            e.currentTarget.textContent || '';

        setCharStartsWith(searchedCharName);
        setCharName('');

        nav(`/characters?nameStartsWith=${searchedCharName}`);
    };

    const resetSearch = () => {
        nav('/characters');
    };

    const nav = useNavigate();

    const nameSearchRef = useRef<HTMLInputElement>(null);

    return (
        <>  
            <Helmet>
                <title>Marvel Characters</title>
            </Helmet>
            <Blank />
            {
                !startsWith && !name ? null :
                <h1 style={{
                    textAlign: 'center'
                }}>Results for "<Highlighted>{ startsWith || name }</Highlighted>"</h1>
            }
            <Container>
                <BtnInARow>
                    { charArr.map(char => 
                    <CharIcon
                    onClick={handleStartsWithClick}
                    key={char}>{ char }</CharIcon>) }
                </BtnInARow>
                <BtnInARow>
                    <form
                    style={{
                        display: 'inline-block'
                    }}
                    onSubmit={handleSearchNameSubmit}
                    >
                        <Input 
                        onChange={handleSearchChange} 
                        value={charName}
                        required
                        style={{
                            width: '170px'
                        }}
                        placeholder="search the character name."
                        ref={nameSearchRef}
                        />
                        &ensp;
                        <Btn>search</Btn>
                    </form>
                </BtnInARow>
                <BtnInARow style={{ marginBottom: '28px' }}>
                    <Btn onClick={resetSearch}>reset</Btn>
                </BtnInARow>
                {
                    chars?.data.results.length !== 0 ? 
                    <>
                        {
                            chars?.data.results.map(char => {
                                return (
                                    <span
                                    key={char.id}
                                    onClick={() => nav(`/characters/detail/${char.id}`)}
                                    >
                                        <CharacterCard char={char} />
                                    </span>
                                )
                            })
                        }
                    </> : <p>cannot find any results. :(</p>
                }
            </Container>
            <br></br>
            <br></br>
            <div style={{
                textAlign: 'center'
            }}>
                <Btn onClick={showFirst}>first</Btn>
                <Btn 
                onClick={showPrevious}
                disabled={+nowPage === 1}
                >prev</Btn>
                {
                    [-3, -2, -1, 0, 1, 2, 3].map(idx => {
                        return (
                            <span key={idx}>
                                {
                                    !TOTAL ? null :
                                    +nowPage + idx - 1 < 0 ? null :
                                    +nowPage + idx > Math.floor(TOTAL / LIMIT) + 1 ? null :
                                    <Btn 
                                    onClick={() => showCharsOfIndex(+nowPage + idx)}
                                    clicked={ +nowPage === Math.floor(+nowPage + idx) }
                                    >
                                        { +nowPage + idx }
                                    </Btn>
                                }
                            </span>
                        )
                    })
                }
                <Btn 
                onClick={showNext}
                disabled={TOTAL ? +nowPage === Math.floor(TOTAL / LIMIT) : false}
                >next</Btn>
                <Btn onClick={showLast}>last</Btn>
            </div>
        </>
    )
};

export default Characters;