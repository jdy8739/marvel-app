import axios from "axios";
import { useEffect, useState } from "react";
import { apikey, BASE_URL, GET_ON_COMICS, hash } from "../api";
import { Highlighted } from "../styled";
import { IEvents } from "../types_store/EventsType";
import { EventCard } from "./CharacterEvents";

function ComicsEvents({ id }: { id: string }) {

    const [events, setEvents] = useState<IEvents>();

    const fetchComicsEvents = () => {
        axios.get<IEvents>(`${BASE_URL}${GET_ON_COMICS}/${id}/events?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setEvents(res.data);
            });
    };

    useEffect(() => {
        fetchComicsEvents();
    }, []);

    return(
        <>
            {
                events?.data.results.length !== 0 ?
                <>
                    {
                        events?.data.results.map(event => {
                            return (
                                <div key={event.id}>
                                    <EventCard
                                    path={event.thumbnail.path + '/landscape_xlarge.jpg'}
                                    >

                                    </EventCard>
                                    <p style={{
                                        textAlign: 'center',
                                    }}>title: &ensp;
                                        <Highlighted>{ event.title }</Highlighted>
                                    </p>
                                </div>
                            )
                        })
                    }
                </> : <p style={{ textAlign: 'center' }}>Sorry. No data. :(</p>
            }
        </>
    )
};

export default ComicsEvents;