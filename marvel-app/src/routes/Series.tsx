import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_SERIES, hash } from "../api";
import { Blank, Btn, CharName, Container } from "../styled";
import { ISeries } from "../types_store/SeriesType";

const SeriesFrame = styled.div<{ path: string }>`
    width: 175px;
    height: 175px;
    background-image: linear-gradient(to top, #2b2b2b, transparent), 
    url(${ props => props.path });
    margin: 8px;
    border: 1px solid black;
    transition: all 1s;
    &:hover {
        border: 1px solid #F0131E;
        border-radius: 25%;
        background-image: linear-gradient(to top, #aaaaaa, transparent),
         url(${ props => props.path });
        ${CharName} {
            color: #F0131E;
            opacity: 1;
        }
    }
    position: relative;
`;

let cnt = 1;

const LIMIT = 20;

function Series() {

    const [series, setSeries] = useState<ISeries>();

    const location = useLocation();

    const nowPage: string = new URLSearchParams(location.search).get('page') || '';

    if(nowPage) cnt = +nowPage;

    const fetchSeries = function() {
        axios.get<ISeries>(`${BASE_URL}${GET_SERIES}?ts=1&apikey=${apikey}&hash=${hash}&offset=${
            (cnt - 1) * LIMIT}&limit=${LIMIT}
        }`)
            .then(res => {
                setSeries(res.data);
            })
    
    };

    useEffect(() => {
        fetchSeries();
    }, []);

    const nav = useNavigate();

    const showNext = () => {
        cnt ++;
        nav('/series?page=' + cnt);
        fetchSeries();
    };

    return (
        <>
            <Blank />
            <Container>
            {
                series?.data.results.map(seriesElem => {
                    return (
                        <span 
                        key={seriesElem.id}
                        >
                            <SeriesFrame
                            path={seriesElem.thumbnail.path + '/standard_xlarge.jpg'}
                            >
                                <CharName
                                length={seriesElem.title.length || 0}
                                >
                                    {
                                        seriesElem.title.length > 18 ? 
                                        seriesElem.title.slice(0, 18) + '...' :
                                        seriesElem.title
                                    }
                                </CharName>
                            </SeriesFrame>
                        </span>
                    )
                })
            }
            </Container>
            <div style={{
                textAlign: 'center'
            }}>
                <Btn
                onClick={showNext}
                >next</Btn>
            </div>
        </>
    )
};

export default Series;