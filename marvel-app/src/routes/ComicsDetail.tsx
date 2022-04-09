import axios from "axios";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { apikey, BASE_URL, GET_ON_COMICS, hash } from "../api";
import { comicsSearchedTitleAtom, comicsSearchedDateAtom, comicsPageAtom } from "../atoms";
import ComicsCharacters from "../components/ComicsCharacters";
import ComicsEvents from "../components/ComicsEvents";
import { Blank, ClickToGoBack, ComicPortrait, Tab, Tabs } from "../styled";
import { IComics } from "../types_store/ComicsType";

const Container = styled.div`
    width: 48%;
    min-width: 280px;
    margin: auto;
`;

function ComicsDetail() {

    const comicsMatch = useMatch('/comics/detail/:id');

    const comicsCharMatch = useMatch('/comics/detail/:id/characters');

    const comicsEventMatch = useMatch('/comics/detail/:id/events');

    const match = comicsMatch || comicsCharMatch || comicsEventMatch;

    const [comic, setComic] = useState<IComics>();

    const fetchComic = function() {
        axios.get<IComics>(`${BASE_URL}${GET_ON_COMICS}/${match?.params.id}?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setComic(res.data);
            });
    };

    useEffect(() => {
        fetchComic();
    }, []);

    const title = useRecoilValue(comicsSearchedTitleAtom);

    const [formerDate, latterDate] = useRecoilValue(comicsSearchedDateAtom);

    const page = useRecoilValue(comicsPageAtom);

    const nav = useNavigate();

    const backToComicsPage = function() {
        if(title || formerDate || latterDate) {
            nav(`/comics?${title ? `&title=${title}` : ''}${
                formerDate || latterDate ? `&dateRange=${formerDate},${latterDate}` : ''}${
                page ? `&page=${page}` : ''
                }`);
        } else nav('/comics');
    };

    return (
        <>
            <Blank />
            <ComicPortrait
            path={comic?.data.results[0].thumbnail.path + '/portrait_uncanny.jpg'}
            onClick={backToComicsPage}
            >
                <ClickToGoBack>click portrait to go back</ClickToGoBack>
            </ComicPortrait>
            <Container>
                <div style={{
                    textAlign: 'center'
                }}>
                    <h1>{ comic?.data.results[0].title }</h1>
                    <p>released: { comic?.data.results[0].dates[1].date.slice(0, 10) }</p>
                    <p>price: { 
                    comic?.data.results[0].prices[0].price === 0 ? 'Not On Sale' : 
                    comic?.data.results[0].prices[0].price + '$'
                    }</p>
                </div>
                <div style={{
                    textAlign: 'right'
                }}
                >
                    <br></br>
                    {
                        comic?.data.results[0].creators.items.map((creator, i) => {
                            return (
                                <h5 
                                key={i}
                                style={{ margin: '4px' }}
                                >
                                    <span>{ creator.role }:</span>
                                    &ensp;
                                    <span>{ creator.name }</span>
                                </h5>
                            )
                        })
                    }
                </div>
            </Container>
            <Tabs>
                <Tab
                clicked={Boolean(comicsCharMatch)}
                onClick={() => nav(`/comics/detail/${match?.params.id}/characters`)}
                >character</Tab>
                <Tab
                clicked={Boolean(comicsEventMatch)}
                onClick={() => nav(`/comics/detail/${match?.params.id}/events`)}
                >events</Tab>
            </Tabs>
            <div style={{ height: '30px' }}></div>
            { comicsCharMatch ? <ComicsCharacters id={match?.params.id ?? ''}/> : null }
            { comicsEventMatch ? <ComicsEvents id={match?.params.id ?? ''}/> : null }
        </>
    )
};

export default ComicsDetail;