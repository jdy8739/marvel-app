import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { apikey, BASE_URL, GET_CHAR, GET_SEARCHED_CHAR, hash } from "../api";
import { startWithAtom } from "../atoms";
import CharacterCard from "../components/CharacterCard";
import { Highlighted, CharacterContainer, Btn, Input, Blank } from "../styled";
import { ICharacter } from "../types_store/CharatersType";


let cnt = 0;

const LIMIT = 30;

function Characters() {

    const [chars, setChars] = useState<ICharacter>();

    const getChars = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_CHAR}&apikey=${apikey}&hash=${hash}&limit=${LIMIT}&offset=${cnt * LIMIT}`)
            .then(res => {
                setChars(res.data);
            });
    };

    const total = chars?.data.total;

    const location = useLocation();

    const startWith = new URLSearchParams(location.search).get('startWith'); 

    const showNext = () => {
        cnt ++;
        fetchCharacters();
    };

    const showPrevious = () => {
        cnt --;
        fetchCharacters();
    };

    const showFirst = () => {
        cnt = 0;
        fetchCharacters();
    };

    const showLast = () => {
        if(total) {
            const lastIndex = Math.floor(total / LIMIT);
            cnt = lastIndex;
            fetchCharacters();
        };
    };

    const showCharsOfIndex = (idx: number) => {
        cnt = idx;
        fetchCharacters();
    };
    
    useEffect(() => {
        fetchCharacters();
    }, []);

    const [searchedChar, setSearchedChar] = useRecoilState(startWithAtom);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedChar(e.currentTarget.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        nav('/characters?startWith=' + searchedChar);
        cnt = 0;
        getSearchedChars();
    };

    const getSearchedChars = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_SEARCHED_CHAR}${searchedChar || startWith}&apikey=${apikey}&hash=${hash}&limit=${LIMIT}&offset=${cnt * LIMIT}`)
            .then(res => {
                setChars(res.data);
            });
    };

    const fetchCharacters = () => {
        if(startWith) getSearchedChars();
        else getChars();
    };           

    const resetSearch = () => {
        nav('/characters');
        setSearchedChar('');
        cnt = 0;
        getChars();
    };

    const nav = useNavigate();

    return (
        <>  
            <Blank />
            {
                !startWith ? null :
                <h1 style={{
                    textAlign: 'center'
                }}>Results for "<Highlighted>{ startWith }</Highlighted>"</h1>
            }
            <div
            style={{
                textAlign: 'center'
            }}
            >
                <form
                style={{
                    display: 'inline-block'
                }}
                onSubmit={handleSearchSubmit}
                >
                    <label>
                        <span>search the characters start with</span>
                        &ensp;
                        <Input 
                        onChange={handleSearchChange} 
                        value={searchedChar}
                        required
                        />
                    </label>
                </form>
                &emsp;
                <Btn onClick={resetSearch}>reset</Btn>
            </div>
            <br></br>
            <CharacterContainer>
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
            </CharacterContainer>
            <br></br>
            <br></br>
            <div style={{
                textAlign: 'center'
            }}>
                <Btn onClick={showFirst}>first</Btn>
                <Btn 
                onClick={showPrevious}
                disabled={cnt === 0}
                >prev</Btn>
                {
                    [-3, -2, -1, 0, 1, 2, 3].map(idx => {
                        return (
                            <span key={idx}>
                                {
                                    !total ? null :
                                    cnt + idx < 0 ? null :
                                    cnt + idx > Math.floor(total / LIMIT) ? null :
                                    <Btn 
                                    onClick={() => showCharsOfIndex(cnt + idx)}
                                    clicked={ cnt === Math.floor(cnt + idx) }
                                    >
                                        {
                                            cnt === Math.floor(cnt + idx) ? 
                                            <Highlighted>{ Math.floor(cnt + idx) + 1}</Highlighted> :
                                            <>{ Math.floor(cnt + idx) + 1}</>
                                        }
                                    </Btn>
                                }
                            </span>
                        )
                    })
                }
                <Btn 
                onClick={showNext}
                disabled={total ? cnt === Math.floor(total / LIMIT) : false}
                >next</Btn>
                <Btn onClick={showLast}>last</Btn>
            </div>
        </>
    )
};

export default Characters;