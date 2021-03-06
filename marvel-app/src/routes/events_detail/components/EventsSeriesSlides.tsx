import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import { modalVariant } from "../../comics/Comics";
import { Modal, ModalBackground, ModelImage, Title } from "../../../styled";
import { ISeriesResult } from "../../../types_store/SeriesType";
import {
    LeftArrow,
    RightArrow,
    Wrapper,
} from "../../character_detail/components/CharacterComics";
import { SeriesElem } from "../../character_detail/components/CharacterSeries";
import { useNavigate } from "react-router-dom";

const LeftArrowBox = styled.div`
    width: 55px;
    height: 95%;
    position: absolute;
    left: 0;
    background-color: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    border-radius: 0px 16px 16px 0px;
`;

const RightArrowBox = styled.div`
    width: 55px;
    height: 95%;
    position: absolute;
    right: 0;
    background-color: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    border-radius: 16px 0px 0px 16px;
`;

const SeriesSlides = styled(motion.span)`
    display: flex;
`;

const SLIDES_LIMIT = 6;

const slideVariant = {
    initial: {
        x: -window.innerWidth,
    },
    animate: {
        x: 0,
        transition: {
            duration: 1,
        },
    },
    exit: {
        x: window.innerWidth,
    },
};

function EventsSeriesSlides({
    slidesElements,
}: {
    slidesElements: ISeriesResult[];
}) {
    const nav = useNavigate();

    const [count, setCount] = useState(0);

    const [clickedSeries, setClickedSeries] = useState<ISeriesResult | null>();

    const showNext = () =>
        setCount(cnt => {
            if (slidesElements.length <= SLIDES_LIMIT) return 0;
            return cnt + 1 === Math.ceil(slidesElements.length / SLIDES_LIMIT)
                ? 0
                : cnt + 1;
        });

    const showPrevious = () =>
        setCount(cnt => {
            if (slidesElements.length <= SLIDES_LIMIT) return 0;
            return cnt - 1 === -1
                ? Math.ceil(slidesElements.length / SLIDES_LIMIT) - 1
                : cnt - 1;
        });

    const showModal = (id: number) => {
        setClickedSeries(() => {
            return slidesElements.find(slide => slide.id === id);
        });
    };

    const hideModal = () => setClickedSeries(null);

    const toSeriesDetailPage = (id?: number) => {
        nav("/comics/detail/" + id);
    };

    return (
        <Wrapper
            style={{
                position: "relative",
                maxWidth: "1950px",
                width: "100vw",
                marginBottom: "30px",
                overflow: "hidden",
            }}
        >
            <AnimatePresence>
                {slidesElements.map((slide, i) => {
                    return (
                        <SeriesSlides
                            key={slide.id}
                            layoutId={slide.id + ""}
                            variants={slideVariant}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {count * SLIDES_LIMIT <= i &&
                                i < count * SLIDES_LIMIT + SLIDES_LIMIT && (
                                    <SeriesElem
                                        path={
                                            slide.thumbnail.path +
                                            "/standard_amazing.jpg"
                                        }
                                        onClick={() => showModal(slide.id)}
                                    ></SeriesElem>
                                )}
                        </SeriesSlides>
                    );
                })}
                {clickedSeries && (
                    <ModalComponent
                        clickedSeries={clickedSeries}
                        hideModal={hideModal}
                        toSeriesDetailPage={toSeriesDetailPage}
                    />
                )}
            </AnimatePresence>
            <LeftArrowBox>
                <LeftArrow
                    style={{
                        position: "absolute",
                        left: "0",
                        right: "0",
                        margin: "auto",
                    }}
                    // eslint-disable-next-line no-undef
                    src={process.env.PUBLIC_URL + "/images/arrow.png"}
                    onClick={showPrevious}
                />
            </LeftArrowBox>
            <RightArrowBox>
                <RightArrow
                    style={{
                        position: "absolute",
                        left: "0",
                        right: "0",
                        margin: "auto",
                    }}
                    // eslint-disable-next-line no-undef
                    src={process.env.PUBLIC_URL + "/images/arrow.png"}
                    onClick={showNext}
                />
            </RightArrowBox>
        </Wrapper>
    );
}

function ModalComponent({
    clickedSeries,
    hideModal,
    toSeriesDetailPage,
}: {
    clickedSeries: ISeriesResult | null;
    hideModal: () => void;
    // eslint-disable-next-line no-unused-vars
    toSeriesDetailPage: (num?: number) => void;
}) {
    return (
        <>
            <ModalBackground
                onClick={hideModal}
                variants={modalVariant}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <Modal
                    layoutId={clickedSeries?.id + ""}
                    onClick={() =>
                        toSeriesDetailPage(clickedSeries?.id || undefined)
                    }
                >
                    <ModelImage
                        path={
                            clickedSeries?.thumbnail.path +
                            "/standard_fantastic.jpg"
                        }
                    >
                        <Title>{clickedSeries?.title}</Title>
                    </ModelImage>
                    <h5 style={{ textAlign: "center" }}>
                        {clickedSeries?.description
                            ? clickedSeries.description.length > 100
                                ? clickedSeries.description.slice(0, 150) +
                                  "..."
                                : clickedSeries.description
                            : "No Descriptions"}
                    </h5>
                </Modal>
            </ModalBackground>
        </>
    );
}

export default React.memo(EventsSeriesSlides);
