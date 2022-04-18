import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { ISeriesResult } from "../types_store/SeriesType";
import { LeftArrow, RightArrow, Wrapper } from "./CharacterComics";
import { SeriesElem } from "./CharacterSeries";

const LeftArrowBox = styled.div`
    width: 70px;
    height: 100%;
    position: absolute;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
`;

const RightArrowBox = styled.div`
    width: 70px;
    height: 100%;
    position: absolute;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
`;

const SLIDES_LIMIT = 6;

function EventsSeriesSlides({ slidesElements }: { slidesElements: ISeriesResult[] }) {

    const [count, setCount] = useState(0);

    const showNext = () => setCount(cnt => {
        return cnt + 1 === Math.floor(
            slidesElements.length / SLIDES_LIMIT) ? 0 : cnt + 1
    });

    return (
        <Wrapper style={{ 
            position: 'relative',
            maxWidth: '1950px',
        }}
        >
            <AnimatePresence>
                {
                    slidesElements.slice(
                    count * SLIDES_LIMIT, count * SLIDES_LIMIT + SLIDES_LIMIT)
                    .map(slide => {
                        return (
                            <motion.span
                            key={slide.id}
                            layoutId={slide.id + ''}
                            >
                                <SeriesElem
                                path={slide.thumbnail.path + "/standard_amazing.jpg"}
                                >
                                </SeriesElem>    
                            </motion.span>
                        )
                    })
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

export default EventsSeriesSlides;