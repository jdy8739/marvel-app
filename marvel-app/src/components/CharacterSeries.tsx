import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { apikey, BASE_URL, GET_ON_CHAR, hash } from "../api";
import { Btn, Modal, ModalBackground } from "../styled";
import { ISeries, SeriesResult } from "../types_store/SeriesType";

const SeriesElem = styled(motion.div)<{ path: string }>`
    background-image: url(${ props => props.path });
    width: 180px;
    height: 180px;
    background-position: center center;
    background-size: cover;
    margin: 5px;
    filter: grayscale(1);
    opacity: 0.4;
    &:hover {
        filter: grayscale(0);
        opacity: 1;
    }
    cursor: pointer;
    transition: all 0.3s;
`;

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 38%;
    margin: auto;
`;

const ShowMoreBtn = styled(Btn)`
    width: 130px;
    display: block;
    margin: auto;
`;

const modalVariant = {
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3
        }
    }
};

let cnt = 1;

function CharacterSeries({ id }: { id: string }) {

    const SUBJECT = 'series'

    const [series, setSeries] = useState<ISeries>();

    useEffect(() => {
        fetchSeriesContainingCharacter();
    }, []);

    const fetchSeriesContainingCharacter = () => {
        axios.get<ISeries>(`${BASE_URL}${GET_ON_CHAR}/${ id }/${SUBJECT}?ts=1&apikey=${apikey}&hash=${hash}&limit=12`)
            .then(res => {
                setSeries(res.data);
                setIsLoading(false);
            });
    };

    const [isLoading, setIsLoading] = useState(true);

    const [clickedSeries, setClickedSeries] = useState<SeriesResult | null>();

    const preventBubbling = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

    const showModal = (id: number) => {
        setClickedSeries(() => {
            return series?.data.results.find(seriesElem => seriesElem.id === id);
        });
    };

    const fetchMore = () => {
        cnt ++;
        axios.get<ISeries>(
            `${BASE_URL}${GET_ON_CHAR}/${ id }/${SUBJECT}?ts=1&apikey=${apikey}&hash=${hash}&limit=12&offset=${(cnt - 1) * 12}`
            )
            .then(res => {
                setSeries(series => {
                    if(series) {
                        const copied = { ...series };
                        copied.data?.results.splice(copied.data.results.length, 0,
                            ...res.data.data.results
                            );
                        return copied;
                    };
                });
            });
    };

    return (
        <>
            {
                isLoading ? <p style={{ textAlign: 'center' }}>loading... please wait.</p> :
                <>
                    {
                        series?.data.results.length === 0 ? 
                        <p style={{ textAlign: 'center' }}>sorry. no data. :(</p> :
                        <>
                            <Wrapper>
                                {
                                    series?.data.results.map(seriesElem => {
                                        return (
                                            <SeriesElem 
                                            key={seriesElem.id}
                                            path={seriesElem.thumbnail.path + "/standard_amazing.jpg"}
                                            onClick={() => showModal(seriesElem.id)}
                                            layoutId={seriesElem.id + ''}
                                            >
                                            </SeriesElem>
                                        )
                                    })
                                }
                            </Wrapper>
                            <br></br>
                            <ShowMoreBtn
                            onClick={fetchMore}
                            >show more</ShowMoreBtn>
                            {
                                !clickedSeries ? null :
                                <AnimatePresence>
                                    <ModalBackground
                                    onClick={() => setClickedSeries(null)}
                                    >
                                        <Modal
                                        onClick={preventBubbling}
                                        layoutId={clickedSeries.id + ''}
                           
                                        >
                                            <p>{clickedSeries.title}</p>
                                        </Modal>
                                    </ModalBackground>
                                </AnimatePresence>
                            }
                        </>
                    }
                </>
            }
            <div style={{ height: '100px' }}></div>
        </>
    )
};

export default CharacterSeries;