import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_CHAR, GET_SEARCHED_CHAR, hash } from "../api";
import { Highlighted, CharacterCard, CharacterContainer } from "../styled";
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

    const [searchedChar, setSearchedChar] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedChar(e.currentTarget.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        nav('/characters?startWith=' + searchedChar);
        getSearchedChars();
        cnt = 0;
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
        setSearchedChar('');
        getChars();
        nav('/characters');
        cnt = 0;
    };

    const nav = useNavigate();

    return (
        <>  
            {
                !startWith ? null :
                <h1 style={{
                    textAlign: 'center'
                }}>Results for "<Highlighted>{ startWith }</Highlighted>"</h1>
            }
            <CharacterContainer>
                {
                    chars?.data.results.map(char => {
                        return (
                            <CharacterCard 
                            key={char.id}
                            onClick={() => nav(`/characters/detail/${char.id}`)}
                            >
                                <h1>{ char.name }</h1>
                                <img src={`${char.thumbnail.path}/portrait_medium.jpg`} />
                            </CharacterCard>
                        )
                    })
                }
            </CharacterContainer>
            <div style={{
                textAlign: 'center'
            }}>
                <button onClick={showFirst}>first</button>
                <button 
                onClick={showPrevious}
                disabled={cnt === 0}
                >prev</button>
                {
                    [-3, -2, -1, 0, 1, 2, 3].map(idx => {
                        return (
                            <span key={idx}>
                                {
                                    !total ? null :
                                    cnt + idx < 0 ? null :
                                    cnt + idx > Math.floor(total / LIMIT) ? null :
                                    <button 
                                    onClick={() => showCharsOfIndex(cnt + idx)}
                                    >
                                        { 
                                            cnt === Math.floor(cnt + idx) ? 
                                            <Highlighted>{ Math.floor(cnt + idx) + 1}</Highlighted> :
                                            <>{ Math.floor(cnt + idx) + 1}</>
                                        }
                                    </button>
                                }
                            </span>
                        )
                    })
                }
                <button 
                onClick={showNext}
                disabled={total ? cnt === Math.floor(total / LIMIT) : false}
                >next</button>
                <button onClick={showLast}>last</button>
                <form onSubmit={handleSearchSubmit}>
                    <label>
                        <span>Search the characters start with</span>
                        <input 
                        onChange={handleSearchChange} 
                        value={searchedChar}
                        required
                        />
                    </label>
                </form>
                <button onClick={resetSearch}>reset</button>
            </div>
        </>
    )
};

export default Characters;