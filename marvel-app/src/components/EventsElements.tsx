import React from "react";
import styled from "styled-components";
import { IEventsResult } from "../types_store/EventsType";

const EventCard = styled.div`
    width: 420px;
    height: 130px;
    margin: 16px 8px;
    position: relative;
    border: 0.5px solid transparent;
    transition: all 1s;
    &:hover {
        border: 0.5px solid #F0131E;
    }
`;

const EventPic = styled.div<{ path: string }>`
    background-image: url(${ props => props.path });
    background-position: center center;
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;
    height: 130px;
    width: 130px;
`;

const EventInfo = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    text-align: right;
    padding: 12px;
    h4 {
        margin: 0;
    }
`;

function EventsElements({ events }: { events?: IEventsResult[] }) {
    return (
        <>
            {
                !events ? null :
                <div style={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {
                        events.map(event => {
                            return (
                                <EventCard key={event.id}>
                                    <EventPic 
                                    path={event.thumbnail.path + '/standard_medium.jpg'} 
                                    />
                                    <EventInfo>
                                        <h4>{ event.title }</h4>
                                        {
                                            event.start && event.end ?
                                            <>
                                                <h5>{ event.start.split(' ')[0] + " - " + 
                                                event.end.split(' ')[0]}</h5>
                                            </> : null
                                        }
                                    </EventInfo>
                                </EventCard>
                            )
                        })
                    }
                </div>
            }
        </>
    )
};

export default React.memo(EventsElements);