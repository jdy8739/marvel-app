import { AnimatePresence } from "framer-motion";
import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
    comicsSearchedTitleAtom,
    comicsSearchedDateAtom,
    comicsPageAtom,
} from "../../atoms";
import ButtonLine from "../../components/commons/ButtonsLine";
import ComicsCard from "../../components/commons/ComicsCard";
import { BASE_URL, KEY_STRING } from "../../key";
import {
    Blank,
    Btn,
    BtnInARow,
    Container,
    DateChooseModal,
    Highlighted,
    Input,
    Loading,
    ModalBackground,
} from "../../styled";
import { IComics } from "../../types_store/ComicsType";

const DateForm = styled.form`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
`;

const P = styled.p`
    width: 100%;
    text-align: center;
`;

export const modalVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 1,
        },
    },
};

const LIMIT = 12;

const BASE_STR = "1";

function Comics() {
    const location = useLocation();

    const paramsSearcher = new URLSearchParams(location.search);

    const [isDateModalShown, setIsDateModalShown] = useState(false);

    const showDateModal = () => setIsDateModalShown(true);

    const hideDateModal = () => setIsDateModalShown(false);

    const nowPage: string = paramsSearcher.get("page") || BASE_STR;

    const date: string[] = paramsSearcher.get("dateRange")?.split(",", 2) || [
        "",
        "",
    ];

    let formerDate = date ? date[0] : "";

    let latterDate = date ? date[1] : "";

    let title = paramsSearcher.get("title");

    let TOTAL = 0;

    const [[startDate, toDate], setDate] = useRecoilState(
        comicsSearchedDateAtom
    );

    const setSearchedComicsTitle = useSetRecoilState(comicsSearchedTitleAtom);

    const setPage = useSetRecoilState(comicsPageAtom);

    const nav = useNavigate();

    const searchInput = useRef<HTMLInputElement>(null);

    const fetchComics = async function () {
        const res = await fetch(
            `${BASE_URL}comics?${KEY_STRING}&offset=${
                (+nowPage - 1) * LIMIT
            }&limit=${LIMIT}${
                latterDate ? `&dateRange=${formerDate},${latterDate}` : ""
            }${title ? `&title=${title}` : ""}`
        );
        return await res.json();
    };

    const { data: comics, isLoading } = useQuery<IComics>(
        ["comics", nowPage, title, formerDate, latterDate],
        fetchComics,
        {
            refetchInterval: false,
            refetchOnWindowFocus: false,
        }
    );

    const setPageAndTotalNum = () => {
        setPage(+nowPage);
        if (comics?.data.total) TOTAL = comics.data.total;
    };

    const showAnotherPage = (target: number) => {
        let page;
        switch (target) {
            case 1:
                page = 1;
                break;
            case 2:
                page = +nowPage + 1;
                break;
            case 3:
                page = +nowPage - 1;
                break;
            case 4:
                page = Math.floor(TOTAL / LIMIT) + 1;
                break;
        }
        nav(
            "/comics?page=" +
                page +
                `${formerDate ? `&dateRange=${formerDate},${latterDate}` : ""}${
                    title ? `&title=${title}` : ""
                }`
        );
    };

    const showCharsOfIndex = (target: number) => {
        nav(
            "/comics?page=" + target +
                `${formerDate ? `&dateRange=${formerDate},${latterDate}` : ""}${
                    title ? `&title=${title}` : ""
                }`
        );
    };

    const preventBubbling = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleChangeStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(date => {
            const copied = [...date];
            copied[0] = e.currentTarget.value;
            return copied;
        });
    };

    const handleChangeToDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(date => {
            const copied = [...date];
            copied[1] = e.currentTarget.value;
            return copied;
        });
    };

    const handleDateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!checkDateValid()) return;
        setIsDateModalShown(false);
        nav(
            `/comics?dateRange=${startDate},${toDate}${
                title ? `&title=${title}` : ""
            }`
        );
        changeDateToChosenDate();
    };

    const checkDateValid = (): boolean => {
        if (!startDate || startDate >= toDate) {
            alert("please check whether the date is valid.");
            return false;
        } else return true;
    };

    const changeDateToChosenDate = () => {
        formerDate = startDate;
        latterDate = toDate;
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchedComicsTitle(searchInput.current?.value || "");
        nav(
            `/comics?title=${searchInput.current?.value}${
                latterDate ? `&dateRange=${formerDate},${latterDate}` : ""
            }`
        );
        title = searchInput.current?.value || "";
        fetchComics();
    };

    const resetAllCondition = () => {
        nav("/comics");
        setDate([]);
        setSearchedComicsTitle("");
        fetchComics();
    };

    setPageAndTotalNum();

    return (
        <>
            <Helmet>
                <title>Comics</title>
            </Helmet>
            <Blank />
            {isLoading && (
                <>
                    <Loading
                        // eslint-disable-next-line no-undef
                        src={process.env.PUBLIC_URL + "/images/giphy.gif"}
                    />
                    <Blank />
                </>
            )}
            {title && (
                <h1
                    style={{
                        textAlign: "center",
                    }}
                >
                    Results for &quot;<Highlighted>{title}</Highlighted>&quot;
                </h1>
            )}
            <Container>
                <BtnInARow>
                    <form onSubmit={handleSearchSubmit}>
                        <Input
                            placeholder="search title you look for."
                            style={{
                                width: "175px",
                            }}
                            required
                            ref={searchInput}
                        />
                        &ensp;
                        <Btn>search</Btn>
                    </form>
                </BtnInARow>
                <BtnInARow>
                    <Btn onClick={showDateModal}>search by date</Btn>
                </BtnInARow>
                <BtnInARow style={{ marginBottom: "28px" }}>
                    <Btn onClick={resetAllCondition}>reset</Btn>
                </BtnInARow>
                {comics?.data.results.length === 0 ? (
                    <p>Sorry. No data. :(</p>
                ) : (
                    <>
                        {comics?.data.results.map((comic, index) => 
                        <ComicsCard comic={comic} index={index}/>)}
                    </>
                )}
            </Container>
            <br></br>
            <div
                style={{
                    textAlign: "center",
                }}
            >
                <Btn onClick={() => showAnotherPage(1)}>first</Btn>
                <Btn
                    onClick={() => showAnotherPage(3)}
                    disabled={+nowPage === 1}
                >
                    prev
                </Btn>
                <ButtonLine
                    TOTAL={TOTAL}
                    LIMIT={LIMIT}
                    nowPage={+nowPage}
                    moveFunction={showCharsOfIndex}
                />
                <Btn
                    onClick={() => showAnotherPage(2)}
                    disabled={+nowPage >= TOTAL / LIMIT}
                >
                    next
                </Btn>
                <Btn onClick={() => showAnotherPage(4)}>last</Btn>
            </div>
            <AnimatePresence>
                {isDateModalShown && (
                    <ModalBackground
                        onClick={hideDateModal}
                        variants={modalVariant}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <DateChooseModal
                            onClick={preventBubbling}
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <DateForm onSubmit={handleDateSubmit}>
                                <P>from</P>
                                <Input
                                    type="date"
                                    onChange={handleChangeStartDate}
                                    value={startDate}
                                />
                                <P>to</P>
                                <Input
                                    type="date"
                                    onChange={handleChangeToDate}
                                    value={toDate}
                                />
                                <P></P>
                                <Btn>search</Btn>
                            </DateForm>
                        </DateChooseModal>
                    </ModalBackground>
                )}
            </AnimatePresence>
            <Blank />
        </>
    );
}

export default Comics;
