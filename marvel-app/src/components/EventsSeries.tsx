import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { apikey, BASE_URL, GET_EVENTS, hash } from "../api";
import { ISeries } from "../types_store/SeriesType";
import { ShowMoreBtn } from "./CharacterSeries";
import EventsSeriesSlides from "./EventsSeriesSlides";

const SeriesFlexBox = styled.div`
    display: flex;
`;

const LIMIT = 18;

function EventSeries({ id }: { id: string }) {

    const [series, setSeries] = useState<ISeries>();

    const [offsetCnt, setOffsetCnt] = useState(0);

    const fetchEventSeries = () => {
        axios.get<ISeries>(
            `${BASE_URL}${GET_EVENTS}/${id}/comics?ts=1&apikey=${apikey}&hash=${hash
            }&offset=${offsetCnt * LIMIT}&limit=${LIMIT}`)
            .then(res => {
                console.log(res.data);
                setSeries(series => {
                    if(!series) return res.data;
                    else {
                        const copied = {...series};
                        copied.data.results = 
                            copied.data.results.concat(res.data.data.results);
                        return copied;
                    };
                });
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
            {
                series?.data.results.map((seriesElem, i) => {
                    return (
                        <SeriesFlexBox key={i}>
                            {
                                series.data.results.length / LIMIT < i ? null :
                                <EventsSeriesSlides
                                slidesElements={series?.data.results.slice(i * LIMIT, i * LIMIT + LIMIT)}
                                />
                            }
                        </SeriesFlexBox>
                    )
                })
            }
            <br></br>
            <br></br>
            <ShowMoreBtn onClick={plusOffsetCnt}>show more</ShowMoreBtn>
        </>
    )
};

export default EventSeries;