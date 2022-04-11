import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apikey, BASE_URL, GET_SERIES, hash } from "../api";
import { Blank, CenterWord, CharTitle, Container, ModalBackground, RoundModal, RoundPortrait, RoundPortraitName } from "../styled";
import { ICharacter, ICharacterResult } from "../types_store/CharatersType";

type TypeCharResult = ICharacterResult | undefined;

function SeriesCharacters({ id }: { id: string }) {

    const [chars, setChars] = useState<ICharacter>();

    const fetchChars = () => {
        axios.get<ICharacter>
        (`${BASE_URL}${GET_SERIES}/${id}/characters?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setChars(res.data);
            });
    };

    useEffect(() => {
        fetchChars();
    }, []);

    const [clickedChar, setClickedChar] = useState<TypeCharResult>(undefined);

    const findTargetChar = (id: number) :TypeCharResult => {
        return chars?.data.results.find(char => char.id === id);
    };

    const showModal = (id: number) => {
        setClickedChar(findTargetChar(id));
    };

    const hideModal = () => setClickedChar(undefined);

    const toCharDetailPage = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        nav('/characters/detail/' + clickedChar?.id);
    };

    const nav = useNavigate();

    return (
        <>  
            <br></br>
            {
                chars?.data.results.length === 0 ?
                <p style={{ textAlign: 'center' }}>Sorry. No data. :(</p> :
                <Container>
                    {
                        chars?.data.results.map(char => {
                            return(
                                <motion.span
                                key={char.id}
                                layoutId={char.id + ''}
                                >
                                    <RoundPortrait
                                    path={char.thumbnail.path + '/standard_xlarge.jpg'}
                                    onClick={() => showModal(char.id)}
                                    >
                                        <RoundPortraitName>{ char.name.split('(', 2)[0] }</RoundPortraitName>
                                    </RoundPortrait>
                                </motion.span>
                            )
                        })
                    }
                </Container>
            }
            <AnimatePresence>
                {
                    !clickedChar ? null : 
                    <ModalBackground
                    onClick={hideModal}
                    >
                        <RoundModal
                        path={clickedChar.thumbnail.path + '/standard_fantastic.jpg'}
                        onClick={toCharDetailPage}
                        layoutId={clickedChar.id + ''}
                        >
                            <CenterWord>click to see more</CenterWord>
                            <CharTitle>{ clickedChar.name }</CharTitle>
                        </RoundModal>
                    </ModalBackground>
                }
            </AnimatePresence>
        </>
    )
};

export default SeriesCharacters;