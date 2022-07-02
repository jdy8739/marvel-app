import React, { useRef } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { charPageAtom, charStartsWithAtom, charNameAtom } from "../../atoms";
import ButtonLine from "../../components/commons/ButtonsLine";
import CharacterCard from "../../components/commons/CharacterCard";
import { BASE_URL, KEY_STRING } from "../../key";
import {
    Highlighted,
    Container,
    Btn,
    Input,
    Blank,
    BtnInARow,
    Loading,
} from "../../styled";
import { ICharacter } from "../../types_store/CharatersType";

const CharIcon = styled.span`
    padding: 5px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
        color: #f0131e;
    }
`;

const LIMIT = 30;

const BASE_STR = "1";

const charArr: string[] = [];

for (let i = 65; i < 91; i++) {
    charArr.push(String.fromCharCode(i));
}

function Characters() {
    const location = useLocation();

    const paramsSearcher = new URLSearchParams(location.search);

    const nav = useNavigate();

    let startsWith = paramsSearcher.get("nameStartsWith");

    let nowPage = paramsSearcher.get("page") || BASE_STR;

    let name = paramsSearcher.get("name");

    let TOTAL = 0;

    const [charName, setCharName] = useRecoilState(charNameAtom);

    const setCharStartsWith = useSetRecoilState(charStartsWithAtom);

    const setCharPage = useSetRecoilState(charPageAtom);

    const nameSearchRef = useRef<HTMLInputElement>(null);

    const fetchCharacters = async () => {
        const res = await fetch(
            `${BASE_URL}characters?${KEY_STRING}&offset=${
                (+nowPage - 1) * LIMIT
            }&limit=${LIMIT}${
                startsWith ? `&nameStartsWith=${startsWith}` : ""
            }${name ? `&name=${name}` : ""}`
        );
        return await res.json();
    };

    const { data: chars, isLoading } = useQuery<ICharacter>(
        ["characters", nowPage, startsWith, name],
        fetchCharacters,
        {
            refetchOnWindowFocus: false,
            refetchInterval: false,
        }
    );

    const setPageAndTotalNum = () => {
        setCharPage(+nowPage);
        if (chars?.data) {
            TOTAL = chars?.data.total;
        }
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
            `/characters?page=${page}${
                startsWith ? `&nameStartsWith=${startsWith}` : ""
            }${name ? `&name=${name}` : ""}`
        );
    };

    const showCharsOfIndex = (idx: number) => {
        nav(
            `/characters?page=${idx}${
                startsWith ? `&nameStartsWith=${startsWith}` : ""
            }${name ? `&name=${name}` : ""}`
        );
    };

    const resetSearch = () => nav("/characters");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharName(e.currentTarget.value);
    };

    const handleSearchNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchedChar = nameSearchRef.current?.value || "";
        setCharName(searchedChar);
        setCharStartsWith("");
        nav(`/characters?name=${searchedChar}`);
    };

    const handleStartsWithClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        const searchedCharName = e.currentTarget.textContent || "";
        setCharStartsWith(searchedCharName);
        setCharName("");
        nav(`/characters?nameStartsWith=${searchedCharName}`);
    };

    setPageAndTotalNum();

    return (
        <>
            <Helmet>
                <title>Marvel Characters</title>
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
            {Boolean(startsWith || name) && (
                <h1
                    style={{
                        textAlign: "center",
                    }}
                >
                    Results for &quot;
                    <Highlighted>{startsWith || name}</Highlighted>
                    &quot;
                </h1>
            )}
            <Container>
                <BtnInARow>
                    {charArr.map(char => (
                        <CharIcon onClick={handleStartsWithClick} key={char}>
                            {char}
                        </CharIcon>
                    ))}
                </BtnInARow>
                <BtnInARow>
                    <form
                        style={{
                            display: "inline-block",
                        }}
                        onSubmit={handleSearchNameSubmit}
                    >
                        <Input
                            onChange={handleSearchChange}
                            value={charName}
                            required
                            style={{
                                width: "170px",
                            }}
                            placeholder="search the character name."
                            ref={nameSearchRef}
                        />
                        &ensp;
                        <Btn>search</Btn>
                    </form>
                </BtnInARow>
                <BtnInARow style={{ marginBottom: "28px" }}>
                    <Btn onClick={resetSearch}>reset</Btn>
                </BtnInARow>
                {chars?.data.results.length !== 0 ? (
                    <>
                        {chars?.data.results.map(char => {
                            return (
                                <span
                                    key={char.id}
                                    onClick={() =>
                                        nav(`/characters/detail/${char.id}`)
                                    }
                                >
                                    <CharacterCard char={char} />
                                </span>
                            );
                        })}
                    </>
                ) : (
                    <p>cannot find any results. :(</p>
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
                    disabled={
                        TOTAL
                            ? +nowPage === Math.floor(TOTAL / LIMIT) + 1
                            : false
                    }
                >
                    next
                </Btn>
                <Btn onClick={() => showAnotherPage(4)}>last</Btn>
            </div>
            <Blank />
        </>
    );
}

export default Characters;
