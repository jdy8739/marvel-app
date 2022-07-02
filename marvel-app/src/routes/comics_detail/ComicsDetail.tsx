import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import {
    comicsSearchedTitleAtom,
    comicsSearchedDateAtom,
    comicsPageAtom,
} from "../../atoms";
import ComicsCharacters from "./components/ComicsCharacters";
import ComicsEvents from "./components/ComicsEvents";
import {
    Blank,
    ClickToGoBack,
    ComicPortrait,
    Loading,
    Tab,
    Tabs,
} from "../../styled";
import { IComics } from "../../types_store/ComicsType";
import { BASE_URL, KEY_STRING, nav } from "../../key";
import React from "react";

const Container = styled.div`
    width: 48%;
    min-width: 280px;
    margin: auto;
`;

function ComicsDetail() {
    const comicsMatch = useMatch("/comics/detail/:id");

    const comicsCharMatch = useMatch("/comics/detail/:id/characters");

    const comicsEventMatch = useMatch("/comics/detail/:id/events");

    const title = useRecoilValue(comicsSearchedTitleAtom);

    const page = useRecoilValue(comicsPageAtom);

    const [formerDate, latterDate] = useRecoilValue(comicsSearchedDateAtom);

    const match = comicsMatch || comicsCharMatch || comicsEventMatch;

    const fetchComic = async function () {
        const res = await fetch(
            `${BASE_URL}comics/${match?.params.id}?${KEY_STRING}`
        );

        return await res.json();
    };

    const { data, isLoading } = useQuery<IComics>(
        ["comic", match?.params.id || ""],
        fetchComic,
        {
            refetchInterval: false,
            refetchOnWindowFocus: false,
        }
    );

    const comic = data?.data.results[0];

    const backToComicsPage = function () {
        if (title || formerDate || latterDate || page) {
            nav(
                `/comics?${title ? `&title=${title}` : ""}${
                    formerDate || latterDate
                        ? `&dateRange=${formerDate},${latterDate}`
                        : ""
                }${page ? `&page=${page}` : ""}`
            );
        } else nav("/comics");
    };

    return (
        <>
            <Helmet>
                <title>{comic?.title}</title>
            </Helmet>
            <Blank />
            {isLoading ? (
                <>
                    <Loading
                        // eslint-disable-next-line no-undef
                        src={process.env.PUBLIC_URL + "/images/giphy.gif"}
                    />
                    <Blank />
                </>
            ) : null}
            <ComicPortrait
                path={comic?.thumbnail.path + "/portrait_uncanny.jpg"}
                onClick={backToComicsPage}
            >
                <ClickToGoBack>click portrait to go back</ClickToGoBack>
            </ComicPortrait>
            <Container>
                <div
                    style={{
                        textAlign: "center",
                    }}
                >
                    <h1>{comic?.title}</h1>
                    <p>released: {comic?.dates[1].date.slice(0, 10)}</p>
                    <p>
                        price:{" "}
                        {comic?.prices[0].price === 0
                            ? "Not On Sale"
                            : comic?.prices[0].price + "$"}
                    </p>
                </div>
                <div
                    style={{
                        textAlign: "right",
                    }}
                >
                    <br></br>
                    {comic?.creators.items.map((creator, i) => {
                        return (
                            <h5 key={i} style={{ margin: "4px" }}>
                                <span>{creator.role}:</span>
                                &ensp;
                                <span>{creator.name}</span>
                            </h5>
                        );
                    })}
                </div>
            </Container>
            <Tabs>
                <Tab
                    clicked={Boolean(comicsCharMatch)}
                    onClick={() =>
                        nav(`/comics/detail/${match?.params.id}/characters`)
                    }
                >
                    character
                </Tab>
                <Tab
                    clicked={Boolean(comicsEventMatch)}
                    onClick={() =>
                        nav(`/comics/detail/${match?.params.id}/events`)
                    }
                >
                    events
                </Tab>
            </Tabs>
            <div style={{ height: "30px" }}></div>
            {comicsCharMatch && (
                <ComicsCharacters id={match?.params.id ?? ""} />
            )}
            {comicsEventMatch && <ComicsEvents id={match?.params.id ?? ""} />}
        </>
    );
}

export default ComicsDetail;
