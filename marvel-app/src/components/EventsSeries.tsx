import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { apikey, BASE_URL, GET_EVENTS, hash } from "../api";
import { ISeries } from "../types_store/SeriesType";
import { Wrapper } from "./CharacterComics";
import { SeriesElem, ShowMoreBtn } from "./CharacterSeries";

const LIMIT = 12;

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
                                >
                                </SeriesElem>    
                            </motion.span>
                        )
                    })
                }
            </Wrapper>
            <br></br>
            <br></br>
            <ShowMoreBtn onClick={plusOffsetCnt}>show more</ShowMoreBtn>
        </>
    )
};

export default EventSeries;