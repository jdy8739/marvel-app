import axios from "axios";
import { useEffect, useState } from "react";
import { apikey, BASE_URL, GET_ON_COMICS, hash } from "../api";
import { Blank, Highlighted, Loading } from "../styled";
import { IEvents } from "../types_store/EventsType";
import { EventCard } from "./CharacterEvents";

function ComicsEvents({ id }: { id: string }) {

    const [events, setEvents] = useState<IEvents>();

    const [isLoading, setIsLoading] = useState(true);

    const fetchComicsEvents = () => {
        axios.get<IEvents>(`${BASE_URL}${GET_ON_COMICS}/${id}/events?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setEvents(res.data);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchComicsEvents();
    }, []);

    return(
        <>
            { isLoading ? <Loading src={require('../images/giphy.gif')}/> : null }
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
                                    <div style={{
                                        textAlign: 'center',
                                    }}>
                                        <h4>{ event.title }</h4>
                                    </div>
                                </div>
                            )
                        })
                    }
                </> : <p style={{ textAlign: 'center' }}>Sorry. No data. :(</p>
            }
            <Blank />
        </>
    )
};

export default ComicsEvents;