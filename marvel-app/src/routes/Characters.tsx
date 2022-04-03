import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { apikey, BASE_URL, GET_CHAR, GET_SEARCHED_CHAR, hash } from "../api";
import { CharacterCard, CharacterContainer } from "../styled";
import { ICharacter } from "../types_store/CharatersType";


let cnt = 0;

const LIMIT = 30;

function Characters() {

    const [chars, setChars] = useState<ICharacter>();

    const getChars = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_CHAR}&apikey=${apikey}&hash=${hash}&limit=${LIMIT}&offset=${cnt * LIMIT}`)
            .then(res => {
                setChars(res.data);
                console.log(res.data);
            });
    };

    const total = chars?.data.total;

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
        getChars();
    }, []);

    const [searchedChar, setSearchedChar] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedChar(e.currentTarget.value);
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getSearchedChars();
        setIsSearched(true);
        cnt = 0;
    };

    const getSearchedChars = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_SEARCHED_CHAR}${searchedChar}&apikey=${apikey}&hash=${hash}&limit=${LIMIT}&offset=${cnt * LIMIT}`)
            .then(res => {
                setChars(res.data);
                console.log(res.data);
            });
    };

    const [isSearched, setIsSearched] = useState(false);

    const fetchCharacters = () => {
        if(isSearched) getSearchedChars();
        else getChars();
    };

    const resetSearch = () => {
        setSearchedChar('');
        setIsSearched(false);
        getChars();
    };

    return (
        <>  
            <CharacterContainer>
                {
                    chars?.data.results.map(char => {
                        return (
                            <CharacterCard key={char.id}>
                                <h1>{ char.name }</h1>
                                <img src={`${char.thumbnail.path}/portrait_medium.jpg`} />
                            </CharacterCard>
                        )
                    })
                }
            </CharacterContainer>
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
                                >{ Math.floor(cnt + idx) + 1 }</button>
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
        </>
    )
};

export default Characters;