import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IEventsResult } from "../types_store/EventsType";

const EventPic = styled.div<{ path: string }>`
    background-image: url(${ props => props.path });
    background-position: center center;
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;
    height: 130px;
    width: 130px;
    transition: all 1s;
    filter: grayscale(1.0);
`;

const EventInfo = styled.div`
    position: absolute;
    height: 85%;
    width: 262px;
    right: 0;
    top: 0;
    text-align: right;
    padding: 12px;
    transition: all 0.3s;
    h4 {
        margin: 0;
    }
`;

const EventCard = styled.div`
    width: 420px;
    height: 130px;
    margin: 16px 8px;
    position: relative;
    transition: all 1s;
    &:hover {
        ${EventPic} {
            filter: grayscale(0.1);
            transform: scale(1.02);
        }
        ${EventInfo} {
            background-color: #F0131E;
        }
    }
`;

function EventsElements({ events }: { events?: IEventsResult[] }) {

    const nav = useNavigate();

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
                                <EventCard 
                                key={event.id}
                                onClick={() => nav('/events/detail/' + event.id)}
                                >
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