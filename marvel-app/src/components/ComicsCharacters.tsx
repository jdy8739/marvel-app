import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { apikey, BASE_URL, GET_ON_COMICS, hash } from "../api";
import { CharTitle, CenterWord, Container, Modal, ModalBackground, RoundModal, RoundPortrait, RoundPortraitName } from "../styled";
import { ICharacterResult, ICharacter } from "../types_store/CharatersType";

type TypeCharResult = ICharacterResult | undefined;

function ComicsCharacters({ id }: { id: string }) {

    const [chars, setChars] = useState<ICharacter>();

    const fetchCharactersInThisComic = () => {
        axios.get<ICharacter>(`${BASE_URL}${GET_ON_COMICS}/${id}/characters?ts=1&apikey=${apikey}&hash=${hash}`)
            .then(res => {
                setChars(res.data);
            });
    };

    useEffect(() => {
        fetchCharactersInThisComic();
    }, []);

    const [clickedChar, setClickedChar] = useState<TypeCharResult>(undefined);

    const showModal = (id: number) => {
        setClickedChar(findTargetChar(id));
    };

    const hideModal = () => {
        setClickedChar(undefined);
    };

    const findTargetChar = (id: number) :TypeCharResult => {
        return chars?.data.results.find(char => char.id == id);
    };

    return (
        <>
            <Container>
                {
                    chars?.data.results.length === 0 ? 
                    <p>Sorry. No data. :(</p> :
                    <>
                        {
                            chars?.data.results.map(char => {
                                return (
                                    <RoundPortrait
                                    layoutId={char.id + ''}
                                    key={char.id}
                                    path={char.thumbnail.path + "/standard_xlarge.jpg"}
                                    onClick={() => showModal(char.id)}
                                    >
                                        <RoundPortraitName>{ char.name.split('(', 2)[0] }</RoundPortraitName>
                                    </RoundPortrait>
                                )
                            })
                        }
                    </>
                }
                {
                    !clickedChar ? null :
                    <AnimatePresence>
                        <ModalBackground
                        onClick={hideModal}
                        >
                            <RoundModal 
                            path={clickedChar.thumbnail.path + '/standard_fantastic.jpg'}
                            layoutId={clickedChar.id + ''}
                            >   
                                <CenterWord>click to see more</CenterWord>
                                <CharTitle>{ clickedChar.name }</CharTitle>
                            </RoundModal>
                        </ModalBackground>
                    </AnimatePresence>
                }
            </Container>
        </>
    )
};

export default ComicsCharacters;