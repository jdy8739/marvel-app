import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { apikey, BASE_URL, GET_CHAR, hash } from "../api";
import { charPageAtom, charStartsWithAtom } from "../atoms";
import CharacterCard from "../components/CharacterCard";
import { Highlighted, Container, Btn, Input, Blank, BtnInARow } from "../styled";
import { ICharacter } from "../types_store/CharatersType";

const LIMIT = 30;

const BASE_STR = '1';

function Characters() {

    const [chars, setChars] = useState<ICharacter>();

    const location = useLocation();

    const paramsSearcher = new URLSearchParams(location.search);

    let startsWith = paramsSearcher.get('nameStartsWith');

    let nowPage = paramsSearcher.get('page') || BASE_STR;

    const [charStartsWith, setCharStartsWith] = useRecoilState(charStartsWithAtom);

    const setCharPage = useSetRecoilState(charPageAtom);

    setCharPage(+nowPage);

    const fetchCharacters = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_CHAR}&apikey=${apikey}&hash=${hash}&offset=${
            (+nowPage - 1) * LIMIT}&limit=${LIMIT}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''
            }`)
            .then(res => {
                setChars(res.data);
            });
    };

    let TOTAL = 0;
    if(chars?.data) {
        TOTAL = chars?.data.total;
    };

    const showNext = () => {
        nav(`/characters?page=${+nowPage + 1}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}`);
    };

    const showPrevious = () => {
        nav(`/characters?page=${+nowPage - 1}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}`);
    };

    const showFirst = () => {
        nav(`/characters?page=1${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}`);
    };

    const showLast = () => {
        nav(`/characters?page=${(Math.floor(TOTAL / LIMIT) + 1)}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}`);
    };

    const showCharsOfIndex = (idx: number) => {
        nav(`/characters?page=${idx}${
            startsWith ? `&nameStartsWith=${startsWith}` : ''}`);
    };
    
    useEffect(() => {
        fetchCharacters();
    }, [nowPage, startsWith]);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharStartsWith(e.currentTarget.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCharStartsWith(startsWithRef.current?.value || '');
        nav(`/characters?nameStartsWith=${charStartsWith}`);
    };  

    const resetSearch = () => {
        nav('/characters');
    };

    const nav = useNavigate();

    const startsWithRef = useRef<HTMLInputElement>(null);

    return (
        <>  
            <Blank />
            {
                !startsWith ? null :
                <h1 style={{
                    textAlign: 'center'
                }}>Results for "<Highlighted>{ startsWith }</Highlighted>"</h1>
            }
            <Container>
                <BtnInARow>
                    <form
                    style={{
                        display: 'inline-block'
                    }}
                    onSubmit={handleSearchSubmit}
                    >
                        <Input 
                        onChange={handleSearchChange} 
                        value={charStartsWith}
                        required
                        style={{
                            width: '200px'
                        }}
                        placeholder="search the characters start with."
                        ref={startsWithRef}
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