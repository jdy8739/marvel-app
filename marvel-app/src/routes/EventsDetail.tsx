import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_EVENTS, hash } from "../api";
import EventCharacters from "../components/EventsCharacters";
import EventComics from "../components/EventsComics";
import EventSeries from "../components/EventsSeries";
import { EventTitle, Loading, Tab, Tabs } from "../styled";
import { IEvents } from "../types_store/EventsType";

const FullPagePic = styled.div<{ path: string }>`
    background-image: linear-gradient(to top, rgba(0, 0, 0, 1), transparent), 
    url(${ props => props.path });
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
        color: #F0131E;
    }
`;

function EventsDetail() {

    const eventMatch = useMatch('/events/detail/:id');

    const eventCharMatch = useMatch('/events/detail/:id/characters');

    const eventComicsMatch = useMatch('/events/detail/:id/comics');

    const eventSeriesMatch = useMatch('/events/detail/:id/series');

    const match = 
        eventMatch || eventCharMatch || eventComicsMatch || eventSeriesMatch;

    const fetchEvent = async () => {
        const res = await fetch(
            `${BASE_URL}${GET_EVENTS}/${match?.params.id}?ts=1&apikey=${apikey}&hash=${hash}`);
        return await res.json();
    };

    const { data, isLoading } = useQuery<IEvents>(
        ['event', eventMatch?.params.id], fetchEvent);

    const event = data?.data.results[0];

    const showDataofThisTitle = async (e: React.MouseEvent<HTMLHeadingElement>) => {
        e.stopPropagation();
        const targetName = 
            e.currentTarget.textContent?.split(': ')[1];
        const res = await fetch(`${BASE_URL}${GET_EVENTS}?ts=1&apikey=${apikey}&hash=${
            hash}&name=${targetName}`);
        const data: IEvents = await res.json();
        if(data) 
            nav('/events/detail/' + data.data.results[0].id);
    };

    const nav = useNavigate();

    return (
        <>
            <Helmet>
                <title>{ event?.title }</title>
            </Helmet>
            { isLoading ? <Loading src={require('../images/giphy.gif')}/> : null }
            {
                isLoading ? <p>Loading. Please wait.</p> :
                <>
                    <FullPagePic
                    path={event?.thumbnail.path + '/landscape_incredible.jpg'}
                    >
                        <EventTitle>{ event?.title }</EventTitle>
                        <h5 
                        style={{ width: '70vw' }}
                        >{ event?.description }</h5>
                        <Desc>
                            { 
                                event?.start ? 
                                <>
                                    {
                                        event?.start.split(' ')[0] + " - " + 
                                        event?.end.split(' ')[0]
                                    }
                                </> : null
                            }   
                        </Desc>
                        {
                            event?.previous && event.next ?
                            <div>
                                <SmallTitle
                                onClick={showDataofThisTitle}
                                >{ "previous: " + event.previous.name.toUpperCase() }</SmallTitle>
                                &emsp;
                                <SmallTitle
                                onClick={showDataofThisTitle}
                                >{ "next: " + event.next.name.toUpperCase() }</SmallTitle>
                            </div> : null
                        }
                        <Tabs 
                        style={{ 
                            justifyContent: 'left',
                        }}
                        >
                            <Tab
                            onClick={() => nav(`/events/detail/${event?.id ?? ''}/characters`)}
                            clicked={Boolean(eventCharMatch)}
                            >characters</Tab>
                            <Tab
                            onClick={() => nav(`/events/detail/${event?.id ?? ''}/comics`)}
                            clicked={Boolean(eventComicsMatch)}
                            >comics</Tab>
                            <Tab
                            onClick={() => nav(`/events/detail/${event?.id ?? ''}/series`)}
                            clicked={Boolean(eventSeriesMatch)}
                            >series</Tab>
                        </Tabs>
                    </FullPagePic>  
                    {
                        eventCharMatch ? <EventCharacters id={match?.params.id || ''}/> : null
                    }
                    {
                        eventComicsMatch ? <EventComics id={match?.params.id || ''}/> : null
                    }
                    {
                        eventSeriesMatch ? <EventSeries id={match?.params.id || ''}/> : null
                    }
                </>
            }
        </>
    )
};

export default EventsDetail;