import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { apikey, BASE_URL, GET_ON_CHAR, hash } from "../api";
import { Highlighted } from "../styled";
import { IEvents } from "../types_store/EventsType";
import { LeftArrow, RightArrow, Wrapper } from "./CharacterComics";


export const EventCard = styled(motion.div)<{ path: string }>`
    width: 320px;
    height: 230px;
    background-image: url(${ props => props.path });
    background-position: center center;
    background-size: cover;
    margin: auto;
`;

let offsetCnt = 0;

function CharacterEvents({ id }: { id: string }) {

    const [events, setEvents] = useState<IEvents>();

    const fetchEventsContainingCharacter = () => {
        axios.get(
            `${BASE_URL}${GET_ON_CHAR}/${ id }/events?ts=1&apikey=${apikey}&hash=${hash}&limit=12
            &offset=${offsetCnt * 12}`
            )
            .then(res => {
                setEvents(event => {
                    if(!event) return res.data;
                    else {
                        const copied = {...event};
                        copied.data.results.splice(
                            copied.data.results.length, 0, ...res.data.data.results);
                        return copied;
                    };
                });
            });
    };

    const total = events?.data.total || 0;

    useEffect(() => {
        return () => {
            offsetCnt = 0;
        };
    });

    useEffect(() => {
        fetchEventsContainingCharacter();
    }, []);

    const [visible, setVisible] = useState(0);

    const showPrev = () => {
        setIsBack(true);
        setVisible(visible => {
                if(events?.data.results) {
                    return visible - 1 < 0 ? events.data.results.length - 1 : visible - 1;  
                } else return 0;
            }
        )
    };

    const showNext = () => {
        setIsBack(false);
        setVisible(visible => {
            if(events?.data.results) {
                const nowTotal = events.data.results.length;
                if(visible + 1 === nowTotal && nowTotal < total) {
                    const confirm = 
                        window.confirm('Data has reached limit. Want fetch more?');
                    if(confirm) {
                        offsetCnt ++;
                        fetchEventsContainingCharacter();
                        return visible + 1;
                    };
                };
                return visible + 1 === nowTotal ? 0 : visible + 1;  
            } else return 0;
        }
    )
    };

    const [isBack, setIsBack] = useState(false);

    const SlideVariant = {
        start: (isBack: boolean) => ({
            x: isBack ? -120 : 120,
            opacity: 0,
            scale: 0.75,
            transition: {
                duration: 1
            }
        }),
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1
            }
        },
        leave: (isBack: boolean) => ({
            x: isBack ? 120 : -120,
            opacity: 0,
            scale: 0.75,
            transition: {
                duration: 1
            }
        })
    };

    return (
        <>
            {
                events?.data.results.length === 0 ? 
                <p style={{
                    textAlign: 'center'
                }}>sorry. no data :(</p> : 
                <>
                    <p style={{
                        textAlign: 'center'
                    }}
                    >This events are the events which the character appears in.</p>
                    <Wrapper>
                        <AnimatePresence
                        custom={isBack}
                        >
                        {
                            events?.data.results.map((event, i) => {
                                return (
                                    <span key={i}>
                                        {
                                            visible === i ?
                                            <>
                                                <EventCard 
                                                path={event.thumbnail.path + '/landscape_xlarge.jpg'}
                                                variants={SlideVariant}
                                                initial="start"
                                                animate="animate"
                                                exit="leave"
                                                custom={isBack}
                                                key={event.id}
                                                /> 
                                                <div style={{
                                                    textAlign: 'center',
                                                }}>
                                                    <h4>{ event.title }</h4>
                                                    <span>
                                                        <Highlighted>{(visible + 1)}</Highlighted>
                                                        { " / " + events?.data.results.length }
                                                    </span>
                                                </div>
                                            </>
                                            : null
                                        }
                                    </span>
                                )
                            })
                        }
                        </AnimatePresence>
                        <LeftArrow
                        src={require('../images/arrow.png')}
                        onClick={showPrev} />
                        <RightArrow 
                        src={require('../images/arrow.png')}
                        onClick={showNext} />
                    </Wrapper>
                </>
            }
            <div style={{
                textAlign: 'center',
                marginBottom: '100px'
            }}>
            </div>
        </>
    )
};

export default CharacterEvents;