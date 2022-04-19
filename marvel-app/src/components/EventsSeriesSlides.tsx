import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { modalVariant } from "../routes/Comics";
import { Modal, ModalBackground, ModelImage, Title } from "../styled";
import { ISeriesResult } from "../types_store/SeriesType";
import { LeftArrow, RightArrow, Wrapper } from "./CharacterComics";
import { SeriesElem } from "./CharacterSeries";

const LeftArrowBox = styled.div`
    width: 55px;
    height: 95%;
    position: absolute;
    left: 0;
    background-color: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    border-radius: 0px 16px 16px 0px;
`;

const RightArrowBox = styled.div`
    width: 55px;
    height: 95%;
    position: absolute;
    right: 0;
    background-color: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    border-radius: 16px 0px 0px 16px;
`;

const SeriesSlides = styled(motion.span)`
    display: flex;
`;

const SLIDES_LIMIT = 6;

function EventsSeriesSlides({ slidesElements }: { slidesElements: ISeriesResult[] }) {

    const [count, setCount] = useState(0);

    const showNext = () => setCount(cnt => {
        if(slidesElements.length <= SLIDES_LIMIT) return 0;
        return cnt + 1 === Math.ceil(
            slidesElements.length / SLIDES_LIMIT) ? 0 : cnt + 1
    });

    const showPrevious = () => setCount(cnt => {
        if(slidesElements.length <= SLIDES_LIMIT) return 0;
        return cnt - 1 === -1 ? Math.ceil(
            slidesElements.length / SLIDES_LIMIT) - 1 : cnt - 1
    });

    const [clickedSeries, setClickedSeries] = useState<ISeriesResult | null>();

    const showModal = (id: number) => {
        setClickedSeries(() => {
            return slidesElements.find(slide => slide.id === id);
        });
    };

    const hideModal = () => setClickedSeries(null);

    const toSeriesDetailPage = 
        (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

    const nav = useNavigate();

    return (
        <Wrapper style={{ 
            position: 'relative',
            maxWidth: '1950px',
            width: '100%',
            marginBottom: '30px'
        }}
        >
            <AnimatePresence>
                {
                    slidesElements
                    //.slice(count * SLIDES_LIMIT, count * SLIDES_LIMIT + SLIDES_LIMIT)
                    .map((slide, i) => {
                        return (
                            <SeriesSlides
                            key={slide.id}
                            layoutId={slide.id + ''}
                            >
                                {
                                    count * SLIDES_LIMIT <= i && 
                                    i < count * SLIDES_LIMIT + SLIDES_LIMIT ?
                                    <SeriesElem
                                    path={slide.thumbnail.path + "/standard_amazing.jpg"}
                                    onClick={() => showModal(slide.id)}
                                    >
                                    </SeriesElem> : null 
                                }  
                            </SeriesSlides>
                        )
                    })
                }
                {
                    !clickedSeries ? null :
                    <ModalBackground
                    onClick={hideModal}
                    variants={modalVariant}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    >
                        <Modal
                        layoutId={clickedSeries.id + ''}
                        onClick={toSeriesDetailPage}
                        >
                            <ModelImage
                            path={clickedSeries.thumbnail.path + "/standard_fantastic.jpg"}
                            >
                                <Title>{ clickedSeries.title }</Title>   
                            </ModelImage>
                            <h5
                            style={{ textAlign: 'center' }}>{ clickedSeries.description ? 
                            clickedSeries.description.length > 100 ? 
                            clickedSeries.description.slice(0, 150) + '...' : 
                            clickedSeries.description
                            : 'No Descriptions' }
                            </h5>
                        </Modal>
                    </ModalBackground>
                }
            </AnimatePresence>
            <LeftArrowBox>
                <LeftArrow
                style={{ 
                    position: 'absolute', 
                    left: '0', 
                    right: '0', 
                    margin: 'auto'
                }}
                src={require('../images/arrow.png')}
                onClick={showPrevious}
                />
            </LeftArrowBox>
            <RightArrowBox>
                <RightArrow 
                style={{ 
                    position: 'absolute', 
                    left: '0', 
                    right: '0', 
                    margin: 'auto'
                }}
                src={require('../images/arrow.png')}
                onClick={showNext}
                />
            </RightArrowBox>
        </Wrapper>
    )
};

export default React.memo(EventsSeriesSlides);