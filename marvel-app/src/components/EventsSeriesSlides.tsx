import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import { ISeriesResult } from "../types_store/SeriesType";
import { LeftArrow, RightArrow, Wrapper } from "./CharacterComics";
import { SeriesElem } from "./CharacterSeries";

const LeftArrowBox = styled.div`
    width: 70px;
    height: 95%;
    position: absolute;
    left: 0;
    background-color: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
`;

const RightArrowBox = styled.div`
    width: 70px;
    height: 95%;
    position: absolute;
    right: 0;
    background-color: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
`;

const SeriesSlides = styled(motion.span)`
    display: flex;
`;

const SLIDES_LIMIT = 6;

function EventsSeriesSlides({ slidesElements }: { slidesElements: ISeriesResult[] }) {

    const [count, setCount] = useState(0);

    const showNext = () => setCount(cnt => {
        if(slidesElements.length < 7) return 0;
        return cnt + 1 === Math.floor(
            slidesElements.length / SLIDES_LIMIT) ? 0 : cnt + 1
    });

    const showPrevious = () => setCount(cnt => {
        if(slidesElements.length < 7) return 0;
        return cnt - 1 === -1 ? Math.floor(
            slidesElements.length / SLIDES_LIMIT) - 1 : cnt - 1
    });

    const slidesVariant = {
        initial: {
            x: -window.outerWidth,
            transition: {
                duration: 2
            }
        },
        animate: {
            x: 0,
            transition: {
                duration: 2
            }
        },
        exit: {
            x: window.outerWidth,
            transition: {
                duration: 2
            }
        }
    };

    return (
        <Wrapper style={{ 
            position: 'relative',
            maxWidth: '1950px',
            width: '100%',
            marginBottom: '30px'
        }}
        >
            <AnimatePresence>
                <SeriesSlides>
                    {
                        slidesElements.slice(
                        count * SLIDES_LIMIT, count * SLIDES_LIMIT + SLIDES_LIMIT)
                        .map(slide => {
                            return (
                                <motion.span
                                key={slide.id}
                                layoutId={slide.id + ''}
                                variants={slidesVariant}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                >
                                    <SeriesElem
                                    path={slide.thumbnail.path + "/standard_amazing.jpg"}
                                    >
                                    </SeriesElem>    
                                </motion.span>
                            )
                        })
                    }
                </SeriesSlides>
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