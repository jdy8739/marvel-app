import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { apikey, BASE_URL, GET_ON_CHAR, hash } from "../api";
import { Btn, Modal, ModalBackground, ModelImage } from "../styled";
import { ISeries, SeriesResult } from "../types_store/SeriesType";

const SeriesElem = styled(motion.div)<{ path?: string }>`
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
        z-index: 98;
    }
    cursor: pointer;
    transition: all 0.3s;
`;

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 50%;
    margin: auto;
`;

const ShowMoreBtn = styled(Btn)`
    width: 130px;
    display: block;
    margin: auto;
    &:active {
        background-color: white;
    }
`;

const modalVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 1
        }
    }
};

let cnt = 1;

function CharacterSeries({ id }: { id: string }) {

    const SUBJECT = 'series'

    let onAniComplete = false;

    const [series, setSeries] = useState<ISeries>();

    useEffect(() => {
        fetchSeriesContainingCharacter();
        return () => {
            cnt = 1;
        };
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
        onAniComplete = false;
        setClickedSeries(() => {
            return series?.data.results.find(seriesElem => seriesElem.id === id);
        });
    };

    const hideModal = () => {
        if(onAniComplete) setClickedSeries(null);
    };

    const fetchMoreSeries = () => {
        if(checkCntBiggerThanTotal()) return;
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

    const checkCntBiggerThanTotal = () :boolean => {
        if(series?.data.total) {
            if(cnt * 12 > series?.data.total) {
                alert('No More to show!');
                return true;
            } else return false;
        };
        return false;
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
                                            <motion.span
                                            key={seriesElem.id}
                                            layoutId={seriesElem.id + ''}
                                            >
                                                <SeriesElem
                                                path={seriesElem.thumbnail.path + "/standard_amazing.jpg"}
                                                onClick={() => showModal(seriesElem.id)}
                                                >
                                                </SeriesElem>    
                                            </motion.span>
                                        )
                                    })
                                }
                            </Wrapper>
                            <br></br>
                            <ShowMoreBtn
                            onClick={fetchMoreSeries}
                            >show more</ShowMoreBtn>
                            <AnimatePresence>
                                {
                                    !clickedSeries ? null :
                                        <ModalBackground
                                        onClick={hideModal}
                                        variants={modalVariant}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        onAnimationComplete={() => onAniComplete = true}
                                        >
                                            <Modal
                                            onClick={preventBubbling}
                                            layoutId={clickedSeries.id + ''}
                                            >
                                                <ModelImage
                                                path={clickedSeries.thumbnail.path + "/standard_fantastic.jpg"}
                                                />
                                            </Modal>
                                        </ModalBackground>
                                }
                            </AnimatePresence>
                        </>
                    }
                </>
            }
            <div style={{ height: '100px' }}></div>
        </>
    )
};

export default CharacterSeries;