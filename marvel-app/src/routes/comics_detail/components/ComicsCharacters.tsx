import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BASE_URL, KEY_STRING } from "../../../key";
import {
    CharTitle,
    CenterWord,
    Container,
    ModalBackground,
    RoundModal,
    RoundPortrait,
    RoundPortraitName,
    Blank,
    Loading,
} from "../../../styled";
import {
    ICharacterResult,
    ICharacter,
} from "../../../types_store/CharatersType";
import React from "react";
import { useNavigate } from "react-router-dom";

type TypeCharResult = ICharacterResult | undefined;

function ComicsCharacters({ id }: { id: string }) {
    const nav = useNavigate();

    const [chars, setChars] = useState<ICharacter>();

    const [isLoading, setIsLoading] = useState(true);

    const [clickedChar, setClickedChar] = useState<TypeCharResult>(undefined);

    const fetchCharactersInThisComic = () => {
        axios.get<ICharacter>(`${BASE_URL}comics/${id}/characters?${KEY_STRING}`)
            .then(res => {
                setChars(res.data);
                setIsLoading(false);
            });
    };

    const showModal = (id: number) => {
        setClickedChar(findTargetChar(id));
    };

    const hideModal = () => {
        setClickedChar(undefined);
    };

    const findTargetChar = (id: number): TypeCharResult => {
        return chars?.data.results.find(char => char.id === id);
    };

    useEffect(() => {
        fetchCharactersInThisComic();
    }, []);

    return (
        <>
            {isLoading ? (
                // eslint-disable-next-line no-undef
                <Loading src={process.env.PUBLIC_URL + "/images/giphy.gif"} />
            ) : null}
            <Container>
                {chars?.data.results.length === 0 ? (
                    <p>Sorry. No data. :(</p>
                ) : (
                    <>
                        {chars?.data.results.map(char => {
                            return (
                                <motion.span
                                    key={char.id}
                                    layoutId={char.id + ""}
                                >
                                    {clickedChar?.id === char.id ? (
                                        <RoundPortrait />
                                    ) : (
                                        <RoundPortrait
                                            path={
                                                char.thumbnail.path +
                                                "/standard_xlarge.jpg"
                                            }
                                            onClick={() => showModal(char.id)}
                                        >
                                            <RoundPortraitName>
                                                {char.name.split("(", 2)[0]}
                                            </RoundPortraitName>
                                        </RoundPortrait>
                                    )}
                                </motion.span>
                            );
                        })}
                    </>
                )}
                <AnimatePresence>
                    {clickedChar && (
                        <ModalBackground onClick={hideModal}>
                            <RoundModal
                                path={
                                    clickedChar.thumbnail.path +
                                    "/standard_fantastic.jpg"
                                }
                                layoutId={clickedChar.id + ""}
                                onClick={() =>
                                    nav("/characters/detail/" + clickedChar.id)
                                }
                            >
                                <CenterWord>click to see more</CenterWord>
                                <CharTitle>{clickedChar.name}</CharTitle>
                            </RoundModal>
                        </ModalBackground>
                    )}
                </AnimatePresence>
            </Container>
            <Blank />
        </>
    );
}

export default ComicsCharacters;
