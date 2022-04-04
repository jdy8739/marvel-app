import axios from "axios";
import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";
import { apikey, BASE_URL, GET_ON_CHAR, hash } from "../api";
import { IEvents } from "../types_store/EventsType";


function CharacterEvents() {

    const eventsMatch = useMatch('/characters/detail/:id/events');

    const [events, setEvents] = useState<IEvents>();

    const fetchEventsContainingCharacter = () => {
        axios.get(
            `${BASE_URL}${GET_ON_CHAR}/${eventsMatch?.params.id}/events?ts=1&apikey=${apikey}&hash=${hash}&limit=12`
            )
            .then(res => {
                setEvents(res.data);
                console.log(res.data);
            });
    };

    useEffect(() => {
        fetchEventsContainingCharacter();
    }, []);

    return (
        <>
            {
                events?.data.results.map(event => {
                    return (
                        <div style={{
                            width: '100px',
                            height: '100px'
                        }}>
                            <img src={ event.thumbnail.path + '/portrait_uncanny.jpg'} />
                        </div>
                    )
                })
            }
        </>
    )
};

export default CharacterEvents;