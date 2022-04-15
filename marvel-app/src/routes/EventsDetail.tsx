import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import { apikey, BASE_URL, GET_EVENTS, hash } from "../api";
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

    const fetchEvent = async () => {
        const res = await fetch(
            `${BASE_URL}${GET_EVENTS}/${eventMatch?.params.id}?ts=1&apikey=${apikey}&hash=${hash}`);
        return await res.json();
    };

    const { data: event, isLoading } = useQuery<IEvents>(
        ['event', eventMatch?.params.id], fetchEvent);

    return (
        <>
            {
                isLoading ? <p>Loading. Please wait.</p> :
                <>
                    <FullPagePic
                    path={event?.data.results[0].thumbnail.path + '/landscape_incredible.jpg'}
                    >
                        <EventTitle>{ event?.data.results[0].title }</EventTitle>
                        <h5 
                        style={{ width: '70vw' }}
                        >{ event?.data.results[0].description }</h5>
                        <Desc>
                            { 
                                event?.data.results[0].start ? 
                                <>
                                    {
                                        event?.data.results[0].start.split(' ')[0] + " - " + 
                                        event?.data.results[0].end.split(' ')[0]
                                    }
                                </> : null
                            }   
                        </Desc>
                        {
                            event?.data.results[0].previous ?
                            <Desc>PREVIOUS: { event?.data.results[0].previous.name }</Desc> : null
                        }
                        {
                            event?.data.results[0].next ?
                            <Desc>PREVIOUS: { event?.data.results[0].next.name }</Desc> : null
                        }
                        <Tabs 
                        style={{ 
                            justifyContent: 'left',
                        }}
                        >
                            <Tab>characters</Tab>
                            <Tab>comics</Tab>
                            <Tab>series</Tab>
                        </Tabs>
                    </FullPagePic>
                    <div style={{ height: '150vh', width: '100vw' }}>
                    </div>
                </>
            }
        </>
    )
};

export default EventsDetail;