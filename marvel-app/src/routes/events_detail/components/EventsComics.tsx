import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, KEY_STRING } from "../../../key";
import { Blank, CharName, ComicsFrameForm, Container, Loading } from "../../../styled";
import { IComics } from "../../../types_store/ComicsType";
import { ShowMoreBtn } from "../../character_detail/components/CharacterSeries";

const LIMIT = 20;

function EventComics({ id }: { id: string }) {

    const [comics, setComics] = useState<IComics>();

    const [offsetCnt, setOffsetCnt] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    const plusOffsetCnt = () => setOffsetCnt(cnt => cnt + 1);

    useEffect(() => {
        if(isCntBeyondTotal()) {
            alert('No more to show!');
            return;
        };

        if(!isLoading) setIsLoading(true);

        axios.get<IComics>(
            `${BASE_URL}events/${ id }/comics?${KEY_STRING}&offset=${offsetCnt * LIMIT}`)
            .then(res => {
                setComics(comics => {
                    if(!comics) return res.data;
                    else {
                        const copied = {...comics};
                        copied.data.results.splice(
                            copied.data.results.length, 0, ...res.data.data.results);
                        return copied;
                    };
                });
                setIsLoading(false);
            });
    }, [offsetCnt]);

    const isCntBeyondTotal = () :boolean => {
        const total = comics?.data.total || 999;
        if(total / LIMIT <= offsetCnt) return true;
        else return false;
    };

    const nav = useNavigate();

    return (
        <>
            { isLoading ? <Loading src={process.env.PUBLIC_URL + 'images/giphy.gif'}/> : null }
            {
                isLoading && !comics ? <Loading src={process.env.PUBLIC_URL + '/images/giphy.gif'} /> :
                <Container>
                    {
                        comics?.data.results.map(comicsElem => {
                            return (
                                <ComicsFrameForm 
                                key={comicsElem.id}
                                path={`${ comicsElem.thumbnail.path }/portrait_incredible.jpg`}
                                onClick={() => nav('/comics/detail/' + comicsElem.id)}
                                >
                                    
                                    <CharName 
                                    length={comicsElem.title.length}
                                    >{ comicsElem.title.length > 20 ? comicsElem.title.slice(0, 20) + '...' : comicsElem.title }</CharName>
                                </ComicsFrameForm>
                            )
                        })
                    }
                </Container>
            }
            <br></br>
            <br></br>
            <ShowMoreBtn onClick={plusOffsetCnt}>show more</ShowMoreBtn>
            <Blank />
        </>
    )
};

export default EventComics;