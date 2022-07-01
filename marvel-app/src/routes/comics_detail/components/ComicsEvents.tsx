import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, KEY_STRING } from "../../../key";
import { Blank, EventCard, Loading } from "../../../styled";
import { IEvents } from "../../../types_store/EventsType";

function ComicsEvents({ id }: { id: string }) {

    const [events, setEvents] = useState<IEvents>();

    const [isLoading, setIsLoading] = useState(true);

    const fetchComicsEvents = () => {
        axios.get<IEvents>(`${BASE_URL}comics/${ id }/events?${KEY_STRING}`)
            .then(res => {
                setEvents(res.data);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchComicsEvents();
    }, []);

    const nav = useNavigate();

    return(
        <>
            { isLoading ? <Loading src={require('../../../images/giphy.gif')}/> : null }
            {
                events?.data.results.length !== 0 ?
                <>
                    {
                        events?.data.results.map(event => {
                            return (
                                <div key={event.id}>
                                    <EventCard
                                    path={event.thumbnail.path + '/landscape_xlarge.jpg'}
                                    onClick={() => nav('/events/detail/' + event.id)}
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