import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, KEY_STRING } from "../../../key";
import { Highlighted, Loading, EventCard } from "../../../styled";
import { IEvents } from "../../../types_store/EventsType";
import { LeftArrow, RightArrow, Wrapper } from "./CharacterComics";
import React from "react";

let offsetCnt = 0;

function CharacterEvents({ id }: { id: string }) {
    const [events, setEvents] = useState<IEvents>();

    const [isLoading, setIsLoading] = useState(true);

    const [visible, setVisible] = useState(0);

    const [isBack, setIsBack] = useState(false);

    const total = events?.data.total || 0;

    const nav = useNavigate();

    const SlideVariant = {
        start: (isBack: boolean) => ({
            x: isBack ? -120 : 120,
            opacity: 0,
            scale: 0.75,
            transition: {
                duration: 1,
            },
        }),
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1,
            },
        },
        leave: (isBack: boolean) => ({
            x: isBack ? 120 : -120,
            opacity: 0,
            scale: 0.75,
            transition: {
                duration: 1,
            },
        }),
    };

    const fetchEventsContainingCharacter = () => {
        if (!isLoading) channgeIsLoadingStatus();
        axios
            .get(
                `${BASE_URL}characters/${id}/events?${KEY_STRING}&limit=12
            &offset=${offsetCnt * 12}`
            )
            .then(res => {
                setEvents(event => {
                    if (!event) return res.data;
                    else {
                        const copied = { ...event };
                        copied.data.results.splice(
                            copied.data.results.length,
                            0,
                            ...res.data.data.results
                        );
                        return copied;
                    }
                });
                channgeIsLoadingStatus();
            });
    };

    const channgeIsLoadingStatus = () => setIsLoading(now => !now);

    const showPrev = () => {
        setIsBack(true);
        setVisible(visible => {
            if (events?.data.results) {
                return visible - 1 < 0
                    ? events.data.results.length - 1
                    : visible - 1;
            } else return 0;
        });
    };

    const showNext = () => {
        setIsBack(false);
        setVisible(visible => {
            if (events?.data.results) {
                const nowTotal = events.data.results.length;
                if (visible + 1 === nowTotal && nowTotal < total) {
                    const confirm = window.confirm(
                        "Data has reached limit. Want fetch more?"
                    );
                    if (confirm) {
                        offsetCnt++;
                        fetchEventsContainingCharacter();
                        return visible + 1;
                    }
                }
                return visible + 1 === nowTotal ? 0 : visible + 1;
            } else return 0;
        });
    };

    useEffect(() => {
        return () => {
            offsetCnt = 0;
        };
    });

    useEffect(() => {
        fetchEventsContainingCharacter();
    }, []);

    return (
        <>
            {isLoading && (
                // eslint-disable-next-line no-undef
                <Loading src={process.env.PUBLIC_URL + "/images/giphy.gif"} />
            )}
            {events?.data.results.length === 0 ? (
                <p
                    style={{
                        textAlign: "center",
                    }}
                >
                    sorry. no data :(
                </p>
            ) : (
                <>
                    <p
                        style={{
                            textAlign: "center",
                        }}
                    >
                        This events are the events which the character appears
                        in.
                    </p>
                    <Wrapper>
                        <AnimatePresence custom={isBack}>
                            {events?.data.results.map((event, i) => {
                                return (
                                    <span
                                        key={i}
                                        onClick={() =>
                                            nav("/events/detail/" + event.id)
                                        }
                                    >
                                        {visible === i && (
                                            <>
                                                <EventCard
                                                    path={
                                                        event.thumbnail.path +
                                                        "/landscape_xlarge.jpg"
                                                    }
                                                    variants={SlideVariant}
                                                    initial="start"
                                                    animate="animate"
                                                    exit="leave"
                                                    custom={isBack}
                                                    key={event.id}
                                                />
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <h4>{event.title}</h4>
                                                    <span>
                                                        <Highlighted>
                                                            {visible + 1}
                                                        </Highlighted>
                                                        {" / " +
                                                            events?.data.results
                                                                .length}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </span>
                                );
                            })}
                        </AnimatePresence>
                        <LeftArrow
                            // eslint-disable-next-line no-undef
                            src={process.env.PUBLIC_URL + "/images/arrow.png"}
                            onClick={showPrev}
                        />
                        <RightArrow
                            // eslint-disable-next-line no-undef
                            src={process.env.PUBLIC_URL + "/images/arrow.png"}
                            onClick={showNext}
                        />
                    </Wrapper>
                </>
            )}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "100px",
                }}
            ></div>
        </>
    );
}

export default CharacterEvents;
