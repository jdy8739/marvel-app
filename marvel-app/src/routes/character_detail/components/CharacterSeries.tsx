import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_ON_CHAR, hash } from "../../../api";
import { Blank, Btn, Loading, Modal, ModalBackground, ModelImage, Title } from "../../../styled";
import { ISeries, ISeriesResult } from "../../../types_store/SeriesType";

export const SeriesElem = styled(motion.div)<{ path?: string }>`
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

export const ShowMoreBtn = styled(Btn)`
    width: 130px;
    display: block;
    margin: auto;
    &:active {
        background-color: white;
    }
`;

export const Years = styled.h5`
    position: absolute;
    bottom: 3px;
    margin: 0;
    right: 3px;
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

const LIMIT = 12;

function CharacterSeries({ id }: { id: string }) {

    const SUBJECT = 'series'

    let onAniComplete = false;

    const [isLoading, setIsLoading] = useState(true);

    const [clickedSeries, setClickedSeries] = useState<ISeriesResult | null>();

    const [offset, setOffset] = useState(0);

    const [series, setSeries] = useState<ISeries>();

    const titleRef = useRef<HTMLHeadingElement>(null);

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSeriesContainingCharacter();
    }, [offset]);

    useEffect(() => {
        if(clickedSeries && modalRef.current) {
            modalRef.current.addEventListener(
                'mouseover', changeWordToClick);
            modalRef.current.addEventListener(
                'mouseout', changeWordToOriginalTItle);
        };
        return () => {
            if(modalRef.current) {
                modalRef.current.addEventListener(
                    'mouseover', changeWordToClick);
                modalRef.current.addEventListener(
                    'mouseout', changeWordToOriginalTItle);
            };
        };
    }, [clickedSeries]);

    const changeWordToClick = () => {
        if(titleRef.current) {
            titleRef.current.textContent = 'Click to see detail on this series.'
        };
    };

    const changeWordToOriginalTItle = () => {
        if(titleRef.current) {
            titleRef.current.textContent = clickedSeries?.title || '';
        };
    };

    const fetchSeriesContainingCharacter = () => {
        if(checkCntBiggerThanTotal()) return;

        if(!isLoading) changeIsLoadingStatus();

        axios.get<ISeries>(
            `${BASE_URL}${GET_ON_CHAR}/${ id }/${SUBJECT}?ts=1&apikey=${apikey}&hash=${hash
            }&offset=${offset * LIMIT}&limit=${LIMIT}`)
            .then(res => {
                setSeries(series => {
                    if(!series) setSeries(res.data);
                    else {
                        const copied = { ...series };
                        copied.data.results.splice(
                            copied.data.results.length, 0, ...res.data.data.results);
                        return copied;
                    };
                });
                changeIsLoadingStatus();
            });
    };

    const changeIsLoadingStatus = () => setIsLoading(now => !now);

    const nav = useNavigate();

    const toSeriesDetailPage = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        nav('/series/detail/' + clickedSeries?.id);
    };

    const showModal = (id: number) => {
        onAniComplete = false;
        setClickedSeries(() => {
            return series?.data.results.find(
                seriesElem => seriesElem.id === id);
        });
    };

    const hideModal = () => {
        if(onAniComplete) setClickedSeries(null);
    };

    const checkCntBiggerThanTotal = () :boolean => {
        if(series?.data.total) {
            if(offset * LIMIT > series?.data.total) {
                alert('No More to show!');
                return true;
            } else return false;
        };
        return false;
    };

    return (
        <>
            { isLoading ? <Loading src={require('../../../images/giphy.gif')}/> : null }

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
                    <br></br>
                    <ShowMoreBtn
                    onClick={() => setOffset(offset => offset + 1)}
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
                                    ref={modalRef}
                                    onClick={toSeriesDetailPage}
                                    layoutId={clickedSeries.id + ''}
                                    >
                                        <ModelImage
                                        path={clickedSeries.thumbnail.path + "/standard_fantastic.jpg"}
                                        >
                                            <Title
                                            //ref={titleRef}
                                            >{ clickedSeries.title }</Title>
                                        </ModelImage>
                                        <h5 
                                        style={{ textAlign: 'center' }}>{ clickedSeries.description ? 
                                        clickedSeries.description.length > 100 ? clickedSeries.description.slice(0, 150) + '...' : 
                                        clickedSeries.description
                                        : 'No Descriptions' }</h5>
                                        <Years>{ 
                                        clickedSeries.startYear + "-" + clickedSeries.endYear }</Years>
                                    </Modal>
                                </ModalBackground>
                        }
                    </AnimatePresence>
                </>
            }
            <Blank />
        </>
    )
};

export default CharacterSeries;