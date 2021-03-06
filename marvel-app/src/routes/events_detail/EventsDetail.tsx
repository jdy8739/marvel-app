import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import EventCharacters from "./components/EventsCharacters";
import EventComics from "./components/EventsComics";
import EventSeries from "./components/EventsSeries";
import { EventTitle, Loading, Tab, Tabs } from "../../styled";
import { IEvents } from "../../types_store/EventsType";
import { BASE_URL, KEY_STRING } from "../../key";
import React from "react";

const FullPagePic = styled.div<{ path: string }>`
    background-image: linear-gradient(to top, rgba(0, 0, 0, 1), transparent),
        url(${props => props.path});
    background-position: center center;
    background-size: cover;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: left;
    padding: 25px;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
`;

const Desc = styled.h5`
    margin: 4px;
`;

const SmallTitle = styled.h5`
    color: white;
    display: inline-block;
    cursor: pointer;
    &:hover {
        color: #f0131e;
    }
`;

function EventsDetail() {
    const nav = useNavigate();

    const eventMatch = useMatch("/events/detail/:id");

    const eventCharMatch = useMatch("/events/detail/:id/characters");

    const eventComicsMatch = useMatch("/events/detail/:id/comics");

    const eventSeriesMatch = useMatch("/events/detail/:id/series");

    const match =
        eventMatch || eventCharMatch || eventComicsMatch || eventSeriesMatch;

    const fetchEvent = async () => {
        const res = await fetch(
            `${BASE_URL}events/${match?.params.id}?${KEY_STRING}`
        );
        return await res.json();
    };

    const { data, isLoading } = useQuery<IEvents>(
        ["event", eventMatch?.params.id],
        fetchEvent,
        {
            refetchOnWindowFocus: false,
            refetchInterval: false,
        }
    );

    const showDataofThisTitle = async (
        e: React.MouseEvent<HTMLHeadingElement>
    ) => {
        e.stopPropagation();
        const targetName = e.currentTarget.textContent?.split(": ")[1];
        const res = await (
            await fetch(`${BASE_URL}events?${KEY_STRING}&name=${targetName}`)
        ).json();
        if (res) nav("/events/detail/" + res.data.results[0].id);
    };

    const showTabInfo = (e: React.MouseEvent<HTMLButtonElement>) =>
        nav(`/events/detail/${event?.id ?? ""}/${e.currentTarget.textContent}`);

    const event = data?.data.results[0];

    return (
        <>
            <Helmet>
                <title>{event?.title}</title>
            </Helmet>
            {isLoading ? (
                // eslint-disable-next-line no-undef
                <Loading src={process.env.PUBLIC_URL + "/images/giphy.gif"} />
            ) : (
                <>
                    <FullPagePic
                        path={
                            event?.thumbnail.path + "/landscape_incredible.jpg"
                        }
                    >
                        <EventTitle>{event?.title}</EventTitle>
                        <h5 style={{ width: "70vw" }}>{event?.description}</h5>
                        <Desc>
                            {event?.start && (
                                <>
                                    {event?.start.split(" ")[0] +
                                        " - " +
                                        event?.end.split(" ")[0]}
                                </>
                            )}
                        </Desc>
                        {event?.previous && event.next && (
                            <div>
                                <SmallTitle onClick={showDataofThisTitle}>
                                    {"previous: " +
                                        event.previous.name.toUpperCase()}
                                </SmallTitle>
                                &emsp;
                                <SmallTitle onClick={showDataofThisTitle}>
                                    {"next: " + event.next.name.toUpperCase()}
                                </SmallTitle>
                            </div>
                        )}
                        <Tabs
                            style={{
                                justifyContent: "left",
                            }}
                        >
                            <Tab
                                onClick={showTabInfo}
                                clicked={Boolean(eventCharMatch)}
                            >
                                characters
                            </Tab>
                            <Tab
                                onClick={showTabInfo}
                                clicked={Boolean(eventComicsMatch)}
                            >
                                comics
                            </Tab>
                            <Tab
                                onClick={showTabInfo}
                                clicked={Boolean(eventSeriesMatch)}
                            >
                                series
                            </Tab>
                        </Tabs>
                    </FullPagePic>
                    {eventCharMatch && (
                        <EventCharacters id={match?.params.id || ""} />
                    )}
                    {eventComicsMatch && (
                        <EventComics id={match?.params.id || ""} />
                    )}
                    {eventSeriesMatch && (
                        <EventSeries id={match?.params.id || ""} />
                    )}
                </>
            )}
        </>
    );
}

export default EventsDetail;
