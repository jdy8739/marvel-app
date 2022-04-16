import axios from "axios";
import { useEffect, useState } from "react";
import { apikey, BASE_URL, GET_EVENTS, hash } from "../api";
import { CharName, ComicsCard, ComicsFrameForm, Container } from "../styled";
import { IComics } from "../types_store/ComicsType";


function EventComics({ id }: { id: string }) {

    const [comics, setComics] = useState<IComics>();

    useEffect(() => {
        axios.get<IComics>(
            `${BASE_URL}${GET_EVENTS}/${id}/comics?ts=1&apikey=${apikey}&hash=${hash
            }`)
            .then(res => {
                setComics(res.data);
            });
    }, []);

    return (
        <Container>
            {
                comics?.data.results.map(comicsElem => {
                    return (
                        <ComicsFrameForm 
                        key={comicsElem.id}
                        path={`${ comicsElem.thumbnail.path }/portrait_incredible.jpg`}
                        >
                            
                            <CharName 
                            length={comicsElem.title.length}
                            >{ comicsElem.title.length > 20 ? comicsElem.title.slice(0, 20) + '...' : comicsElem.title }</CharName>
                        </ComicsFrameForm>
                    )
                })
            }
        </Container>
    )
};

export default EventComics;