import axios from "axios";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_COMICS, hash } from "../api";
import { Blank, Btn, CharName, ComicsFrameForm, Container, DateChooseModal, Input, ModalBackground } from "../styled";
import { IComics } from "../types_store/ComicsType";

const DateForm = styled.form`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
`;

const P = styled.p`
    width: 100%;
    text-align: center;
`;

const modalVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 1
        }
    }
};

let cnt = 0;

const LIMIT = 12;

function Comics() {

    const [comics, setComics] = useState<IComics>();

    const location = useLocation();

    const date = new URLSearchParams(location.search).get('dateRange')?.split(',', 2);

    let formerDate = date ? date[0] : '';

    let latterDate = date ? date[1] : '';

    const [startDate, setStartDate] = useState('');

    const [toDate, setToDate] = useState('');

    const fetchComics = function(pageNum: number = cnt) {
        axios.get<IComics>(
            `${BASE_URL}${GET_COMICS}&apikey=${apikey}&hash=${hash}&offset=${pageNum * LIMIT}&limit=${LIMIT}${
                latterDate ? `&dateRange=${formerDate},${latterDate}` : ''}`
            )
            .then(res => {
                setComics(res.data);
            });
    };

    let TOTAL = 0;
    if(comics?.data.total) TOTAL = comics.data.total;

    const showAnotherPage = (e: React.MouseEvent<HTMLButtonElement>) => {
        cnt = +e.currentTarget.innerText - 1;
        fetchComics(cnt);
    };

    const fetchFirst = () => {
        cnt = 0;
        fetchComics(cnt);
    };

    const fetchLast = () => {
        if(TOTAL) {
            cnt = Math.floor(TOTAL / LIMIT);
            fetchComics(cnt);
        };
    };

    const fetchPrevious = () => {
        cnt --;
        fetchComics(cnt);
    };

    const fetchNext = () => {
        cnt ++;
        fetchComics(cnt);
    };

    useEffect(() => {
        fetchComics();
    }, []);

    const nav = useNavigate();

    const toComicsDetailPage = (id: number) => {
        nav(`/comics/detail/${id}`);
    };

    const [isDateModalShown, setIsDateModalShown] = useState(false);

    const showDateModal = () => setIsDateModalShown(true);

    const hideDateModal = () => setIsDateModalShown(false);

    const preventBubbling = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleChangeStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.currentTarget.value);
    };

    const handleChangeToDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToDate(e.currentTarget.value);
    };

    const handleDateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!checkDateValid()) return;
        setIsDateModalShown(false);
        nav(`/comics?dateRange=${startDate},${toDate}`);
        changeDateToChosenDate();
        cnt = 0;
        fetchComics(cnt);
    };

    const checkDateValid = () :boolean => {
        if(!startDate || startDate >= toDate) {
            alert('please check whether the date is valid.');
            return false;
        } else return true;
    };

    const changeDateToChosenDate = () => {
        formerDate = startDate;
        latterDate = toDate;
    };

    const searchInput = useRef<HTMLInputElement>(null);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.get<IComics>(
            `${BASE_URL}${GET_COMICS}&apikey=${apikey}&hash=${hash}&title=${searchInput.current?.value}`
            )
            .then(res => {
                setComics(res.data);
            });
    };

    return (
        <>
            <Blank />
            {
                
            }
            <Container>
                <div style={{
                    width: '100%',
                    textAlign: 'right',
                    marginBottom: '4px'
                }}> 
                    <form
                    onSubmit={handleSearchSubmit}
                    >
                        <Input 
                        placeholder="search title you look for."
                        style={{
                            width: '175px'
                        }}
                        required
                        ref={searchInput}
                        />
                        &ensp;
                        <Btn>search</Btn>
                    </form>
                </div>
                <div style={{
                    width: '100%',
                    textAlign: 'right',
                    marginBottom: '28px'
                }}>
                    <Btn onClick={showDateModal}>search by date</Btn>
                </div>
                {
                    comics?.data.results.length === 0 ? <p>Sorry. No data. :(</p> : 
                    <>
                        {
                            comics?.data.results.map(comic => {
                                return (
                                    <ComicsFrameForm
                                    key={comic.id}
                                    path={comic.thumbnail.path + '/portrait_incredible.jpg'}
                                    onClick={() => toComicsDetailPage(comic.id)}
                                    >
                                        <CharName 
                                        length={comic.title.length}
                                        >{ comic.title.length > 20 ? comic.title.slice(0, 20) + '...' : comic.title }</CharName>
                                    </ComicsFrameForm>
                                )
                            })
                        }
                    </>
                }
            </Container>
            <br></br>
            <br></br>
            <div style={{
                textAlign: 'center',
            }}>
                <Btn
                onClick={fetchFirst}
                >first</Btn>
                <Btn
                onClick={fetchPrevious}
                disabled={cnt === 0}
                >prev</Btn>
                {
                    [-3, -2, -1, 0, 1, 2, 3].map(idx => {
                        return (
                            <span key={idx}>
                                {
                                    cnt + idx + 1 < 1 ||
                                    cnt + idx > Math.floor(TOTAL / LIMIT) ? null :
                                    <Btn
                                    onClick={showAnotherPage}
                                    clicked={cnt === Math.floor(cnt + idx)}
                                    >{ cnt + idx + 1 }</Btn>
                                }
                            </span>
                        )
                    })
                }
                <Btn
                onClick={fetchNext}
                disabled={cnt >= TOTAL / LIMIT - 1}
                >next</Btn>
                <Btn
                onClick={fetchLast}
                >last</Btn>
            </div>
            {
                !isDateModalShown ? null :
                <AnimatePresence>
                    <ModalBackground
                    onClick={hideDateModal}
                    variants={modalVariant}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    >
                        <DateChooseModal
                        onClick={preventBubbling}
                        style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <DateForm
                            onSubmit={handleDateSubmit}
                            >
                                <P>from</P>
                                <Input type="date"
                                onChange={handleChangeStartDate}
                                value={startDate}
                                />
                                <P>to</P>
                                <Input type="date"
                                onChange={handleChangeToDate}
                                value={toDate}
                                />
                                <P></P>
                                <Btn>search</Btn>
                            </DateForm>
                        </DateChooseModal>
                    </ModalBackground>
                </AnimatePresence> 
            }
        </>
    )
};

export default Comics;