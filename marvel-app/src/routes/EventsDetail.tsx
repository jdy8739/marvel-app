import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_EVENTS, hash } from "../api";
import EventCharacters from "../components/EventsCharacters";
import { EventTitle, Tab, Tabs } from "../styled";
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


function EventsDetail() {

    const eventMatch = useMatch('/events/detail/:id');

    const eventCharMatch = useMatch('/events/detail/:id/characters');

    const match = eventMatch || eventCharMatch;

    const fetchEvent = async () => {
        const res = await fetch(
            `${BASE_URL}${GET_EVENTS}/${match?.params.id}?ts=1&apikey=${apikey}&hash=${hash}`);
        return await res.json();
    };

    const { data, isLoading } = useQuery<IEvents>(
        ['event', eventMatch?.params.id], fetchEvent);

    const event = data?.data.results[0];

    const nav = useNavigate();

    return (
        <>
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
                            event?.previous ?
                            <Desc>PREVIOUS: { event?.previous.name }</Desc> : null
                        }
                        {
                            event?.next ?
                            <Desc>NEXT: { event?.next.name }</Desc> : null
                        }
                        <Tabs 
                        style={{ 
                            justifyContent: 'left',
                        }}
                        >
                            <Tab
                            onClick={() => nav(`/events/detail/${event?.id ?? ''}/characters`)}
                            >characters</Tab>
                            <Tab>comics</Tab>
                            <Tab>series</Tab>
                        </Tabs>
                    </FullPagePic>
                    <div style={{ height: '150vh', width: '100vw' }}>
                        {
                            eventCharMatch ? <EventCharacters id={match?.params.id || ''}/> : null
                        }
                    </div>
                </>
            }
        </>
    )
};

export default EventsDetail;