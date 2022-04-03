import axios from "axios";
import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_SINGLE_CHAR, hash } from "../api";
import { ICharacter } from "../types_store/CharatersType";

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
    }
`;

function CharactersDetail() {

    const charMatch = useMatch('/characters/detail/:id');

    const [char, setChar] = useState<ICharacter>();

    const fetchSingleCharacter = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_SINGLE_CHAR}/${charMatch?.params.id}?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setChar(res.data);
            });
    };

    useEffect(() => {
        fetchSingleCharacter();
    }, [])

    return (
        <>  
            <Portrait 
            path={`${char?.data.results[0].thumbnail.path}/portrait_uncanny.jpg`}
            >
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
        </>
    )
};

export default CharactersDetail;