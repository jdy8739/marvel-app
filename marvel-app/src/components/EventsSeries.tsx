import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { apikey, BASE_URL, GET_EVENTS, hash } from "../api";
import { ISeries } from "../types_store/SeriesType";
import { LeftArrow, RightArrow, Wrapper } from "./CharacterComics";
import { SeriesElem, ShowMoreBtn } from "./CharacterSeries";

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

const a = { position: 'absolute', left: '0', right: '0', margin: 'auto' };

const LIMIT = 20;

function EventSeries({ id }: { id: string }) {

    const [series, setSeries] = useState<ISeries>();

    const [offsetCnt, setOffsetCnt] = useState(0);

    const fetchEventSeries = () => {
        axios.get<ISeries>(
            `${BASE_URL}${GET_EVENTS}/${id}/comics?ts=1&apikey=${apikey}&hash=${hash
            }&offset=${offsetCnt * LIMIT}`)
            .then(res => {
                setSeries(res.data);
            });
    };

    useEffect(() => {
        fetchEventSeries();
    }, [offsetCnt]);

    const plusOffsetCnt = () => {
        setOffsetCnt(offsetCnt => offsetCnt + 1);
    };

    return (
        <>
            <Wrapper style={{ 
                position: 'relative',
                maxWidth: '1950px'
            }}
            >
                <AnimatePresence>
                    {
                        series?.data.results.
                        slice(0, 7).map(seriesElem => {
                            return (
                                <motion.span
                                key={seriesElem.id}
                                layoutId={seriesElem.id + ''}
                                >
                                    <SeriesElem
                                    path={seriesElem.thumbnail.path + "/standard_amazing.jpg"}
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
                    />
                </RightArrowBox>
            </Wrapper>
            <br></br>
            <br></br>
            <ShowMoreBtn onClick={plusOffsetCnt}>show more</ShowMoreBtn>
        </>
    )
};

export default EventSeries;