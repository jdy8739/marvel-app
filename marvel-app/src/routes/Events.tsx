import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { apikey, BASE_URL, GET_EVENTS, hash } from "../api";
import { EventSliderTextBox, EventTitle, FullPageSliderPic } from "../styled";
import { IEvents } from "../types_store/EventsType";

const TOTAL = 74;

const SLICED_FULL_PAGE_INDEX = 7;

function Events() {

    const windowWidth = window.outerWidth;

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

    const [visible, setVisible] = useState(0);

    const [isSliderComplete, setIsSliderComplete] = useState(true);

    const increaseVisiblePicIndex = () => {
        if(isSliderComplete) {
            setIsSliderComplete(false);
            setVisible(
                index => index + 1 === SLICED_FULL_PAGE_INDEX ? 0 : index += 1);
        };
    };

    const setSlidingCompleteDone = () => {
        setIsSliderComplete(true);
    };

    return (
        <>
            <AnimatePresence
            onExitComplete={setSlidingCompleteDone}
            >
                <motion.span
                    key={visible}
                    variants={slidePicVarinat}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    >
                    {
                        events?.data.results.slice(0, SLICED_FULL_PAGE_INDEX).map((event, i) => {
                            return (
                                <span key={event.id}>
                                    {
                                        visible === i ?
                                        <FullPageSliderPic
                                        variants={slidePicVarinat}
                                        path={event.thumbnail.path + '/landscape_incredible.jpg'}
                                        onClick={increaseVisiblePicIndex}
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
                                            </EventSliderTextBox>
                                        </FullPageSliderPic> : null
                                    }
                                </span>
                            )
                        })
                    }
                </motion.span>
            </AnimatePresence>
        </>
    )
};

export default Events;