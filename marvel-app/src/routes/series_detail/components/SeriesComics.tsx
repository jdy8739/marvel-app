import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Blank, ComicsCard, Highlighted, Loading } from "../../../styled";
import { IComics } from "../../../types_store/ComicsType";
import {
    LeftArrow,
    RightArrow,
    Wrapper,
} from "../../../routes/character_detail/components/CharacterComics";
import { BASE_URL, KEY_STRING } from "../../../key";
import React from "react";

interface ISeriesComics {
    id: string;
    chosenComicsName: string;
}

let offsetCnt = 0;

const LIMIT = 12;

function SeriesComics({ id, chosenComicsName = "" }: ISeriesComics) {
    const nav = useNavigate();

    const [isBack, setIsBack] = useState(false);

    const [comics, setComics] = useState<IComics>();

    const [visible, setVisible] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    const total = comics?.data.total || 0;

    const fetchComics = () => {
        if (!isLoading) changeIsLoadingStatus();
        axios
            .get<IComics>(
                `${BASE_URL}series/${id}/comics?${KEY_STRING}&limit=${LIMIT}
            &offset=${offsetCnt * 12}`
            )
            .then(res => {
                setComics(comics => {
                    if (!comics) return res.data;
                    else {
                        const copied = { ...comics };
                        copied.data.results.splice(
                            copied.data.results.length,
                            0,
                            ...res.data.data.results
                        );
                        return copied;
                    }
                });
                changeIsLoadingStatus();
            });
    };

    const changeIsLoadingStatus = () => setIsLoading(now => !now);

    const findTargetIndexOfComics = () => {
        if (!chosenComicsName) setVisible(0);
        else {
            setVisible(
                () =>
                    comics?.data.results.findIndex(
                        comicsElem => comicsElem.title === chosenComicsName
                    ) || 0
            );
        }
    };

    const length = comics?.data.results.length || 0;

    const showPrev = () => {
        setIsBack(true);
        setVisible(visible => (--visible === -1 ? length - 1 : visible--));
    };

    const showNext = () => {
        setIsBack(false);
        setVisible(visible => {
            if (comics?.data.results) {
                const nowTotal = comics.data.results.length;
                if (visible + 1 === nowTotal && nowTotal < total) {
                    const confirm = window.confirm(
                        "Data has reached limit. Want fetch more?"
                    );
                    if (confirm) {
                        offsetCnt++;
                        fetchComics();
                        return visible + 1;
                    }
                }
                return visible + 1 === nowTotal ? 0 : visible + 1;
            } else return 0;
        });
    };

    useEffect(() => {
        fetchComics();
        return () => {
            offsetCnt = 0;
        };
    }, []);

    useEffect(() => {
        findTargetIndexOfComics();
    }, [chosenComicsName]);

    const SlideVariant = {
        start: (isBack: boolean) => ({
            x: isBack ? -80 : 80,
            opacity: 0,
            scale: 0.75,
            transition: {
                duration: 1,
            },
        }),
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1,
            },
        },
        leave: (isBack: boolean) => ({
            x: isBack ? 80 : -80,
            opacity: 0,
            scale: 0.75,
            transition: {
                duration: 1,
            },
        }),
    };

    return (
        <>
            {isLoading && (
                // eslint-disable-next-line no-undef
                <Loading src={process.env.PUBLIC_URL + "/images/giphy.gif"} />
            )}
            <br></br>
            <p
                style={{
                    textAlign: "center",
                }}
            >
                This series contains these comics.
            </p>
            <Wrapper>
                <AnimatePresence exitBeforeEnter custom={isBack}>
                    {comics?.data.results.map((comicsElem, i) => {
                        return (
                            visible === i && (
                                <span key={comicsElem.id}>
                                    <ComicsCard
                                        path={
                                            comicsElem.thumbnail.path +
                                            "/portrait_incredible.jpg"
                                        }
                                        variants={SlideVariant}
                                        initial="start"
                                        animate="animate"
                                        exit="leave"
                                        custom={isBack}
                                        onClick={() =>
                                            nav(
                                                "/comics/detail/" +
                                                    comicsElem.id
                                            )
                                        }
                                    ></ComicsCard>
                                    <div
                                        style={{
                                            textAlign: "center",
                                        }}
                                    >
                                        <h4>{comicsElem.title}</h4>
                                        <span>
                                            <Highlighted>
                                                {visible + 1}
                                            </Highlighted>
                                            {" / " +
                                                comics?.data.results.length}
                                        </span>
                                    </div>
                                </span>
                            )
                        );
                    })}
                    <Highlighted>
                        <h5>
                            {visible === -1 &&
                                "No data. Please keep clicking the carousel."}
                        </h5>
                    </Highlighted>
                </AnimatePresence>
                <LeftArrow
                    // eslint-disable-next-line no-undef
                    src={process.env.PUBLIC_URL + "/images/arrow.png"}
                    onClick={showPrev}
                />
                <RightArrow
                    // eslint-disable-next-line no-undef
                    src={process.env.PUBLIC_URL + "/images/arrow.png"}
                    onClick={showNext}
                />
            </Wrapper>
            <Blank />
        </>
    );
}

export default SeriesComics;
