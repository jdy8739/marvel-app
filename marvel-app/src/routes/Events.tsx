import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import styled from "styled-components";
import { apikey, BASE_URL, GET_EVENTS, hash } from "../api";
import EventsElements from "../components/EventsElements";
import { Dot, EventSliderTextBox, EventTitle, FullPageSliderPic } from "../styled";
import { IEvents, IEventsResult } from "../types_store/EventsType";

const HorizonBar = styled.div`
    background-color: #F0131E;
    width: 100vw;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Window = styled.div<{ height: number }>`
    width: 100vw;
    height: ${props => props.height}px;
`;

const TOTAL = 74;

const SLICED_FULL_PAGE_INDEX = 7;

function Events() {

    const windowWidth = window.outerWidth;

    const [windowHeight, setWindowHeight] = useState(window.outerHeight);
    
    useEffect(() => {
        window.addEventListener('resize', resizeWindowHeight);
        return function() {
            window.removeEventListener('resize', resizeWindowHeight);
        };
    }, []);

    const resizeWindowHeight = () => {
        setWindowHeight(window.outerHeight);
    };

    const slidePicVarinat = {
        initial: {
            x: windowWidth
        },
        animate: {
            x: 0,
            transition: {
                duration: 1
            }
        },
        exit: {
            x: - windowWidth,
            transition: {
                duration: 1
            }
        }
    };

    const fetchEvents = async () => {
        const res = await fetch(`${BASE_URL}${GET_EVENTS}?ts=1&apikey=${apikey}&hash=${
            hash}&offset=0&limit=${TOTAL}`);
        return await res.json();
    };

    const { data: events } = useQuery<IEvents>(['events'], fetchEvents);

    const [eventsArr, setEventsArr] = useState<IEventsResult[]>();

    const [visible, setVisible] = useState(0);

    const [isSliderComplete, setIsSliderComplete] = useState(true);

    const increaseVisiblePicIndex = () => {
        if(isSliderComplete) {
            setIsSliderComplete(false);
            setVisible(
                index => index + 1 === SLICED_FULL_PAGE_INDEX ? 0 : index += 1);
            clearInterval(timer);
        };
    };

    const timer = 
            setInterval(increaseVisiblePicIndex, 9000);

    const setSlidingCompleteDone = () => {
        setIsSliderComplete(true);
    };

    useEffect(() => {
        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const tmpEventsArr: IEventsResult[] = [];
        getRandomSevenNumArr().forEach(number => {
            if(events?.data.results[number]) {
                tmpEventsArr.push(events?.data.results[number]);
            };
        });
        setEventsArr(tmpEventsArr);
    }, [events])

    const getRandomSevenNumArr = () :number[] => {
        const set: Set<number> = new Set();
        for(let i=0; set.size !== SLICED_FULL_PAGE_INDEX + 1; i++) {
            set.add(Math.floor(Math.random() * TOTAL + 1));
        };
        return Array.from(set);
    };

    return (
        <>
            <Helmet>
                <title>Events</title>
            </Helmet>
            <Window height={windowHeight - 220}>
                <AnimatePresence
                onExitComplete={setSlidingCompleteDone}
                initial={false}
                >
                    <motion.span
                        key={visible}
                        >
                        {
                            eventsArr ? <>
                                {
                                    eventsArr.map((event, i) => {
                                        return (
                                            <span key={event.id}>
                                                {
                                                    visible === i ?
                                                    <FullPageSliderPic
                                                    variants={slidePicVarinat}
                                                    onClick={increaseVisiblePicIndex}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                    height={windowHeight - 220}
                                                    path={event.thumbnail.path + '/landscape_incredible.jpg'}
                                                    >
                                                        <EventSliderTextBox>
                                                            <EventTitle>{ event.title }</EventTitle>
                                                            <h5>{ event.description }</h5>
                                                            {
                                                                event.start ? 
                                                                <h5>
                                                                    { event.start.split(' ')[0] + " - " + event.end.split(' ')[0] }
                                                                </h5> : null
                                                            }
                                                            {
                                                                event.previous && event.next ?
                                                                <span>
                                                                    <h5>PREVIOUS: { event.previous.name }</h5>
                                                                    <h5>NEXT: { event.next.name }</h5>
                                                                </span> : null
                                                            }
                                                        </EventSliderTextBox>
                                                    </FullPageSliderPic> : null
                                                }
                                            </span>
                                        )
                                    })
                                } 
                            </> : null
                        }
                    </motion.span>
                </AnimatePresence>
            </Window>
            <HorizonBar>
                {
                    [0, 1, 2, 3, 4, 5, 6].map(index => {
                        return <Dot 
                        key={index}
                        clicked={visible === index}
                        onClick={() => setVisible(index)}
                        ></Dot>
                    })
                }
            </HorizonBar>
            <br></br>
            <br></br>
            <EventsElements 
            events={events?.data.results}
            />
        </>
    )
};

export default Events;