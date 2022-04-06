import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apikey, BASE_URL, GET_COMICS, hash } from "../api";
import { Blank, Btn, CharName, ComicsFrameForm, Container } from "../styled";
import { IComics } from "../types_store/ComicsType";

let cnt = 0;

const LIMIT = 12;

function Comics() {

    const [comics, setComics] = useState<IComics>();

    const fetchComics = function() {
        axios.get<IComics>(`${BASE_URL}${GET_COMICS}&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setComics(res.data);
            });
    };

    let TOTAL = 0;
    if(comics?.data.total) TOTAL = comics.data.total;

    const showAnotherPage = (e: React.MouseEvent<HTMLButtonElement>) => {
        cnt = +e.currentTarget.innerText - 1;
        fetchMoreComics(cnt);
    };

    const fetchFirst = () => {
        cnt = 0;
        fetchMoreComics(cnt);
    };

    const fetchLast = () => {
        if(TOTAL) {
            cnt = Math.floor(TOTAL / LIMIT);
            fetchMoreComics(cnt);
        };
    };

    const fetchPrevious = () => {
        cnt --;
        fetchMoreComics(cnt);
    };

    const fetchNext = () => {
        cnt ++;
        fetchMoreComics(cnt);
    };

    const fetchMoreComics = function(cnt: number) {
        axios.get<IComics>(`${BASE_URL}${GET_COMICS}&apikey=${apikey}&hash=${hash}&offset=${cnt * LIMIT}&limit=${LIMIT}`)
            .then(res => {
                setComics(res.data);
            });
    };

    useEffect(() => {
        fetchComics();
    }, []);

    const nav = useNavigate();

    const toComicsDetailPage = (id: number) => {
        nav(`/comics/detail/${id}`);
    };

    return (
        <>
            <Blank />
            <Container>
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
                >next</Btn>
                <Btn
                onClick={fetchLast}
                >last</Btn>
            </div>
        </>
    )
};

export default Comics;