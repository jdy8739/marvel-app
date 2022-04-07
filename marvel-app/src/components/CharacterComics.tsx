import axios from "axios";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_ON_CHAR, hash } from "../api";
import { Btn, ComicsCard, Input } from "../styled";
import { IComics } from "../types_store/ComicsType";

export const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    max-width: 750px;
    min-width: 300px;
    margin: auto;
`;

export const LeftArrow = styled.img`
    position: absolute;
    left: 0;
    transform: rotateY(180deg);
    width: 40px;
    height: 50px;
    cursor: pointer;
    opacity: 0.3;
    &:hover {
        opacity: 0.7;
    }
`;

export const RightArrow = styled.img`
    position: absolute;
    right: 0;
    width: 40px;
    height: 50px;
    cursor: pointer;
    opacity: 0.3;
    &:hover {
        opacity: 0.7;
    }
`;

function CharacterComics({ id }: { id: string }) {

    const [comics, setComics] = useState<IComics>();

    const [isLoading, setIsLoading] = useState(true);

    const fetchComicsContainingCharacter = () => {
        axios.get(
            `${BASE_URL}${GET_ON_CHAR}/${ id }/comics?ts=1&apikey=${apikey}&hash=${hash}&limit=12`
            )
            .then(res => {
                setComics(res.data);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchComicsContainingCharacter();
    }, []);

    const [visible, setVisible] = useState(0);

    const showPrev = () => {
        setIsBack(true);
        setVisible(visible => {
                if(comics?.data.results) {
                    return visible - 1 < 0 ? comics.data.results.length - 1 : visible - 1;  
                } else return 0;
            }
        )
    };

    const showNext = () => {
        setIsBack(false);
        setVisible(visible => {
            if(comics?.data.results) {
                return visible + 1 === comics.data.results.length ? 0 : visible + 1;  
            } else return 0;
        }
    )
    };

    const [isBack, setIsBack] = useState(false);

    const SlideVariant = {
        start: (isBack: boolean) => ({
            x: isBack ? -80 : 80,
            opacity: 0,
            scale: 0.75,
            transition: {
                duration: 1
            }
        }),
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1
            }
        },
        leave: (isBack: boolean) => ({
            x: isBack ? 80 : -80,
            opacity: 0,
            scale: 0.75,
            transition: {
                duration: 1
            }
        })
    };

    const [dateFrom, setDateFrom] = useState('');

    const [dateTo, setDateTo] = useState('');

    const handleDateFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFrom(e.currentTarget.value);
    };

    const handleDateTo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateTo(e.currentTarget.value);
    };

    const handleDateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!dateFrom || dateFrom >= dateTo) {
            alert('Please check the date. :(');
            return;
        };

        setIsLoading(true);
        axios.get(
            `${BASE_URL}${GET_ON_CHAR}/${ id }/comics?ts=1&apikey=${apikey}&hash=${hash}&limit=12&dateRange=${dateFrom},${dateTo}`
            )
            .then(res => {
                setComics(res.data);
                console.log(res.data);
                setIsLoading(false);
            });
    };

    const nav = useNavigate();

    return (
        <>  
            {
                isLoading ? <p style={{ textAlign: 'center' }}>loading... please wait.</p> :
                <>
                    {
                        comics?.data.results.length === 0 ? 
                        <p style={{ textAlign: 'center' }}>cannot find any data :(</p> : 
                        <>
                            <p style={{
                                textAlign: 'center'
                            }}
                            >This character is contained in these comics.</p>
                            <Wrapper>
                                <AnimatePresence 
                                exitBeforeEnter
                                custom={isBack}
                                >
                                    {
                                        comics?.data.results.map((comic, i) => {
                                            return (
                                                visible === i ? 
                                                <span
                                                key={comic.id}
                                                >
                                                    <ComicsCard
                                                    key={comic.id}
                                                    path={`${ comic.thumbnail.path }/portrait_incredible.jpg`}
                                                    variants={SlideVariant}
                                                    initial="start"
                                                    animate="animate"
                                                    exit="leave"
                                                    custom={isBack}
                                                    onClick={() => nav('/comics/detail/' + comic.id)}
                                                    >
                                                    </ComicsCard>
                                                    <h4 style={{
                                                        textAlign: 'center'
                                                    }}>{ comic.title }</h4>
                                                </span>
                                                : null
                                            )
                                        })
                                    }
                                </AnimatePresence>
                                <LeftArrow
                                src={require('../images/arrow.png')}
                                onClick={showPrev} />
                                <RightArrow 
                                src={require('../images/arrow.png')}
                                onClick={showNext} 
                                />
                            </Wrapper>
                        </>
                    }
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '100px'
                    }}>
                        <br></br>
                        <br></br>
                        <p>find by date if there are no data you find above.</p>
                        <form onSubmit={handleDateSubmit}>
                            <label>
                                <span>from </span>
                                <Input 
                                type="date"
                                onChange={handleDateFrom}
                                />
                            </label>
                            &ensp;
                            <label>
                                <span>to </span>
                                <Input 
                                type="date"
                                onChange={handleDateTo}
                                />
                            </label>
                            &ensp;
                            <Btn>search</Btn>
                        </form>
                    </div>
                </>
            }
        </>
    )
};

export default CharacterComics;